-- =========================
-- USER & AUTHORIZATION
-- =========================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_role') THEN
    CREATE ROLE admin_role;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'manager_role') THEN
    CREATE ROLE manager_role;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'employee_role') THEN
    CREATE ROLE employee_role;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cashier_role') THEN
    CREATE ROLE cashier_role;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'client_role') THEN
    CREATE ROLE client_role;
  END IF;
END
$$;

CREATE TABLE role (
  id_role SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_account (
  id_user SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE app_session (
  id UUID PRIMARY KEY,
  id_user INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES user_account(id_user) ON DELETE CASCADE
);

CREATE TABLE permission (
    id_permission SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_role (
  id_user INT NOT NULL,
  id_role INT NOT NULL,
  PRIMARY KEY (id_user, id_role),
  FOREIGN KEY (id_user) REFERENCES user_account(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE CASCADE
);

CREATE TABLE role_permission (
    id_role INT NOT NULL,
    id_permission INT NOT NULL,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE CASCADE,
    FOREIGN KEY (id_permission) REFERENCES permission(id_permission) ON DELETE CASCADE
);

-- =========================
-- CORE ENTITIES
-- =========================

CREATE TABLE category (
    id_category SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE supplier (
    id_supplier SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(100)
);

CREATE TABLE service (
    id_service SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE product (
    id_product SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_category INT NOT NULL,
    id_supplier INT NOT NULL,

    FOREIGN KEY (id_category) REFERENCES category(id_category),
    FOREIGN KEY (id_supplier) REFERENCES supplier(id_supplier)
);

-- =========================
-- RESERVATIONS
-- =========================

CREATE TABLE reservation (
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

    FOREIGN KEY (id_user) REFERENCES user_account(id_user),
    FOREIGN KEY (id_employee) REFERENCES user_account(id_user),
    FOREIGN KEY (id_service) REFERENCES service(id_service)
);

-- =========================
-- SALES
-- =========================

CREATE TABLE sale (
    id_sale SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total DECIMAL(10,2),

    id_user INT NOT NULL,
    id_employee INT NOT NULL,
    id_reservation INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (id_user) REFERENCES user_account(id_user),
    FOREIGN KEY (id_employee) REFERENCES user_account(id_user),
    FOREIGN KEY (id_reservation) REFERENCES reservation(id_reservation)
);

-- =========================
-- SALE DETAILS (PRODUCTS)
-- =========================

CREATE TABLE sale_detail_product (
    id_sale_detail_product SERIAL PRIMARY KEY,
    id_sale INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_sale) REFERENCES sale(id_sale) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES product(id_product)
);

-- =========================
-- SALE DETAILS (SERVICES)
-- =========================

CREATE TABLE sale_detail_service (
    id_sale_detail_service SERIAL PRIMARY KEY,
    id_sale INT NOT NULL,
    id_service INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_sale) REFERENCES sale(id_sale) ON DELETE CASCADE,
    FOREIGN KEY (id_service) REFERENCES service(id_service)
);

-- =========================
-- PROCEDURES & TRIGGERS
-- =========================

CREATE OR REPLACE FUNCTION fn_update_stock() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product 
    SET stock = stock - NEW.quantity
    WHERE id_product = NEW.id_product;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock_after_sale
AFTER INSERT ON sale_detail_product
FOR EACH ROW
EXECUTE FUNCTION fn_update_stock();

CREATE OR REPLACE PROCEDURE pr_complete_reservation(p_id_reservation INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE reservation 
    SET status = 'completed', updated_at = NOW()
    WHERE id_reservation = p_id_reservation;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_complete_reservation(IN p_id_reservation INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE reservation
    SET status = 'completed', updated_at = NOW()
    WHERE id_reservation = p_id_reservation
      AND deleted_at IS NULL;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_cancel_reservation(IN p_id_reservation INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE reservation
    SET status = 'cancelled', updated_at = NOW()
    WHERE id_reservation = p_id_reservation
      AND deleted_at IS NULL;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_restock_product(
    IN p_id_product INT,
    IN p_quantity INT,
    OUT p_new_stock INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be positive';
    END IF;

    UPDATE product
    SET stock = stock + p_quantity
    WHERE id_product = p_id_product
    RETURNING stock INTO p_new_stock;

    IF p_new_stock IS NULL THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_generate_invoice(
    IN p_id_sale INT,
    OUT p_total NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COALESCE(SUM(line_total), 0)
    INTO p_total
    FROM (
        SELECT quantity * unit_price AS line_total
        FROM sale_detail_product
        WHERE id_sale = p_id_sale
        UNION ALL
        SELECT quantity * unit_price AS line_total
        FROM sale_detail_service
        WHERE id_sale = p_id_sale
    ) invoice_lines;

    UPDATE sale
    SET total = p_total, updated_at = NOW()
    WHERE id_sale = p_id_sale;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_create_sale(
    IN p_id_user INT,
    IN p_id_employee INT,
    IN p_id_product INT,
    IN p_quantity INT,
    IN p_unit_price NUMERIC,
    OUT p_result TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock INT;
    v_sale_id INT;
BEGIN
    SELECT stock
    INTO v_stock
    FROM product
    WHERE id_product = p_id_product;

    IF v_stock IS NULL THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    IF v_stock < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock';
    END IF;

    INSERT INTO sale(date, total, id_user, id_employee)
    VALUES(CURRENT_DATE, p_quantity * p_unit_price, p_id_user, p_id_employee)
    RETURNING id_sale INTO v_sale_id;

    INSERT INTO sale_detail_product(id_sale, id_product, quantity, unit_price)
    VALUES(v_sale_id, p_id_product, p_quantity, p_unit_price);

    p_result := 'SUCCESS';
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_result := SQLERRM;
END;
$$;

-- =========================
-- INDEXES
-- =========================

CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_sale_date ON sale(date);
CREATE INDEX idx_user_email ON user_account(email);

-- =========================
-- VIEWS
-- =========================

CREATE VIEW active_users AS SELECT * FROM user_account WHERE deleted_at IS NULL;
CREATE VIEW active_sales AS SELECT * FROM sale WHERE deleted_at IS NULL;
CREATE VIEW active_reservations AS SELECT * FROM reservation WHERE deleted_at IS NULL;

-- =========================
-- DEMO DATA (25+ records per table where possible)
-- =========================

-- 1. role (25 records)
INSERT INTO role (name) VALUES 
('admin_role'), ('manager_role'), ('employee_role'), ('cashier_role'), ('client_role'), 
('barber_senior'), ('barber_junior'), ('stylist'), ('colorist'), ('trainee'),
('marketing'), ('accounting'), ('inventory_manager'), ('security'), ('cleaning'),
('it_support'), ('hr'), ('sales_lead'), ('customer_success'), ('logistics'),
('partner'), ('shareholder'), ('auditor'), ('intern'), ('consultant');

-- 2. permission (25 records)
INSERT INTO permission (name) VALUES 
('view_dashboard'), ('edit_products'), ('delete_products'), ('view_sales'), ('create_sale'),
('manage_users'), ('view_reports'), ('edit_services'), ('manage_reservations'), ('view_inventory'),
('export_data'), ('backup_db'), ('system_config'), ('view_suppliers'), ('edit_suppliers'),
('view_categories'), ('edit_categories'), ('apply_discounts'), ('void_sales'), ('manage_roles'),
('assign_permissions'), ('view_audit_log'), ('manage_it'), ('hr_access'), ('view_finances');

-- 3. user_account (25 records) - passwords are bcrypt hashes for 'password123'
INSERT INTO user_account (name, email, password) VALUES 
('Admin User', 'admin@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Manager User', 'manager@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Employee User', 'employee@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Cashier User', 'cashier@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Client User', 'client@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Bob Smith', 'bob@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Charlie Brown', 'charlie@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('David Jones', 'david@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Eve Wilson', 'eve@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Frank Miller', 'frank@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Grace Lee', 'grace@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Heidi Chen', 'heidi@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Ivan Garcia', 'ivan@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Judy Davis', 'judy@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Kevin White', 'kevin@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Laura Moore', 'laura@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Mark Taylor', 'mark@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Nancy Hill', 'nancy@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Oscar Scott', 'oscar@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Paul Green', 'paul@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Quinn Adams', 'quinn@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Rose Baker', 'rose@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Steve Cook', 'steve@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Tina Bell', 'tina@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi'),
('Avery Client', 'avery@example.com', '$2b$10$4vEqTgR8rmI/wgtlYk7Rc.q1.NfTgPeypC2DoQaimr0jFNGiTrzVi');

-- 4. user_role (25 records)
INSERT INTO user_role (id_user, id_role) VALUES 
(1,1), (2,2), (3,3), (4,4), (5,5), (6,5), (7,5), (8,5), (9,5), (10,5),
(11,5), (12,5), (13,5), (14,5), (15,5), (16,5), (17,5), (18,5), (19,5), (20,5),
(21,5), (22,5), (23,5), (24,5), (25,5);

-- 5. role_permission (25 records)
INSERT INTO role_permission (id_role, id_permission) VALUES 
(1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10),
(2,1), (2,4), (2,5), (2,9), (2,10), (3,1), (3,9), (4,1), (4,7), (4,12),
(5,1), (5,9), (6,1), (6,9), (7,1);

-- 6. category (25 records)
INSERT INTO category (name) VALUES 
('Hair Products'), ('Skincare'), ('Tools'), ('Fragrances'), ('Accessories'),
('Shampoos'), ('Conditioners'), ('Oils'), ('Pomades'), ('Gels'),
('Clippers'), ('Trimmers'), ('Scissors'), ('Combs'), ('Brushes'),
('Face Creams'), ('Aftershaves'), ('Colognes'), ('Perfumes'), ('Body Washes'),
('Apparel'), ('Gift Cards'), ('Memberships'), ('Books'), ('Education');

-- 7. supplier (25 records)
INSERT INTO supplier (name, contact) VALUES 
('Beauty Supply Co.', 'contact@beautysupply.com'), ('Premium Tools Inc.', 'info@premiumtools.com'), ('Organic Glow', 'sales@organicglow.com'),
('Barber King', 'orders@barberking.com'), ('Style Depot', 'hello@styledepot.com'), ('Pro Hair Group', 'support@prohair.com'),
('Main Street Beauty', 'info@mainbeauty.com'), ('Elite Barber Gear', 'sales@elitebarber.com'), ('Global Scissors', 'contact@globalscissors.com'),
('Classic Cuts Supplies', 'support@classiccuts.com'), ('Modern Salon Supply', 'orders@modernsalon.com'), ('Fresh Look Dist.', 'info@freshlook.com'),
('Golden Touch', 'sales@goldentouch.com'), ('Silver Blade', 'contact@silverblade.com'), ('Platinum Grooming', 'hello@platinumgroom.com'),
('Iron & Silk', 'info@ironsilk.com'), ('Velvet Finish', 'sales@velvetfinish.com'), ('Sharp & Smooth', 'contact@sharpsmooth.com'),
('The Grooming Box', 'orders@groomingbox.com'), ('Luxury Barber', 'support@luxbarber.com'), ('Standard Beauty', 'info@standardbeauty.com'),
('Quality Groom', 'sales@qualitygroom.com'), ('Direct Barber', 'contact@directbarber.com'), ('Wholesale Salon', 'orders@wholesalesalon.com'),
('Next Gen Hair', 'info@nextgenhair.com');

-- 8. service (25 records)
INSERT INTO service (name, price) VALUES 
('Basic Haircut', 15.00), ('Premium Haircut', 25.00), ('Beard Trim', 10.00), ('Hair Coloring', 40.00), ('Shave & Facial', 30.00),
('Full Grooming', 50.00), ('Buzz Cut', 12.00), ('Kids Cut', 12.00), ('Senior Cut', 13.00), ('Neck Clean Up', 5.00),
('Hot Towel Shave', 20.00), ('Deep Conditioning', 15.00), ('Scalp Massage', 10.00), ('Eyebrow Shaping', 8.00), ('Ear Waxing', 7.00),
('Nose Waxing', 7.00), ('Gray Blending', 35.00), ('Perm', 60.00), ('Straightening', 55.00), ('Head Shave', 18.00),
('Manicure', 15.00), ('Pedicure', 25.00), ('Shoulder Massage', 12.00), ('Black Mask', 10.00), ('Bridal Prep', 100.00);

-- 9. product (25 records)
INSERT INTO product (name, price, stock, id_category, id_supplier) VALUES
('Shampoo Pro', 12.50, 20, 1, 1), ('Conditioner Plus', 14.00, 18, 1, 1), ('Beard Oil', 18.50, 10, 2, 2), ('Scissors Set', 45.00, 5, 3, 2), ('Styling Gel', 8.99, 30, 1, 1),
('Aftershave Balm', 15.00, 12, 2, 3), ('Hair Wax', 12.00, 25, 1, 1), ('Comb Set', 10.00, 15, 3, 2), ('Matte Paste', 16.00, 20, 9, 4), ('Clay Pomade', 17.00, 15, 9, 5),
('Clipper Blade Oil', 8.00, 40, 11, 4), ('Sanitizing Spray', 11.00, 50, 11, 5), ('Talc Powder', 6.00, 25, 2, 6), ('Moustache Wax', 10.00, 12, 8, 7), ('Sea Salt Spray', 14.00, 18, 1, 8),
('Detangling Spray', 11.50, 20, 1, 9), ('Silver Shampoo', 18.00, 10, 6, 10), ('Leave-in Cond', 13.50, 15, 7, 11), ('Texture Powder', 20.00, 8, 10, 12), ('Boar Brush', 22.00, 10, 15, 13),
('Fade Brush', 12.00, 15, 15, 14), ('Straight Razor', 35.00, 5, 11, 15), ('Blade Box 100', 10.00, 30, 11, 16), ('Cooling Mask', 12.00, 20, 16, 17), ('Lip Balm', 4.50, 100, 2, 18);

-- 10. reservation (25 records)
INSERT INTO reservation (date, time, status, id_user, id_employee, id_service) VALUES
('2026-05-01', '09:00', 'completed', 6, 2, 1), ('2026-05-01', '10:00', 'completed', 7, 3, 2), ('2026-05-01', '11:00', 'completed', 8, 4, 3),
('2026-05-02', '09:30', 'pending', 9, 2, 4), ('2026-05-02', '10:30', 'pending', 10, 3, 5), ('2026-05-02', '11:30', 'cancelled', 11, 4, 1),
('2026-05-03', '09:00', 'pending', 12, 2, 2), ('2026-05-03', '14:00', 'pending', 13, 3, 3), ('2026-05-03', '15:00', 'pending', 14, 4, 4),
('2026-05-04', '10:00', 'pending', 15, 2, 5), ('2026-05-04', '11:00', 'pending', 16, 3, 1), ('2026-05-04', '12:00', 'pending', 17, 4, 2),
('2026-05-05', '09:00', 'pending', 18, 2, 3), ('2026-05-05', '10:00', 'pending', 19, 3, 4), ('2026-05-05', '11:00', 'pending', 20, 4, 5),
('2026-05-06', '09:00', 'pending', 21, 2, 1), ('2026-05-06', '10:00', 'pending', 22, 3, 2), ('2026-05-06', '11:00', 'pending', 23, 4, 3),
('2026-05-07', '09:00', 'pending', 24, 2, 4), ('2026-05-07', '10:00', 'pending', 25, 3, 5), ('2026-05-08', '09:00', 'pending', 6, 4, 1),
('2026-05-08', '10:00', 'pending', 7, 2, 2), ('2026-05-08', '11:00', 'pending', 8, 3, 3), ('2026-05-09', '09:00', 'pending', 9, 4, 4),
('2026-05-09', '10:00', 'pending', 10, 2, 5);

-- 11. sale (25 records)
INSERT INTO sale (date, total, id_user, id_employee, id_reservation) VALUES
('2026-04-20', 15.00, 6, 2, 1), ('2026-04-20', 25.00, 7, 3, 2), ('2026-04-20', 10.00, 8, 4, 3), ('2026-04-21', 30.00, 9, 2, NULL),
('2026-04-21', 45.00, 10, 3, NULL), ('2026-04-21', 12.50, 11, 4, NULL), ('2026-04-22', 18.50, 12, 2, NULL), ('2026-04-22', 50.00, 13, 3, NULL),
('2026-04-22', 14.00, 14, 4, NULL), ('2026-04-23', 22.00, 15, 2, NULL), ('2026-04-23', 8.99, 16, 3, NULL), ('2026-04-23', 15.00, 17, 4, NULL),
('2026-04-24', 10.00, 18, 2, NULL), ('2026-04-24', 12.00, 19, 3, NULL), ('2026-04-24', 40.00, 20, 4, NULL), ('2026-04-25', 15.00, 21, 2, NULL),
('2026-04-25', 25.00, 22, 3, NULL), ('2026-04-25', 10.00, 23, 4, NULL), ('2026-04-26', 30.00, 24, 2, NULL), ('2026-04-26', 45.00, 25, 3, NULL),
('2026-04-26', 12.50, 6, 4, NULL), ('2026-04-27', 18.50, 7, 2, NULL), ('2026-04-27', 50.00, 8, 3, NULL), ('2026-04-27', 14.00, 9, 4, NULL),
('2026-04-28', 22.00, 10, 2, NULL);

-- 12. sale_detail_product (25 records)
INSERT INTO sale_detail_product (id_sale, id_product, quantity, unit_price) VALUES
(4, 1, 1, 15.00), (5, 4, 1, 45.00), (6, 1, 1, 12.50), (7, 3, 1, 18.50), (8, 6, 1, 15.00),
(9, 2, 1, 14.00), (10, 7, 1, 12.00), (11, 5, 1, 8.99), (12, 6, 1, 15.00), (13, 8, 1, 10.00),
(14, 7, 1, 12.00), (15, 3, 1, 18.50), (16, 1, 1, 12.50), (17, 2, 1, 14.00), (18, 8, 1, 10.00),
(19, 6, 1, 15.00), (20, 4, 1, 45.00), (21, 1, 1, 12.50), (22, 3, 1, 18.50), (23, 6, 1, 15.00),
(24, 2, 1, 14.00), (25, 7, 1, 12.00), (1, 1, 1, 12.50), (2, 2, 1, 14.00), (3, 3, 1, 18.50);

-- 13. sale_detail_service (25 records)
INSERT INTO sale_detail_service (id_sale, id_service, quantity, unit_price) VALUES
(1, 1, 1, 15.00), (2, 2, 1, 25.00), (3, 3, 1, 10.00), (4, 4, 1, 40.00), (5, 5, 1, 30.00),
(6, 6, 1, 50.00), (7, 7, 1, 12.00), (8, 8, 1, 12.00), (9, 9, 1, 13.00), (10, 10, 1, 5.00),
(11, 11, 1, 20.00), (12, 12, 1, 15.00), (13, 13, 1, 10.00), (14, 14, 1, 8.00), (15, 15, 1, 7.00),
(16, 16, 1, 7.00), (17, 17, 1, 35.00), (18, 18, 1, 60.00), (19, 19, 1, 55.00), (20, 20, 1, 18.00),
(21, 21, 1, 15.00), (22, 22, 1, 25.00), (23, 23, 1, 12.00), (24, 24, 1, 10.00), (25, 25, 1, 100.00);

-- =========================
-- DATABASE ROLE PERMISSIONS
-- =========================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE EXECUTE ON ALL ROUTINES IN SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO admin_role, manager_role, employee_role, cashier_role, client_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO admin_role;

GRANT SELECT ON product, category, supplier, service, active_sales, active_reservations TO manager_role;
GRANT UPDATE (stock) ON product TO manager_role;
GRANT EXECUTE ON PROCEDURE sp_restock_product(INT, INT) TO manager_role;
GRANT EXECUTE ON PROCEDURE sp_generate_invoice(INT) TO manager_role;

GRANT SELECT ON product, service, user_account TO employee_role;
GRANT SELECT, INSERT, UPDATE ON reservation TO employee_role;
GRANT SELECT, INSERT ON sale, sale_detail_product, sale_detail_service TO employee_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO employee_role;
GRANT EXECUTE ON PROCEDURE sp_complete_reservation(INT) TO employee_role;
GRANT EXECUTE ON PROCEDURE sp_cancel_reservation(INT) TO employee_role;

GRANT SELECT ON reservation, product, service TO cashier_role;
GRANT SELECT, INSERT ON sale, sale_detail_product, sale_detail_service TO cashier_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cashier_role;
GRANT EXECUTE ON PROCEDURE sp_create_sale(INT, INT, INT, INT, NUMERIC) TO cashier_role;
GRANT EXECUTE ON PROCEDURE sp_generate_invoice(INT) TO cashier_role;

GRANT SELECT ON service TO client_role;
GRANT SELECT, INSERT ON reservation TO client_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO client_role;
