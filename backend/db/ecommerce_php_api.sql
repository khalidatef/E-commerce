CREATE DATABASE IF NOT EXISTS ecommerce_php_api
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ecommerce_php_api;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY categories_name_unique (name),
    UNIQUE KEY categories_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    rating_count INT UNSIGNED NOT NULL DEFAULT 0,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY products_category_id_index (category_id),
    CONSTRAINT products_category_id_foreign FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY cart_items_user_product_unique (user_id, product_id),
    KEY cart_items_product_id_index (product_id),
    CONSTRAINT cart_items_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT cart_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    shipping_method VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'placed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY orders_user_id_index (user_id),
    CONSTRAINT orders_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    title_snapshot VARCHAR(255) NOT NULL,
    price_snapshot DECIMAL(10,2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    KEY order_items_order_id_index (order_id),
    KEY order_items_product_id_index (product_id),
    CONSTRAINT order_items_order_id_foreign FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT order_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categories (id, name, slug) VALUES
    (1, 'Men''s clothing', 'mens-clothing'),
    (2, 'Jewelery', 'jewelery'),
    (3, 'Electronics', 'electronics'),
    (4, 'Women''s clothing', 'womens-clothing');

INSERT INTO products (
    category_id,
    title,
    description,
    price,
    image_url,
    rating,
    rating_count,
    stock
) VALUES
    (1, 'Premium Cotton Jacket', 'A lightweight daily jacket tailored for smart casual styling.', 89.99, 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', 4.60, 120, 14),
    (1, 'Classic Fit T-Shirt', 'Soft premium cotton t-shirt that works for every season.', 24.50, 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', 4.30, 84, 35),
    (2, 'Solid Gold Petite Micropave', 'Elegant micropave ring with a minimal design for daily wear.', 168.00, 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg', 4.90, 65, 8),
    (2, 'White Gold Plated Princess', 'Polished princess ring with a balanced luxury finish.', 129.99, 'https://fakestoreapi.com/img/71yaEDq9SLL._AC_UL640_QL65_ML3_.jpg', 4.70, 49, 10),
    (3, 'Portable SSD 1TB', 'Fast portable storage for creators, students, and everyday backups.', 112.40, 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', 4.80, 201, 22),
    (3, 'Gaming Monitor 27 Inch', 'Sharp 27-inch display with rich color and smooth response.', 299.00, 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg', 4.50, 77, 9),
    (4, 'Floral Summer Dress', 'Breathable summer dress with a relaxed silhouette and soft lining.', 58.75, 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', 4.40, 92, 16),
    (4, 'Women''s Casual Blouse', 'Clean-cut blouse designed for office wear and weekend outfits.', 42.20, 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', 4.20, 57, 19);
