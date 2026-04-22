<?php

declare(strict_types=1);

namespace App;

class Product
{
    public function getAll(): array
    {
        $db = new DB();
        $query = '
            SELECT
                p.id,
                p.title,
                p.description,
                p.price,
                p.image_url,
                p.rating,
                p.rating_count,
                p.stock,
                c.name AS category_name
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            ORDER BY p.id ASC
        ';

        $result = $db->connection->query($query);
        $products = [];

        while ($row = $result->fetch_assoc()) {
            $products[] = $this->formatProduct($row);
        }

        return $products;
    }

    public function getById(int $productId): ?array
    {
        $db = new DB();
        $statement = $db->connection->prepare(
            '
                SELECT
                    p.id,
                    p.title,
                    p.description,
                    p.price,
                    p.image_url,
                    p.rating,
                    p.rating_count,
                    p.stock,
                    c.name AS category_name
                FROM products p
                INNER JOIN categories c ON c.id = p.category_id
                WHERE p.id = ?
                LIMIT 1
            '
        );
        $statement->bind_param('i', $productId);
        $statement->execute();
        $row = $statement->get_result()->fetch_assoc();

        if (!$row) {
            return null;
        }

        return $this->formatProduct($row);
    }

    private function formatProduct(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'title' => (string) $row['title'],
            'price' => (float) $row['price'],
            'description' => (string) $row['description'],
            'category' => (string) $row['category_name'],
            'image' => (string) $row['image_url'],
            'rating' => [
                'rate' => (float) $row['rating'],
                'count' => (int) $row['rating_count'],
            ],
            'stock' => (int) $row['stock'],
        ];
    }
}
