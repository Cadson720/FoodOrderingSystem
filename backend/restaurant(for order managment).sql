CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE menu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    SOH INT
);

CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    menu_id INT,
    quantity INT NOT NULL,
    variant_no INT NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- INSERT INTO cart (menu_id, quantity) VALUES
-- (6, 2);


CREATE TABLE orderlist (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    menu_id INT,
    quantity INT,
    userid INT,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` VARCHAR(50),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (menu_id) REFERENCES menu(id),
    FOREIGN KEY (userid) REFERENCES user(id)
);

-- INSERT INTO orderlist (cart_id, menu_id) VALUES
-- (1, 6);

CREATE TABLE orderdetail (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    price FLOAT,
    quantity INT,
    subtotal FLOAT,
    shipping_address VARCHAR(50) NOT NULL,
    instructions VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orderlist(order_id)
);

-- select * from menu;
select * from cart;
select * from orderlist;
