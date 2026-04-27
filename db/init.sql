-- =========================
-- USER & AUTHORIZATION
-- =========================

CREATE TABLE "User" (
    id_user SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);


CREATE TABLE Role (
    id_role SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
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

CREATE TABLE Employee (
    id_employee SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    salary DECIMAL(10,2) NOT NULL
);

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
    FOREIGN KEY (id_employee) REFERENCES Employee(id_employee),
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
    FOREIGN KEY (id_employee) REFERENCES Employee(id_employee),
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