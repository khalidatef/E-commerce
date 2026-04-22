<?php

declare(strict_types=1);

namespace App;

use mysqli;
use mysqli_sql_exception;
use RuntimeException;

class DB
{
    private static ?mysqli $sharedConnection = null;

    public mysqli $connection;

    public function __construct()
    {
        if (self::$sharedConnection instanceof mysqli) {
            $this->connection = self::$sharedConnection;
            return;
        }

        $settings = $GLOBALS['app_config']['database'] ?? [];
        $socket = (string) ($settings['socket'] ?? '');

        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

        try {
            self::$sharedConnection = new mysqli(
                (string) ($settings['host'] ?? '127.0.0.1'),
                (string) ($settings['username'] ?? 'root'),
                (string) ($settings['password'] ?? ''),
                (string) ($settings['database'] ?? ''),
                (int) ($settings['port'] ?? 3306),
                $socket
            );
            self::$sharedConnection->set_charset('utf8mb4');
        } catch (mysqli_sql_exception $exception) {
            throw new RuntimeException('Database connection failed: ' . $exception->getMessage(), 0, $exception);
        }

        $this->connection = self::$sharedConnection;
    }
}
