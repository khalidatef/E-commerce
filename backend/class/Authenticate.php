<?php

declare(strict_types=1);

namespace App;

class Authenticate
{
    public function currentUser(): ?array
    {
        if (!isset($_SESSION['userID'])) {
            return null;
        }

        return [
            'id' => (int) $_SESSION['userID'],
            'name' => (string) ($_SESSION['userName'] ?? ''),
            'email' => (string) ($_SESSION['userEmail'] ?? ''),
            'is_admin' => (bool) ($_SESSION['userIsAdmin'] ?? false),
        ];
    }

    public function requireAuth(): array
    {
        $user = $this->currentUser();

        if ($user === null) {
            ApiResponse::error('Authentication required.', 401);
        }

        return $user;
    }

    public function register(array $input): array
    {
        $name = trim((string) ($input['name'] ?? ''));
        $email = trim((string) ($input['email'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        $isAdmin = !empty($input['is_admin']) ? 1 : 0;

        if ($name === '' || $email === '' || $password === '') {
            ApiResponse::error('All fields are required.', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            ApiResponse::error('Please enter a valid email address.', 422);
        }

        if (strlen($name) < 3) {
            ApiResponse::error('Name must be at least 3 characters.', 422);
        }

        if (strlen($password) < 6) {
            ApiResponse::error('Password must be at least 6 characters.', 422);
        }

        $db = new DB();

        $checkStatement = $db->connection->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $checkStatement->bind_param('s', $email);
        $checkStatement->execute();

        if ($checkStatement->get_result()->num_rows > 0) {
            ApiResponse::error('Email already exists.', 409);
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $insertStatement = $db->connection->prepare(
            'INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, ?, NOW())'
        );
        $insertStatement->bind_param('sssi', $name, $email, $hashedPassword, $isAdmin);
        $insertStatement->execute();

        return [
            'id' => (int) $db->connection->insert_id,
            'name' => $name,
            'email' => $email,
            'is_admin' => (bool) $isAdmin,
        ];
    }

    public function login(array $input): array
    {
        $email = trim((string) ($input['email'] ?? ''));
        $password = (string) ($input['password'] ?? '');

        if ($email === '' || $password === '') {
            ApiResponse::error('Email and password are required.', 422);
        }

        $db = new DB();
        $statement = $db->connection->prepare(
            'SELECT id, name, email, password, is_admin FROM users WHERE email = ? LIMIT 1'
        );
        $statement->bind_param('s', $email);
        $statement->execute();

        $user = $statement->get_result()->fetch_assoc();

        if (!$user || !password_verify($password, (string) $user['password'])) {
            ApiResponse::error('Invalid email or password.', 401);
        }

        session_regenerate_id(true);
        $this->storeSession($user);

        return $this->currentUser();
    }

    public function logout(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }

        session_destroy();
    }

    private function storeSession(array $user): void
    {
        $_SESSION['userID'] = (int) $user['id'];
        $_SESSION['userName'] = (string) $user['name'];
        $_SESSION['userEmail'] = (string) $user['email'];
        $_SESSION['userIsAdmin'] = (bool) $user['is_admin'];
    }
}
