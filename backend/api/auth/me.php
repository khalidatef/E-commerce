<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/bootstrap.php';

use App\ApiResponse;
use App\Authenticate;

ApiResponse::method(['GET']);

$auth = new Authenticate();
$user = $auth->currentUser();

if ($user === null) {
    ApiResponse::error('Not authenticated.', 401);
}

ApiResponse::success(['user' => $user]);
