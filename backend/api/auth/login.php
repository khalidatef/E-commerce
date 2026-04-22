<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/bootstrap.php';

use App\ApiResponse;
use App\Authenticate;

ApiResponse::method(['POST']);

$auth = new Authenticate();
$user = $auth->login(ApiResponse::readJson());

ApiResponse::success(
    ['user' => $user],
    'Login successful.'
);
