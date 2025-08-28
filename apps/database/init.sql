CREATE DATABASE user_data;
USE user_data;

CREATE TABLE roles (
    role_name VARCHAR(16) NOT NULL,
    PRIMARY KEY(role_name)
);

CREATE TABLE users (
    user_id INT UNSIGNED AUTO_INCREMENT,
    discord_id BIGINT UNSIGNED NOT NULL UNIQUE,
    role_name VARCHAR(16),
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_name) REFERENCES roles(role_name) ON DELETE SET NULL
);

CREATE TABLE books (
    book_id INT UNSIGNED AUTO_INCREMENT,
    book_name VARCHAR(512) NOT NULL,
    book_reference_url VARCHAR(2048) DEFAULT NULL,
    PRIMARY KEY (book_id)
);

CREATE TABLE gommette_colors (
    color VARCHAR(16) NOT NULL,
    PRIMARY KEY(color)
);

CREATE TABLE user_gommettes (
    gommette_id INT UNSIGNED AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    assigned_date DATE NOT NULL,
    gommette_color VARCHAR(16) NOT NULL,
    gommette_book_id INT UNSIGNED,
    PRIMARY KEY (gommette_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (gommette_color) REFERENCES gommette_colors(color) ON DELETE CASCADE,
    FOREIGN KEY (gommette_book_id) REFERENCES books(book_id) ON DELETE SET NULL
);

CREATE TABLE read_logs (
    read_log_id INT UNSIGNED AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completion TINYINT NOT NULL CHECK (completion<=100),
    book_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (read_log_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE TABLE currencies (
    currency_name VARCHAR(32) NOT NULL,
    PRIMARY KEY (currency_name)
);

CREATE TABLE transactions (
    transaction_id INT UNSIGNED AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    account_currency_name VARCHAR(32) NOT NULL,
    amount INT NOT NULL,
    logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_currency_name) REFERENCES currencies(currency_name) ON DELETE CASCADE
);

CREATE TABLE account_balances (
    user_id INT UNSIGNED NOT NULL,
    account_currency_name VARCHAR(32) NOT NULL,
    amount INT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, account_currency_name),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_currency_name) REFERENCES currencies(currency_name) ON DELETE CASCADE
);

CREATE TABLE shop_items (
    item_id INT UNSIGNED AUTO_INCREMENT,
    item_name VARCHAR(32) NOT NULL,
    item_cost_currency_name VARCHAR(32) NOT NULL,
    item_cost_amount INT UNSIGNED NOT NULL,
    is_punishment BOOLEAN NOT NULL,
    PRIMARY KEY (item_id),
    FOREIGN KEY (item_cost_currency_name) REFERENCES currencies(currency_name) ON DELETE CASCADE
);

CREATE TABLE user_items (
    user_item_id INT UNSIGNED AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    shop_item_id INT UNSIGNED NOT NULL,
    obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_at DATETIME DEFAULT NULL,
    used_at DATETIME DEFAULT NULL,
    PRIMARY KEY (user_item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (shop_item_id) REFERENCES shop_items(item_id) ON DELETE CASCADE
);

INSERT INTO roles (role_name) VALUES ('Admin'), ('Maintainer'), ('Basic'), ('Bot');
INSERT INTO gommette_colors (color) VALUES ('Red'), ('Green');
INSERT INTO currencies (currency_name) VALUES ('green_gommette'), ('red_gommette');