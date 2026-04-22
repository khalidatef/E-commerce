<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use App\ApiResponse;
use App\Authenticate;
use App\Cart;

$method = ApiResponse::method(['GET', 'POST', 'PATCH', 'DELETE']);
$auth = new Authenticate();
$user = $auth->requireAuth();
$userId = (int) $user['id'];
$cart = new Cart();

if ($method === 'GET') {
    ApiResponse::success([
        'cart' => $cart->getItems($userId),
        'totals' => $cart->getTotals($userId),
    ]);
}

$payload = ApiResponse::readJson();
$productId = (int) ($payload['product_id'] ?? $_GET['product_id'] ?? 0);

if ($productId <= 0) {
    ApiResponse::error('Product id is required.', 422);
}

if ($method === 'POST') {
    $quantity = (int) ($payload['quantity'] ?? 1);
    $items = $cart->addItem($userId, $productId, $quantity);

    ApiResponse::success([
        'cart' => $items,
        'totals' => $cart->getTotals($userId),
    ], 'Cart updated successfully.');
}

if ($method === 'PATCH') {
    $quantity = (int) ($payload['quantity'] ?? 0);
    $items = $cart->updateItem($userId, $productId, $quantity);

    ApiResponse::success([
        'cart' => $items,
        'totals' => $cart->getTotals($userId),
    ], 'Cart item updated successfully.');
}

$items = $cart->deleteItem($userId, $productId);

ApiResponse::success([
    'cart' => $items,
    'totals' => $cart->getTotals($userId),
], 'Cart item removed successfully.');
