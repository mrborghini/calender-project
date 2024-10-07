CREATE DATABASE calender_project;

USE calender_project;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    has_access BOOLEAN NOT NULL
);

CREATE TABLE tasks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    current_status ENUM("todo", "in-progress", "done") NOT NULL,
    due_timestamp BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);