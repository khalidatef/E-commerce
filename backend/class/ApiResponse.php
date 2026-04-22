<?php

declare(strict_types=1);

namespace App;

class ApiResponse
{
    public static function json(array $payload, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(array $data = [], string $message = 'OK', int $status = 200): never
    {
        self::json(
            array_merge(
                [
                    'success' => true,
                    'message' => $message,
                ],
                $data
            ),
            $status
        );
    }

    public static function error(string $message, int $status = 400, array $data = []): never
    {
        self::json(
            array_merge(
                [
                    'success' => false,
                    'message' => $message,
                ],
                $data
            ),
            $status
        );
    }

    public static function method(array $allowedMethods): string
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        if (!in_array($method, $allowedMethods, true)) {
            self::error('Method not allowed.', 405, ['allowed_methods' => $allowedMethods]);
        }

        return $method;
    }

    public static function readJson(): array
    {
        $rawBody = file_get_contents('php://input');

        if ($rawBody === false || trim($rawBody) === '') {
            return [];
        }

        $decoded = json_decode($rawBody, true);

        if (!is_array($decoded)) {
            self::error('Invalid JSON payload.', 400);
        }

        return $decoded;
    }
}
