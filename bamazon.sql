DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;
-- Use programming db for the following statements --
USE bamazon_db;

CREATE TABLE products(
  -- Create a numeric column called "id" which will automatically increment its default value as we create new rows. --
  id INTEGER(11) AUTO_INCREMENT NOT NULL,

  product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(50),
      price DECIMAL(13,2),
      stock_quantity  INTEGER(10),

    -- rating INTEGER(10),

    -- mastered BOOLEAN default true,



  -- Set the id as this table's primary key
  PRIMARY KEY (id)

);

-- Create new example rows

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tribbles", "Pet", 5.99, 2598);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bacon Flavored Toothpaste", "Toiletries", 7.50, 65);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Automated Banana Slicer", "Kitchen", 12.75, 103);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Disco Ball Safety Helmet", "Sports", 45.00, 175);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Emergency Moustache Kit", "Grooming", 8.34, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flavored Lickable Wallpaper", "Home", 87.50, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Scorpions", "Pet", 3.50, 853);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ron Popeil Veg-O-Matic", "Kitchen", 36.25, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flowbee Haircut System", "Grooming", 73.28, 26);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Horse Head Mask", "Grooming", 53.10, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pancake Conveyor Belt", "Kitchen", 103.15, 36);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cussing Cockroaches", "Pet", .35, 10678);


select * from products;


