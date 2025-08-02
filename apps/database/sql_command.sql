// Init

CREATE DATABASE user_data;
USE user_data;

CREATE TABLE roles (
    role_name VARCHAR(16) NOT NULL,
    PRIMARY KEY(role_name)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    discord_id INT NOT NULL UNIQUE,
    role_name VARCHAR(16),
    first_connection_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_connection_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_name) REFERENCES roles(role_name) ON DELETE SET NULL
);

CREATE TABLE gommette_colors (
    color VARCHAR(16) NOT NULL,
    PRIMARY KEY(color)
);

CREATE TABLE user_gommettes (
    user_id INT NOT NULL,
    assigned_date DATE NOT NULL,
    gommette_color VARCHAR(16) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id, assigned_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (gommette_color) REFERENCES gommette_colors(color) ON DELETE CASCADE
);

CREATE TABLE routine_actions (
    action_name VARCHAR(32) NOT NULL,
    description TEXT,
    PRIMARY KEY(action_name)
);

CREATE TABLE app_routines (
    routine_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    routine_action_name VARCHAR(32) NOT NULL,
    execution_time TIME NOT NULL,
    PRIMARY KEY (routine_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (routine_action_name) REFERENCES routine_actions(action_name) ON DELETE CASCADE
);

CREATE TABLE books (
    book_id INT AUTO_INCREMENT,
    book_name VARCHAR(512) NOT NULL,
    book_reference_url VARCHAR(2048),
    PRIMARY KEY (book_id)
);

CREATE TABLE read_logs (
    user_id INT NOT NULL,
    logged_at DATETIME NOT NULL,
    completion TINYINT NOT NULL CHECK (completion>=0 AND completion<=100),
    book_id INT NOT NULL,
    PRIMARY KEY (user_id, logged_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE TABLE punishment_actions (
    action_name VARCHAR(32) NOT NULL,
    description TEXT,
    PRIMARY KEY (action_name)
);

CREATE TABLE user_punishments (
    punishment_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_at DATETIME,
    done_at DATETIME,
    punishment_action_name VARCHAR(32) NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (punishment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (punishment_action_name) REFERENCES punishment_actions(action_name) ON DELETE CASCADE
);

CREATE TABLE reward_actions (
    action_name VARCHAR(32) NOT NULL,
    description TEXT,
    PRIMARY KEY (action_name)
);

CREATE TABLE user_rewards (
    reward_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_at DATETIME,
    done_at DATETIME,
    reward_action_name VARCHAR(32) NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (reward_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reward_action_name) REFERENCES reward_actions(action_name) ON DELETE CASCADE
);

// Use

USE user_data;

