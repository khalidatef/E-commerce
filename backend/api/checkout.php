<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use App\ApiResponse;
use App\Authenticate;
use App\Order;

ApiResponse::method(['POST']);

$auth = new Authenticate();
$user = $auth->requireAuth();
$payload = ApiResponse::readJson();
$shippingMethod = (string) ($payload['shipping_method'] ?? '');

$order = (new Order())->checkout((int) $user['id'], $shippingMethod);

ApiResponse::success($order, 'Order placed successfully.', 201);
