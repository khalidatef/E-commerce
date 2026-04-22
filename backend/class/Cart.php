<?php

declare(strict_types=1);

namespace App;

class Cart
{
    public function getItems(int $userId): array
    {
        $db = new DB();
        $statement = $db->connection->prepare(
            '
                SELECT
                    ci.product_id,
                    ci.quantity,
                    p.title,
                    p.description,
                    p.price,
                    p.image_url,
                    p.rating,
                    p.rating_count,
                    p.stock,
                    c.name AS category_name
                FROM cart_items ci
                INNER JOIN products p ON p.id = ci.product_id
                INNER JOIN categories c ON c.id = p.category_id
                WHERE ci.user_id = ?
                ORDER BY ci.updated_at DESC, ci.id DESC
            '
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $result = $statement->get_result();

        $items = [];

        while ($row = $result->fetch_assoc()) {
            $items[] = $this->formatCartItem($row);
        }

        return $items;
    }

    public function getTotals(int $userId): array
    {
        $items = $this->getItems($userId);
        $subtotal = 0.0;
        $itemCount = 0;

        foreach ($items as $item) {
            $subtotal += (float) $item['line_total'];
            $itemCount += (int) $item['quantity'];
        }

        return [
            'subtotal' => round($subtotal, 2),
            'items_count' => $itemCount,
            'unique_items' => count($items),
        ];
    }

    public function addItem(int $userId, int $productId, int $quantity = 1): array
    {
        if ($quantity < 1) {
            ApiResponse::error('Quantity must be at least 1.', 422);
        }

        $product = (new Product())->getById($productId);

        if ($product === null) {
            ApiResponse::error('Product not found.', 404);
        }

        $db = new DB();
        $statement = $db->connection->prepare(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1'
        );
        $statement->bind_param('ii', $userId, $productId);
        $statement->execute();
        $existingItem = $statement->get_result()->fetch_assoc();

        $newQuantity = $quantity;
        if ($existingItem) {
            $newQuantity += (int) $existingItem['quantity'];
        }

        if ($newQuantity > (int) $product['stock']) {
            ApiResponse::error('Requested quantity exceeds available stock.', 422);
        }

        if ($existingItem) {
            $updateStatement = $db->connection->prepare(
                'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?'
            );
            $itemId = (int) $existingItem['id'];
            $updateStatement->bind_param('ii', $newQuantity, $itemId);
            $updateStatement->execute();
        } else {
            $insertStatement = $db->connection->prepare(
                'INSERT INTO cart_items (user_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())'
            );
            $insertStatement->bind_param('iii', $userId, $productId, $quantity);
            $insertStatement->execute();
        }

        return $this->getItems($userId);
    }

    public function updateItem(int $userId, int $productId, int $quantity): array
    {
        if ($quantity <= 0) {
            return $this->deleteItem($userId, $productId);
        }

        $product = (new Product())->getById($productId);

        if ($product === null) {
            ApiResponse::error('Product not found.', 404);
        }

        if ($quantity > (int) $product['stock']) {
            ApiResponse::error('Requested quantity exceeds available stock.', 422);
        }

        $db = new DB();
        $existingStatement = $db->connection->prepare(
            'SELECT id FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1'
        );
        $existingStatement->bind_param('ii', $userId, $productId);
        $existingStatement->execute();

        if ($existingStatement->get_result()->num_rows === 0) {
            ApiResponse::error('Cart item not found.', 404);
        }

        $statement = $db->connection->prepare(
            'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?'
        );
        $statement->bind_param('iii', $quantity, $userId, $productId);
        $statement->execute();

        return $this->getItems($userId);
    }

    public function deleteItem(int $userId, int $productId): array
    {
        $db = new DB();
        $statement = $db->connection->prepare(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?'
        );
        $statement->bind_param('ii', $userId, $productId);
        $statement->execute();

        return $this->getItems($userId);
    }

    public function clear(int $userId): void
    {
        $db = new DB();
        $statement = $db->connection->prepare('DELETE FROM cart_items WHERE user_id = ?');
        $statement->bind_param('i', $userId);
        $statement->execute();
    }

    private function formatCartItem(array $row): array
    {
        $quantity = (int) $row['quantity'];
        $price = (float) $row['price'];

        return [
            'id' => (int) $row['product_id'],
            'title' => (string) $row['title'],
            'price' => $price,
            'description' => (string) $row['description'],
            'category' => (string) $row['category_name'],
            'image' => (string) $row['image_url'],
            'rating' => [
                'rate' => (float) $row['rating'],
                'count' => (int) $row['rating_count'],
            ],
            'stock' => (int) $row['stock'],
            'quantity' => $quantity,
            'line_total' => round($price * $quantity, 2),
        ];
    }
}
