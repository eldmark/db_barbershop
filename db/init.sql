-- =========================
-- USER & AUTHORIZATION
-- =========================

CREATE TABLE Role (
  id_role SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE "User" (
  id_user SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE Permission (
    id_permission SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE UserRole (
  id_user INT NOT NULL,
  id_role INT NOT NULL,
  PRIMARY KEY (id_user, id_role),
  FOREIGN KEY (id_user) REFERENCES "User"(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE CASCADE
);

CREATE TABLE RolePermission (
    id_role INT NOT NULL,
    id_permission INT NOT NULL,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE CASCADE,
    FOREIGN KEY (id_permission) REFERENCES Permission(id_permission) ON DELETE CASCADE
);

-- =========================
-- CORE ENTITIES
-- =========================



CREATE TABLE Category (
    id_category SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Supplier (
    id_supplier SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(100)
);

CREATE TABLE Service (
    id_service SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Product (
    id_product SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_category INT NOT NULL,
    id_supplier INT NOT NULL,

    FOREIGN KEY (id_category) REFERENCES Category(id_category),
    FOREIGN KEY (id_supplier) REFERENCES Supplier(id_supplier)
);

-- =========================
-- RESERVATIONS
-- =========================

CREATE TABLE Reservation (
    id_reservation SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),

    id_user INT NOT NULL,
    id_employee INT NOT NULL,
    id_service INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (id_user) REFERENCES "User"(id_user),
    FOREIGN KEY (id_employee) REFERENCES "User"(id_user),
    FOREIGN KEY (id_service) REFERENCES Service(id_service)
);
-- =========================
-- SALES
-- =========================

CREATE TABLE Sale (
    id_sale SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total DECIMAL(10,2),

    id_user INT NOT NULL,
    id_employee INT NOT NULL,
    id_reservation INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (id_user) REFERENCES "User"(id_user),
    FOREIGN KEY (id_employee) REFERENCES "User"(id_user),
    FOREIGN KEY (id_reservation) REFERENCES Reservation(id_reservation)
);
-- =========================
-- SALE DETAILS (PRODUCTS)
-- =========================

CREATE TABLE SaleDetailProduct (
    id_sale_detail_product SERIAL PRIMARY KEY,
    id_sale INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_sale) REFERENCES Sale(id_sale) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES Product(id_product)
);

-- =========================
-- SALE DETAILS (SERVICES)
-- =========================

CREATE TABLE SaleDetailService (
    id_sale_detail_service SERIAL PRIMARY KEY,
    id_sale INT NOT NULL,
    id_service INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_sale) REFERENCES Sale(id_sale) ON DELETE CASCADE,
    FOREIGN KEY (id_service) REFERENCES Service(id_service)
);

-- =========================
-- PROCEDURES & TRIGGERS
-- =========================

-- Trigger to update stock automatically
CREATE OR REPLACE FUNCTION fn_update_stock() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Product 
    SET stock = stock - NEW.quantity
    WHERE id_product = NEW.id_product;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock_after_sale
AFTER INSERT ON SaleDetailProduct
FOR EACH ROW
EXECUTE FUNCTION fn_update_stock();

-- Procedure to complete a reservation and prepare for billing
-- (Sets status to completed)
CREATE OR REPLACE PROCEDURE pr_complete_reservation(p_id_reservation INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Reservation 
    SET status = 'completed', updated_at = NOW()
    WHERE id_reservation = p_id_reservation;
END;
$$;

-- =========================
-- INDEXES (Required for grading)
-- =========================

CREATE INDEX idx_product_name ON Product(name);
CREATE INDEX idx_sale_date ON Sale(date);
CREATE INDEX idx_user_email ON "User"(email);

-- =========================
-- VIEWS (Soft Delete Handling)
-- =========================

CREATE VIEW active_users AS
SELECT *
FROM "User"
WHERE deleted_at IS NULL;

CREATE VIEW active_sales AS
SELECT *
FROM Sale
WHERE deleted_at IS NULL;

CREATE VIEW active_reservations AS
SELECT *
FROM Reservation
WHERE deleted_at IS NULL;

-- =========================
-- DEMO DATA
-- =========================

-- Insert Roles (demo users will be created via /setup-demo endpoint)
INSERT INTO Role (name) VALUES ('admin'), ('employee'), ('client');

-- Insert Demo Business Data
INSERT INTO Category (name) VALUES ('Hair Products'), ('Skincare'), ('Tools'), ('Fragrances'), ('Accessories');
INSERT INTO Supplier (name, contact) VALUES ('Beauty Supplier Co.', 'contact@beautysupply.com'), ('Premium Tools Inc.', 'info@premiumtools.com'), ('Organic Glow', 'sales@organicglow.com');
-- Insert demo users (passwords are placeholders; /setup-demo will create hashed users)
INSERT INTO "User" (name, email, password) VALUES 
  ('John Barber', 'john.barber@example.com', 'hashed_password'),
  ('Jane Stylist', 'jane.stylist@example.com', 'hashed_password'),
  ('Mike Fade', 'mike.fade@example.com', 'hashed_password'),
  ('Sarah Color', 'sarah.color@example.com', 'hashed_password'),
  ('empleado1', 'employee@example.com', 'password123'),
  ('cliente1', 'client@example.com', 'password123');


-- Map demo users to roles via UserRole. We look up role ids by name to avoid hard-coding serials.
INSERT INTO UserRole (id_user, id_role)
SELECT u.id_user, r.id_role
FROM "User" u, Role r
WHERE r.name = 'employee' AND u.email IN ('john.barber@example.com','jane.stylist@example.com','mike.fade@example.com','sarah.color@example.com','employee@example.com');

-- Insert demo client users (non-employees)
INSERT INTO "User" (name, email, password) VALUES
  ('Client One', 'client.one@example.com', 'hashed_password'),
  ('Client Two', 'client.two@example.com', 'hashed_password');


INSERT INTO UserRole (id_user, id_role)
SELECT u.id_user, r.id_role
FROM "User" u, Role r
WHERE r.name = 'client' AND u.email IN ('client.one@example.com','client.two@example.com');

INSERT INTO Service (name, price) VALUES 
  ('Basic Haircut', 15.00), 
  ('Premium Haircut', 25.00), 
  ('Beard Trim', 10.00), 
  ('Hair Coloring', 40.00),
  ('Shave & Facial', 30.00),
  ('Full Grooming', 50.00);

INSERT INTO Product (name, price, stock, id_category, id_supplier) VALUES
  ('Shampoo Pro', 12.50, 20, 1, 1),
  ('Conditioner Plus', 14.00, 18, 1, 1),
  ('Beard Oil', 18.50, 10, 2, 2),
  ('Scissors Set', 45.00, 5, 3, 2),
  ('Styling Gel', 8.99, 30, 1, 1),
  ('Aftershave Balm', 15.00, 12, 2, 3),
  ('Hair Wax', 12.00, 25, 1, 1),
  ('Comb Set', 10.00, 15, 3, 2);

-- Note: Users and initial transactions are typically created via setup-demo or the app.
-- Demo reservations, sales, and sale details below provide full preview on startup.

-- Insert Demo Reservations (will show in employee reservations page)
-- Note: These assume id_user 4 (client), id_employee 1 (John), id_service 1 (Basic Haircut)
INSERT INTO Reservation (date, time, status, id_user, id_employee, id_service) VALUES
  ('2026-05-02', '10:00', 'pending', 4, 1, 1),
  ('2026-05-03', '14:30', 'pending', 4, 2, 2),
  ('2026-05-04', '09:15', 'completed', 4, 3, 3);

-- Insert Demo Sales (will show in employee sales page)
-- Note: These assume id_user 4 (client), id_employee 1 (John), id_employee 2 (Jane)
INSERT INTO Sale (date, total, id_user, id_employee) VALUES
  ('2026-04-25', 35.99, 4, 1),
  ('2026-04-26', 72.50, 4, 2),
  ('2026-04-27', 55.00, 4, 1);

-- Insert Demo Sale Details - Products (for sale 1)
INSERT INTO SaleDetailProduct (id_sale, id_product, quantity, unit_price) VALUES
  (1, 1, 1, 12.50),  -- Shampoo Pro
  (1, 5, 2, 8.99);   -- Styling Gel (qty 2)

-- Insert Demo Sale Details - Products (for sale 2)
INSERT INTO SaleDetailProduct (id_sale, id_product, quantity, unit_price) VALUES
  (2, 2, 1, 14.00),  -- Conditioner Plus
  (2, 3, 1, 18.50),  -- Beard Oil
  (2, 6, 1, 15.00);  -- Aftershave Balm

-- Insert Demo Sale Details - Products (for sale 3)
INSERT INTO SaleDetailProduct (id_sale, id_product, quantity, unit_price) VALUES
  (3, 7, 2, 12.00),  -- Hair Wax (qty 2)
  (3, 4, 1, 45.00);  -- Scissors Set