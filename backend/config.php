<?php

declare(strict_types=1);

return [
    'database' => [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'database' => getenv('DB_DATABASE') ?: 'ecommerce_php_api',
        'username' => getenv('DB_USERNAME') ?: 'root',
        'password' => getenv('DB_PASSWORD') ?: '',
        'port' => (int) (getenv('DB_PORT') ?: 3306),
        'socket' => getenv('DB_SOCKET') ?: '',
    ],
];
