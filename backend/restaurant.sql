USE restaurant;

-- CREATE TABLE menu (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     item_name VARCHAR(255) NOT NULL,
--     description TEXT,
--     price DECIMAL(10, 2) NOT NULL,
--     category VARCHAR(100),
--     SOH INT
-- );

-- CREATE TABLE cart (
--     cart_id INT AUTO_INCREMENT PRIMARY KEY,
--     menu_id INT,
--     quantity INT NOT NULL,
--     FOREIGN KEY (menu_id) REFERENCES menu(id)
-- );

-- INSERT INTO cart (menu_id, quantity) VALUES
-- (6, 2);


-- CREATE TABLE orderlist (
--     order_id INT AUTO_INCREMENT PRIMARY KEY,
--     cart_id INT,
--     menu_id INT,
--     quantity INT,
--     FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
--     FOREIGN KEY (menu_id) REFERENCES menu(id)
-- );

-- INSERT INTO orderlist (cart_id, menu_id) VALUES
-- (1, 6);

-- select * from menu;
select * from cart;
select * from orderlist;
