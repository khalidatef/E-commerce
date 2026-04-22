<?php

declare(strict_types=1);

namespace App;

use RuntimeException;
use Throwable;

class Order
{
    public function checkout(int $userId, string $shippingMethod): array
    {
        $normalizedMethod = strtolower(trim($shippingMethod));
        $shippingCost = match ($normalizedMethod) {
            'pickup' => 0.0,
            'delivery' => 9.9,
            default => null,
        };

        if ($shippingCost === null) {
            ApiResponse::error('Invalid shipping method.', 422);
        }

        $cart = new Cart();
        $items = $cart->getItems($userId);

        if ($items === []) {
            ApiResponse::error('Your cart is empty.', 422);
        }

        $subtotal = 0.0;
        foreach ($items as $item) {
            $subtotal += (float) $item['line_total'];
        }
        $subtotal = round($subtotal, 2);
        $total = round($subtotal + $shippingCost, 2);

        $db = new DB();
        $connection = $db->connection;
        $connection->begin_transaction();

        try {
            foreach ($items as $item) {
                $stockStatement = $connection->prepare('SELECT stock FROM products WHERE id = ? FOR UPDATE');
                $productId = (int) $item['id'];
                $stockStatement->bind_param('i', $productId);
                $stockStatement->execute();
                $product = $stockStatement->get_result()->fetch_assoc();

                if (!$product) {
                    throw new RuntimeException("Product #{$productId} no longer exists.");
                }

                if ((int) $product['stock'] < (int) $item['quantity']) {
                    throw new RuntimeException("Not enough stock for {$item['title']}.");
                }

                $updateStockStatement = $connection->prepare(
                    'UPDATE products SET stock = stock - ?, updated_at = NOW() WHERE id = ?'
                );
                $quantity = (int) $item['quantity'];
                $updateStockStatement->bind_param('ii', $quantity, $productId);
                $updateStockStatement->execute();
            }

            $insertOrderStatement = $connection->prepare(
                'INSERT INTO orders (user_id, subtotal, shipping_cost, total, shipping_method, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())'
            );
            $status = 'placed';
            $insertOrderStatement->bind_param('idddss', $userId, $subtotal, $shippingCost, $total, $normalizedMethod, $status);
            $insertOrderStatement->execute();
            $orderId = (int) $connection->insert_id;

            $insertOrderItemStatement = $connection->prepare(
                'INSERT INTO order_items (order_id, product_id, title_snapshot, price_snapshot, quantity) VALUES (?, ?, ?, ?, ?)'
            );

            foreach ($items as $item) {
                $productId = (int) $item['id'];
                $title = (string) $item['title'];
                $price = (float) $item['price'];
                $quantity = (int) $item['quantity'];
                $insertOrderItemStatement->bind_param('iisdi', $orderId, $productId, $title, $price, $quantity);
                $insertOrderItemStatement->execute();
            }

            $clearCartStatement = $connection->prepare('DELETE FROM cart_items WHERE user_id = ?');
            $clearCartStatement->bind_param('i', $userId);
            $clearCartStatement->execute();

            $connection->commit();

            return [
                'order' => [
                    'id' => $orderId,
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'shipping_method' => $normalizedMethod,
                    'status' => $status,
                    'items_count' => count($items),
                ],
            ];
        } catch (Throwable $throwable) {
            $connection->rollback();
            ApiResponse::error($throwable->getMessage(), 422);
        }
    }
}
