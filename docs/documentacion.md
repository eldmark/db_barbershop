# Barber Shop Management System - Proyecto Base de Datos 1

Este documento detalla las especificaciones técnicas, el diseño de la base de datos y las funcionalidades implementadas en el sistema de gestión de barbería.

## 1. Descripción General del Proyecto
El sistema es una plataforma Full-Stack diseñada para gestionar las operaciones diarias de una barbería, incluyendo la programación de citas, el control de inventario de productos, la gestión de servicios y el registro de ventas detalladas.

## 2. Requerimientos Técnicos
*   **Base de Datos:** PostgreSQL 15 (Relacional)
*   **Backend:** Bun + ElysiaJS (REST API)
*   **Frontend:** React 18 + Vite + Tailwind CSS
*   **Autenticación:** JSON Web Tokens (JWT) con Bcrypt para hashing de contraseñas.
*   **Contenerización:** Docker y Docker Compose para despliegue unificado.

## 3. Diseño de la Base de Datos

### 3.1 Modelo Entidad-Relación (DER)
El sistema se basa en un modelo relacional normalizado que incluye las siguientes entidades principales:
*   **User:** Gestiona tanto clientes como empleados mediante roles.
*   **Role & Permission:** Implementación de RBAC (Role-Based Access Control).
*   **Product:** Inventario con gestión automática de stock.
*   **Service:** Catálogo de servicios ofrecidos (cortes, tintes, etc.).
*   **Reservation:** Citas programadas vinculando cliente, empleado y servicio.
*   **Sale:** Transacciones comerciales que pueden incluir múltiples productos y servicios.

### 3.2 Normalización (3FN)
La base de datos ha sido normalizada hasta la **Tercera Forma Normal (3FN)**:
1.  **1FN:** Todos los atributos son atómicos y existen claves primarias.
2.  **2FN:** Se eliminaron dependencias parciales; los detalles de ventas se movieron a tablas debidamente relacionadas (`SaleDetailProduct`, `SaleDetailService`).
3.  **3FN:** Se eliminaron dependencias transitivas. Atributos como categorías y proveedores de productos se extrajeron a sus propias tablas (`Category`, `Supplier`).

### 3.3 Programabilidad (SQL Avanzado)
*   **Triggers:** `trg_update_stock_after_sale` automatiza la reducción de inventario al registrar una venta.
*   **Stored Procedures:** `pr_complete_reservation` asegura la atomicidad al marcar citas como completadas.
*   **Views:** Vistas como `active_users` y `active_sales` filtran registros con borrado lógico (`deleted_at`).
*   **CTE (Common Table Expressions):** Utilizadas en el Dashboard para cálculos complejos de ingresos diarios y semanales.
*   **Agregaciones (GROUP BY / HAVING):** Reportes dinámicos de productos más vendidos basados en volumen de ventas.

## 4. Funcionalidades de la Aplicación

### 4.1 Gestión de Usuarios (RBAC)
*   **Admin:** Control total del sistema, gestión de roles y reportes analíticos.
*   **Empleado:** Gestión de inventario, atención de citas y registro de ventas.
*   **Cliente:** Consulta de servicios y autoservicio de reservaciones.

### 4.2 Flujo de Venta Inteligente
El sistema permite un flujo directo desde la reservación a la facturación:
1.  El empleado visualiza la cita pendiente.
2.  Al hacer clic en **"Bill"**, el sistema pre-carga los datos del cliente y el servicio.
3.  Se pueden añadir productos adicionales al ticket.
4.  Al completar la venta, la reservación se marca como completada automáticamente en la BD.

### 4.3 Análisis y Reportes
*   **Dashboard en Tiempo Real:** Visualización de KPIs (Ingresos hoy, ingresos semana, alertas de stock).
*   **Reportes de Rendimiento:** Tablas dinámicas con los productos de mayor rotación.
*   **Exportación de Datos:** Funcionalidad para descargar reportes de transacciones en formato **CSV**.

## 6. Documentación de Endpoints (API)

Todos los endpoints (excepto los de autenticación) requieren el encabezado `Authorization: Bearer <token>`.

### 6.1 Autenticación
*   **POST `/auth/register`**
    *   **Recibe:** `{ name, email, password }`
    *   **Retorna:** `{ user: { id_user, name, email }, token }`
*   **POST `/auth/login`**
    *   **Recibe:** `{ email, password }`
    *   **Retorna:** `{ user: { id_user, name, email, roles[] }, token }`

### 6.2 Productos e Inventario
*   **GET `/products`**
    *   **Retorna:** Lista de productos con nombre de categoría y proveedor.
*   **GET `/products/:id`**
    *   **Retorna:** Detalle de un producto específico.
*   **POST `/products`**
    *   **Recibe:** `{ name, price, stock, id_category, id_supplier }`
    *   **Retorna:** Objeto del producto creado.
*   **PUT `/products/:id`**
    *   **Recibe:** Datos a actualizar (parciales o completos).
    *   **Retorna:** Objeto actualizado.
*   **DELETE `/products/:id`**
    *   **Retorna:** Confirmación de eliminación.

### 6.3 Servicios
*   **GET `/services`**
    *   **Retorna:** Catálogo completo de servicios y precios.
*   **POST `/services`**
    *   **Recibe:** `{ name, price }`
    *   **Retorna:** Servicio creado.

### 6.4 Reservaciones (Citas)
*   **GET `/reservations`**
    *   **Retorna:** Lista de reservaciones con JOINs (nombres de cliente, empleado y servicio).
*   **POST `/reservations`**
    *   **Recibe:** `{ date, time, status, id_user, id_employee, id_service }`
    *   **Retorna:** Reservación creada.
*   **PUT `/reservations/:id`**
    *   **Recibe:** Datos de actualización (ej. cambio de estado a 'completed').
    *   **Retorna:** Reservación actualizada.

### 6.5 Ventas y Facturación
*   **GET `/sales`**
    *   **Retorna:** Historial de ventas con totales y nombres de involucrados.
*   **POST `/sales`**
    *   **Recibe:** `{ date, total, id_user, id_employee, id_reservation?, products: [{id_product, quantity, unit_price}], services: [{id_service, quantity, unit_price}] }`
    *   **Retorna:** ID de la venta generada. (Dispara Trigger de stock y Procedure de reservación).

### 6.6 Analítica y Dashboard (SQL Avanzado)
*   **GET `/sales/summary`**
    *   **Retorna:** `{ today_total, week_total, low_stock_count }` (Usa CTE/WITH).
*   **GET `/sales/top-products`**
    *   **Retorna:** Lista de los 5 productos más vendidos (Usa GROUP BY / HAVING).
*   **GET `/sales/active-customers`**
    *   **Retorna:** Lista de clientes con al menos una compra (Usa Subquery/IN).

## 7. Instrucciones de Despliegue
El proyecto está configurado para ejecutarse con un solo comando:
```bash
docker-compose up --build
```
Esto levantará la base de datos PostgreSQL, ejecutará el script `init.sql` (con 25+ datos de prueba por tabla) e iniciará los servicios de backend y frontend.
