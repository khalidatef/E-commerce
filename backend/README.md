# PHP Backend Setup

## 1. Import the database

```bash
mariadb --socket=/tmp/mysql.sock -ukhalidatef < backend/db/ecommerce_php_api.sql
```

If your MariaDB setup uses different credentials, update the command and the values in [config.php](/Users/khalidatef/Documents/E-commerce/backend/config.php:1).

## 2. Configure the database connection

The backend reads these environment variables if you want to override the defaults:

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SOCKET`

Defaults are defined in [config.php](/Users/khalidatef/Documents/E-commerce/backend/config.php:1).

## 3. Run the project with PHP

From the repository root:

```bash
php -S 127.0.0.1:8000
```

Then open:

- `http://127.0.0.1:8000/index.html`
- `http://127.0.0.1:8000/products.html`
- `http://127.0.0.1:8000/login.html`

## API Files

- [products.php](/Users/khalidatef/Documents/E-commerce/backend/api/products.php:1)
- [cart.php](/Users/khalidatef/Documents/E-commerce/backend/api/cart.php:1)
- [checkout.php](/Users/khalidatef/Documents/E-commerce/backend/api/checkout.php:1)
- [login.php](/Users/khalidatef/Documents/E-commerce/backend/api/auth/login.php:1)
- [register.php](/Users/khalidatef/Documents/E-commerce/backend/api/auth/register.php:1)
