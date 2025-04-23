CREATE DATABASE IF NOT EXISTS foodee_app;

-- Grant privileges
CREATE USER IF NOT EXISTS 'baitap'@'%' IDENTIFIED BY '1';
GRANT ALL PRIVILEGES ON foodee_app.* TO 'baitap'@'%';
FLUSH PRIVILEGES;

USE foodee_app;

-- Bảng Users
CREATE TABLE users (
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    password VARCHAR(64) NOT NULL,
    role ENUM('admin', 'staff', 'kitchen') NOT NULL DEFAULT 'staff'
);

-- Bảng Categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Bảng Products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_name VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Bảng Tables
CREATE TABLE tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE,
    status ENUM('available', 'maintenance') DEFAULT 'available',
    position INT DEFAULT NULL
);

-- Bảng Orders (sau khi alter)
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_id INT NOT NULL,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Bảng Order_Items (bảng mới)
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    base_price DECIMAL(10,2) NOT NULL,
    topping_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * (base_price + topping_price)) STORED,
    order_toppings JSON,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tách thông tin options ra riêng
CREATE TABLE options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    price_adjustment DECIMAL(10,2)
);

-- Bảng liên kết chỉ lưu mối quan hệ
CREATE TABLE product_options (
    product_id INT,
    option_id INT,
    PRIMARY KEY (product_id, option_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (option_id) REFERENCES options(id)
);



-- Initial Data
INSERT INTO users (username, password, role) 
VALUES ('admin', SHA2('1', 256), 'admin');

INSERT INTO users (username, password, role) 
VALUES ('staff1', SHA2('1', 256), 'staff');

INSERT INTO users (username, password, role) 
VALUES ('kitchen1', SHA2('1', 256), 'kitchen');



INSERT INTO categories (name, description) VALUES
('Món chính', 'Các món ăn chính'),
('Món phụ', 'Các món ăn phụ'),
('Đồ uống', 'Các loại đồ uống');

INSERT INTO tables (table_number, qr_code) VALUES
('T001', 'qr_code_t001'),
('T002', 'qr_code_t002'),
('T003', 'qr_code_t003');