<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use App\ApiResponse;
use App\Product;

ApiResponse::method(['GET']);

$products = (new Product())->getAll();

ApiResponse::success(['products' => $products]);
