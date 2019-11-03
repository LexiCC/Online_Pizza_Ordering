CREATE TABLE customers (
    id serial PRIMARY KEY,
    name text,
    username text UNIQUE,
    email text UNIQUE,
    password text
);

CREATE TABLE products (
    id serial PRIMARY KEY,
    name text,
    description text,
    category text,
    image text,
    price money
);

CREATE TABLE customizations (
    id serial PRIMARY KEY,
    name text,
    category text
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    customer_id integer REFERENCES customers (id),
    created_at timestamp
);

CREATE TABLE order_lines (
    id serial PRIMARY KEY,
    order_id integer REFERENCES orders (id),
    product_id integer REFERENCES products(id),
    quantity integer,
    price money
);

CREATE TABLE order_line_customizations (
    id serial PRIMARY KEY,
    order_line_id integer REFERENCES order_lines (id),
    customization_id integer REFERENCES customizations (id)
);

INSERT INTO customers (name, username, email, password) VALUES ('Michael Beck', 'beckmd', 'beckmd@miamioh.edu', '$2b$10$qtcZLq9ouJrwPn8jGSmcku1JKo2bWr9BGKH6LE37mll2ehdfIdFcS');

INSERT INTO products (name, description, category, image, price) VALUES ('BYO', 'Build your own pizza!', 'BYO', 'images/cheese.jpg', '$9.99');
INSERT INTO products (name, description, category, image, price) VALUES ('Veggie Lovers', 'Run it through the garden!', 'Pizzas', 'images/veggie.jpg', '$12.99');
INSERT INTO products (name, description, category, image, price) VALUES ('Breadsticks', 'Garlic breadsticks and dipping sauce.', 'Sides', 'images/breadsticks.jpg', '$4.99');

INSERT INTO customizations (name, category) VALUES ('Pepperoni', 'Meat Topping');
INSERT INTO customizations (name, category) VALUES ('Sausage', 'Meat Topping');
INSERT INTO customizations (name, category) VALUES ('Jalepenos', 'Veggie Topping');
INSERT INTO customizations (name, category) VALUES ('Mushrooms', 'Veggie Topping');

INSERT INTO orders (customer_id, created_at) VALUES (1, '2019-04-07 14:51:08.131249');
INSERT INTO orders (customer_id, created_at) VALUES (1, '2019-04-07 14:51:14.740154');

INSERT INTO order_lines (order_id, product_id, quantity, price) VALUES (1, 2, 1, '$12.99');
INSERT INTO order_lines (order_id, product_id, quantity, price) VALUES (2, 1, 1, '$12.99');
INSERT INTO order_lines (order_id, product_id, quantity, price) VALUES (2, 3, 2, '$4.99');

INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES (2, 1);
INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES (2, 2);