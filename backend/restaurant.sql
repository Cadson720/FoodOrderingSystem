
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables
SET @tables = NULL;
SELECT GROUP_CONCAT('`', table_name, '`') INTO @tables
FROM information_schema.tables 
WHERE table_schema = 'foodorderingsystem';

SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE menu (
                      item_id INT AUTO_INCREMENT PRIMARY KEY,
                      item_name VARCHAR(100) NOT NULL,
                      description TEXT NOT NULL,
                      price DECIMAL(5, 2) NOT NULL,
                      category VARCHAR(50) NOT NULL,
                      SOH INT NOT NULL
);

INSERT INTO menu (item_name, description, price, category, SOH)
VALUES
    ('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 12.99, 'Pizza', 10),
    ('Pepperoni Pizza', 'Pepperoni, mozzarella, and tomato sauce', 14.99, 'Pizza', 15),
    ('Caesar Salad', 'Fresh romaine, croutons, and Caesar dressing', 8.50, 'Salad', 20),
    ('Chocolate Cake', 'Rich chocolate cake with frosting', 6.99, 'Dessert', 5),
    ('Coke', 'Chilled Coca-Cola', 1.99, 'Beverage', 25);

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    -- user_id INT,  -- You can add user or session tracking if needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cart (cart_id)
VALUES (1), (1001), (1002), (1003);

-- Create the 'cart_items' table
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    item_id INT,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu(item_id) ON DELETE CASCADE
);
INSERT INTO cart_items (cart_id, item_id, quantity)
VALUES 
    (1, 1, 2),  -- Add 2 Margherita Pizzas to cart 1
    (1, 2, 1),  -- Add 1 Pepperoni Pizza to cart 1
    (1, 3, 3);  -- Add 3 Caesar Salads to cart 1

CREATE TABLE user (
                      id int NOT NULL AUTO_INCREMENT,
                      Username varchar(50) NOT NULL,
                      Password varchar(255) NOT NULL,
                      Email varchar(100) DEFAULT NULL,
                      PhoneNumber varchar(15) DEFAULT NULL,
                      Address varchar(255) DEFAULT NULL,
                      RegistrationDate datetime DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (id)
);
INSERT INTO user VALUES (2460,'Xi','2460','ashenone4470@gmail.com','0420499204','Guangzhou','2024-10-03 14:14:03');


CREATE TABLE orderlist (
                           order_id int NOT NULL AUTO_INCREMENT,
                           cart_id int DEFAULT NULL,
                           menu_id int DEFAULT NULL,
                           quantity int DEFAULT NULL,
                           userid int DEFAULT NULL,
                           createDate datetime DEFAULT CURRENT_TIMESTAMP,
                           status varchar(50) DEFAULT NULL,
                           PRIMARY KEY (order_id),
                           KEY cart_id (cart_id),
                           KEY menu_id (menu_id),
                           KEY userid (userid),
                           CONSTRAINT orderlist_ibfk_1 FOREIGN KEY (cart_id) REFERENCES cart (cart_id),
                           -- CONSTRAINT orderlist_ibfk_2 FOREIGN KEY (menu_id) REFERENCES menu (id),
                           CONSTRAINT orderlist_ibfk_3 FOREIGN KEY (userid) REFERENCES user (id)
);

INSERT INTO orderlist VALUES (1001,1001,1,2,2460,'2024-10-03 14:32:19','pending'),(1002,1002,2,1,2460,'2024-10-03 14:32:19','pending'),(1003,1003,3,7,2460,'2024-10-03 15:11:57','delivered');

CREATE TABLE orderdetail (
                             item_id int NOT NULL AUTO_INCREMENT,
                             order_id int DEFAULT NULL,
                             price float DEFAULT NULL,
                             quantity int DEFAULT NULL,
                             subtotal float DEFAULT NULL,
                             shipping_address varchar(50) NOT NULL,
                             instructions varchar(255) DEFAULT NULL,
                             PRIMARY KEY (item_id),
                             KEY order_id (order_id),
                             CONSTRAINT orderdetail_ibfk_1 FOREIGN KEY (order_id) REFERENCES orderlist (order_id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO orderdetail VALUES (1,1001,12,2,24,'Guangzhou','no beef'),(2,1002,4,1,4,'Guangzhou','no suger'),(3,1003,4,7,28,'Guangzhou','no egg');

-- INSERT INTO cart (user_id) VALUES (2460);


select * from menu;
select * from cart;
select * from orderlist;
select * from cart_items;
