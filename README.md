# 🏪 Barber Shop Management System

> Full-stack database project for a barber shop appointment and inventory management system. Features JWT authentication with role-based access control, real-time reservations, product inventory, and service management.
> Production link: http://136.113.119.228/
**Table of Contents**
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Configuration](#configuration)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

This is a complete **Full-Stack** management system for barbershops that streamlines:
- 📅 **Appointment Scheduling** - Customers book services, employees manage reservations
- 📦 **Inventory Management** - Track products, stock levels, categories, suppliers
- 💰 **Sales & Billing** - Complete transaction history, invoice generation, intelligent billing from reservations
- 📊 **Analytics & Reports** - Real-time dashboards, KPIs, top-selling products, revenue tracking
- 🔐 **Role-Based Access Control** - Admin, Employee, and Client roles with fine-grained permissions

The system uses a **PostgreSQL database** normalized to 3NF with advanced SQL features (triggers, stored procedures, CTEs), a **REST API** built with Bun + ElysiaJS, and a modern **React + Vite** SPA frontend.

---

## Tech Stack

### Backend
- **Runtime**: Bun (high-performance JavaScript runtime)
- **Framework**: ElysiaJS (lightweight TypeScript web framework)
- **Database**: PostgreSQL 15
- **Authentication**: JWT + Bcrypt
- **Language**: TypeScript
- **Dependencies**:
  - `elysia` - Web framework
  - `@elysiajs/cors` - CORS middleware
  - `jsonwebtoken` - JWT token generation/verification
  - `bcrypt` - Password hashing
  - `pg` - PostgreSQL client

### Frontend
- **Library**: React 18.2+
- **Build Tool**: Vite 8
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4+
- **Router**: React Router 7.14+
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15 Alpine
- **Network**: Bridge network for container communication

---

## Features

### 👤 User Management & Authentication
- ✅ User registration with email validation
- ✅ JWT-based login system
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and endpoints
- ✅ Auto-generated demo users for testing

### 📅 Reservation System
- ✅ Book appointments with employee selection
- ✅ Choose from available services
- ✅ Automatic employee assignment (if not specified)
- ✅ View pending, completed, and cancelled reservations
- ✅ Update reservation status
- ✅ Link reservations directly to sales for seamless billing

### 📦 Inventory Management
- ✅ Add, update, and delete products
- ✅ Automatic stock tracking with triggers
- ✅ Categorize products
- ✅ Manage suppliers
- ✅ Low-stock alerts
- ✅ Product analytics

### 💇 Service Management
- ✅ Create and manage haircut/salon services
- ✅ Set service pricing
- ✅ Browse service catalog

### 💰 Sales & Billing
- ✅ Intelligent billing workflow (Reservation → Sale)
- ✅ Multiple products/services per transaction
- ✅ Automatic inventory reduction on sale
- ✅ Invoice generation
- ✅ Transaction history
- ✅ Detailed sale reports with joins

### 📊 Analytics & Dashboards
- ✅ Real-time KPIs (today's revenue, weekly revenue)
- ✅ Low-stock alerts
- ✅ Top-selling products (GROUP BY / HAVING)
- ✅ Active customers list
- ✅ Weekly/daily revenue tracking (CTEs)
- ✅ CSV export functionality

### 🔐 Security
- ✅ JWT token-based authentication
- ✅ Password hashing with Bcrypt
- ✅ Role-based endpoint access guards
- ✅ Bearer token validation on protected routes
- ✅ CORS configuration for frontend/backend communication

---

## Project Structure

```
db_barbershop/
├── backend/                          # Bun + ElysiaJS REST API
│   ├── src/
│   │   ├── app.ts                   # Elysia app configuration
│   │   ├── index.ts                 # Server entry point
│   │   ├── config/
│   │   │   └── db.ts                # PostgreSQL connection pool
│   │   ├── middleware/
│   │   │   └── auth.ts              # Authentication guards
│   │   ├── modules/                 # Feature modules (CRUD operations)
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── setupDemo.ts     # Demo user creation
│   │   │   ├── category/
│   │   │   ├── employee/
│   │   │   ├── permission/
│   │   │   ├── product/
│   │   │   ├── reservation/
│   │   │   ├── role/
│   │   │   ├── sale/
│   │   │   ├── saleDetailProduct/
│   │   │   ├── saleDetailService/
│   │   │   ├── serviceEntity/
│   │   │   ├── supplier/
│   │   │   └── user/
│   │   ├── types/
│   │   │   ├── entities.ts          # Entity type definitions
│   │   │   └── http.ts              # HTTP response types
│   │   ├── utils/
│   │   │   └── db.ts                # Database utilities
│   │   └── tests/
│   │       └── utils.test.ts
│   ├── Dockerfile                   # Backend container image
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── main.tsx                 # App entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── common/              # Reusable components (buttons, forms, etc.)
│   │   │   └── layout/              # Layout components (header, sidebar, etc.)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Global authentication state
│   │   │   └── useDebounce.tsx      # Debounce hook
│   │   ├── hooks/
│   │   │   └── useAuth.ts           # Auth hook with token management
│   │   ├── pages/
│   │   │   ├── auth/                # Login/Register pages
│   │   │   ├── client/              # Client-only pages
│   │   │   ├── employee/            # Employee dashboard pages
│   │   │   ├── AccessDeniedPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── router/
│   │   │   └── AppRouter.tsx        # Route configuration
│   │   ├── services/
│   │   │   └── api.ts               # Axios API client with JWT injection
│   │   ├── assets/
│   │   └── tests/
│   │       ├── Button.test.tsx
│   │       └── setup.ts
│   ├── public/                      # Static assets
│   ├── Dockerfile                   # Development container
│   ├── Dockerfile.production        # Production container with Nginx
│   ├── nginx.conf                   # Nginx configuration for production
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── db/                              # Database initialization
│   └── init.sql                     # Complete schema + seed data (25+ entries)
│
├── docs/                            # Documentation
│   ├── documentacion.md             # Complete technical specification
│   ├── DERchen.dot                  # Entity Relationship Diagram (Graphviz)
│   ├── DERCSF.puml                  # ER Diagram (PlantUML)
│   └── Proyecto2_temp.txt
│
├── docker-compose.yml               # Production orchestration
├── docker-compose.yml.example       # Reference configuration
├── docker-compose.production.yml    # Alternative production setup
├── docker-compose.yml.new
├── .env.example                     # Environment variables template
├── package.json                     # Root package.json
└── README.md                        # This file

```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                  │
│  Port: 5173 (dev) / 8080 (production)                           │
│  - Authentication Context                                        │
│  - Role-based routing (Admin/Employee/Client)                   │
│  - Pages: Services, Reservations, Products, Analytics           │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/JSON
                     │ (JWT Bearer Token)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Bun + ElysiaJS)                        │
│  Port: 3000                                                      │
│  - Authentication (JWT + Bcrypt)                                 │
│  - Role guards & middleware                                      │
│  - RESTful API endpoints                                         │
│  - Modules: Auth, Product, Reservation, Sale, etc.              │
└────────────────────┬────────────────────────────────────────────┘
                     │ SQL
                     │ (Connection Pool)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL 15)                           │
│  Port: 5432                                                      │
│  - Normalized schema (3FN)                                       │
│  - Tables: Users, Roles, Products, Services, Reservations, etc. │
│  - Triggers: Auto stock reduction on sale                        │
│  - Procedures: Atomic reservation completion                     │
│  - Views: Active users, active sales                             │
│  - CTEs: Complex revenue calculations                            │
└─────────────────────────────────────────────────────────────────┘
```

### Database Architecture

#### Entities & Relationships

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Customers and Employees | id_user, name, email, password_hash, deleted_at |
| **Role** | RBAC roles | id_role, role_name (admin, employee, client) |
| **UserRole** | User-Role mapping | id_user, id_role |
| **Permission** | Fine-grained access control | id_permission, permission_name |
| **RolePermission** | Role-Permission mapping | id_role, id_permission |
| **Product** | Inventory items | id_product, name, price, stock, id_category, id_supplier |
| **Category** | Product categories | id_category, category_name |
| **Supplier** | Product suppliers | id_supplier, supplier_name, contact_info |
| **Service** | Salon services | id_service, name, price |
| **Reservation** | Appointments | id_reservation, date, time, status, id_user, id_employee, id_service |
| **Sale** | Transactions | id_sale, date, total, id_user, id_employee, id_reservation |
| **SaleDetailProduct** | Sale line items (products) | id_sale_detail, id_sale, id_product, quantity, unit_price |
| **SaleDetailService** | Sale line items (services) | id_sale_detail, id_sale, id_service, quantity, unit_price |

#### Normalization to 3FN

1. **1NF (First Normal Form)**: All attributes are atomic; every table has a primary key
2. **2NF (Second Normal Form)**: Eliminated partial dependencies
   - Sale details extracted to `SaleDetailProduct` and `SaleDetailService`
   - Product-Category relationship normalized
3. **3FN (Third Normal Form)**: Eliminated transitive dependencies
   - Categories and Suppliers extracted to separate tables
   - Roles and Permissions separated

#### Advanced SQL Features

**Triggers**:
- `trg_update_stock_after_sale`: Automatically reduces product stock when a sale is created

**Stored Procedures**:
- `pr_complete_reservation`: Marks reservation as completed (ensures atomicity)

**Views**:
- `active_users`: Filters users with `deleted_at IS NULL`
- `active_sales`: Filters sales not soft-deleted

**CTEs (Common Table Expressions)**:
- Used in dashboard queries for complex revenue calculations
- Daily/weekly aggregations with GROUP BY

**Aggregations**:
- GROUP BY / HAVING for top-selling products
- SUM for revenue calculations
- COUNT for active customers

---

## Configuration

### Environment Variables

#### Root `.env` (Docker Compose)
```env
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=proy2

# API Configuration
JWT_SECRET=super_secret_key
API_PORT=3000

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

#### Backend `.env` (Local Development)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=barberdb

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
```

#### Frontend `.env` (Vite)
```env
VITE_API_URL=http://localhost:3000
```

### Docker Compose Configuration

The `docker-compose.yml` defines three services:

1. **db** - PostgreSQL 15 Alpine
   - Image: `postgres:15-alpine`
   - Port: 5432
   - Health check: pg_isready every 10s
   - Volume: `postgres_data` for persistence
   - Init script: `db/init.sql` (runs on first startup)

2. **api** - Backend (Bun + ElysiaJS)
   - Build from: `backend/Dockerfile`
   - Port: 3000
   - Depends on: db (waits for healthcheck)
   - Environment: DB credentials, JWT secret

3. **frontend** - React SPA
   - Build from: `frontend/Dockerfile.production`
   - Port: 8080 (Nginx)
   - Depends on: api

---

## Installation

### Prerequisites

- **Docker & Docker Compose** (recommended)
  - Or: **Bun**, **Node.js 18+**, **PostgreSQL 15**
- **Git**
- **4GB RAM** minimum
- **2GB disk space** for PostgreSQL data

### Clone Repository

```bash
git clone https://github.com/yourusername/db_barbershop.git
cd db_barbershop
```

### Method 1: Docker Compose (Recommended)

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Build and start services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:8080
   - API: http://localhost:3000
   - Database: localhost:5432

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Method 2: Local Development (Without Docker)

#### 1. Set up PostgreSQL Database
```bash
# Create database
createdb barberdb

# Import schema and data
psql -U postgres barberdb < db/init.sql
```

#### 2. Backend Setup
```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies (Bun)
bun install

# Start development server
bun run dev
```
Server runs on: http://localhost:3000

#### 3. Frontend Setup
```bash
cd ../frontend

# Copy environment file (if needed)
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```
App runs on: http://localhost:5173

---

## Quick Start

### 1. Start the Application

**With Docker:**
```bash
docker-compose up --build
```

**Locally:**
```bash
# Terminal 1: Backend
cd backend && bun run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database
# Ensure PostgreSQL is running
```

### 2. Create Demo Users

Press the **"Create Demo Users"** button in the app (or the API will auto-create them):

```
Admin:
  Email: admin@example.com
  Password: password123
  Role: Admin

Employee:
  Email: employee@example.com
  Password: password123
  Role: Employee

Client:
  Email: client@example.com
  Password: password123
  Role: Client
```

### 3. Login & Explore

- **As Client**: Book appointments, browse services
- **As Employee**: Manage inventory, view/bill reservations
- **As Admin**: Full system access, analytics, user management

---

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All endpoints (except `/auth/*` and public endpoints) require:
```
Authorization: Bearer <JWT_TOKEN>
```

Obtain token via `/auth/login`.

### Auth Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response 201:
{
  "user": {
    "id_user": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response 200:
{
  "user": {
    "id_user": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["client"]
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Product Endpoints

#### Get All Products
```http
GET /products
Authorization: Bearer <TOKEN>

Response 200:
[
  {
    "id_product": 1,
    "name": "Pomade",
    "price": 15.99,
    "stock": 50,
    "category_name": "Hair Care",
    "supplier_name": "BeautySupply Inc."
  },
  ...
]
```

#### Create Product (Employee/Admin)
```http
POST /products
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Aftershave",
  "price": 25.00,
  "stock": 30,
  "id_category": 2,
  "id_supplier": 1
}

Response 201:
{
  "id_product": 2,
  "name": "Aftershave",
  "price": 25.00,
  "stock": 30
}
```

#### Update Product (Employee/Admin)
```http
PUT /products/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "price": 22.00,
  "stock": 35
}

Response 200:
{
  "id_product": 1,
  "name": "Pomade",
  "price": 22.00,
  "stock": 35
}
```

#### Delete Product (Admin)
```http
DELETE /products/:id
Authorization: Bearer <TOKEN>

Response 200:
{
  "message": "Product deleted successfully"
}
```

### Service Endpoints

#### Get All Services
```http
GET /services
Authorization: Bearer <TOKEN>

Response 200:
[
  {
    "id_service": 1,
    "name": "Haircut",
    "price": 20.00
  },
  {
    "id_service": 2,
    "name": "Beard Trim",
    "price": 15.00
  },
  ...
]
```

#### Create Service (Employee/Admin)
```http
POST /services
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Hair Color",
  "price": 50.00
}

Response 201:
{
  "id_service": 3,
  "name": "Hair Color",
  "price": 50.00
}
```

### Reservation Endpoints

#### Get All Reservations
```http
GET /reservations
Authorization: Bearer <TOKEN>

Response 200:
[
  {
    "id_reservation": 1,
    "date": "2024-05-20",
    "time": "10:00",
    "status": "pending",
    "client_name": "John Doe",
    "employee_name": "Jane Smith",
    "service_name": "Haircut"
  },
  ...
]
```

#### Create Reservation
```http
POST /reservations
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "date": "2024-05-20",
  "time": "10:00",
  "id_user": 5,
  "id_employee": 2,
  "id_service": 1
}

Response 201:
{
  "id_reservation": 1,
  "date": "2024-05-20",
  "time": "10:00",
  "status": "pending"
}
```

#### Complete Reservation (Employee/Admin)
```http
PUT /reservations/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "completed"
}

Response 200:
{
  "id_reservation": 1,
  "status": "completed"
}
```

### Sale Endpoints

#### Get All Sales
```http
GET /sales
Authorization: Bearer <TOKEN>

Response 200:
[
  {
    "id_sale": 1,
    "date": "2024-05-20",
    "total": 75.50,
    "client_name": "John Doe",
    "employee_name": "Jane Smith"
  },
  ...
]
```

#### Create Sale (Employee/Admin)
```http
POST /sales
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "date": "2024-05-20",
  "id_user": 5,
  "id_employee": 2,
  "id_reservation": 1,
  "products": [
    {
      "id_product": 1,
      "quantity": 2,
      "unit_price": 15.99
    }
  ],
  "services": [
    {
      "id_service": 1,
      "quantity": 1,
      "unit_price": 20.00
    }
  ]
}

Response 201:
{
  "id_sale": 1,
  "total": 51.98,
  "message": "Sale created and stock updated automatically"
}
```

### Dashboard/Analytics Endpoints

#### Sales Summary (KPIs)
```http
GET /sales/summary
Authorization: Bearer <TOKEN>

Response 200:
{
  "today_total": 150.50,
  "week_total": 890.25,
  "low_stock_count": 3
}
```

#### Top Selling Products
```http
GET /sales/top-products
Authorization: Bearer <TOKEN>

Response 200:
[
  {
    "product_name": "Pomade",
    "total_sold": 125,
    "total_revenue": 1987.50
  },
  ...
]
```

#### Active Customers
```http
GET /sales/active-customers
Authorization: Bearer <TOKEN>

Response 200:
[
  {
    "id_user": 5,
    "name": "John Doe",
    "purchase_count": 3
  },
  ...
]
```

---

## Usage Guide

### User Workflows

#### 1. Client Booking a Service

1. **Register/Login** (http://localhost:8080/auth)
   - Email & password
   - Auto-assigned "Client" role

2. **Browse Services** (/services page)
   - View available services and prices
   - Select desired service

3. **Book Appointment** (/reservations page)
   - Select date and time
   - Choose employee (optional - randomly assigned)
   - Confirm booking

4. **View Reservations**
   - Track upcoming appointments
   - Cancel if needed

#### 2. Employee Managing Reservations & Sales

1. **Login** with Employee account (employee@example.com)

2. **View Reservations Dashboard**
   - See all pending appointments
   - Check client and service details

3. **Bill a Reservation**
   - Click "Bill" on pending reservation
   - Pre-loaded with client, service, and price
   - Add products (optional) from inventory
   - Review total
   - Create sale (triggers automatic stock reduction)

4. **Manage Inventory**
   - Add new products
   - Update stock quantities
   - View low-stock alerts

5. **Create Services** (if authorized)
   - Add new haircut/service options
   - Set pricing

#### 3. Admin Viewing Analytics

1. **Access Dashboard**
   - Today's revenue
   - Weekly revenue
   - Low-stock alerts

2. **View Reports**
   - Top-selling products (with GROUP BY)
   - Active customers (with subqueries)
   - Sales trends

3. **Manage Users**
   - View all users
   - Assign/revoke roles
   - Manage permissions

---

## Development

### Backend Development

#### File Structure
```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── app.ts                # Elysia app setup
│   ├── config/
│   │   └── db.ts             # PostgreSQL pool config
│   ├── middleware/
│   │   └── auth.ts           # Guards, JWT verification
│   ├── modules/              # Feature modules (one folder per domain)
│   │   └── {feature}/
│   │       ├── {feature}.controller.ts
│   │       ├── {feature}.service.ts
│   │       ├── {feature}.routes.ts
│   │       └── types.ts (optional)
│   ├── types/
│   │   ├── entities.ts       # Database entity types
│   │   └── http.ts           # HTTP response types
│   └── utils/
│       └── db.ts             # Query helpers
```

#### Key Files

**[backend/src/index.ts](backend/src/index.ts)** - Server bootstrap:
```typescript
import { Elysia } from "elysia";
import { setupDemo } from "./modules/auth/setupDemo";
import { AuthRoutes } from "./modules/auth/auth.routes";

const app = new Elysia()
  .use(cors())
  .use(AuthRoutes)
  // ... other routes
  .listen(3000);

// Auto-create demo users
await setupDemo();
```

**[backend/src/middleware/auth.ts](backend/src/middleware/auth.ts)** - Authentication:
```typescript
export const createAuthGuard = () => {
  return {
    async beforeHandle({ request }) {
      const token = request.headers.get("Authorization")?.replace("Bearer ", "");
      if (!token) throw new Error("Unauthorized");
      const decoded = verify(token, process.env.JWT_SECRET!);
      return { user: decoded };
    }
  };
};

export const createRoleGuard = (allowedRoles: string[]) => {
  return {
    async beforeHandle(ctx) {
      const user = ctx.user;
      if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden");
      }
    }
  };
};
```

#### Running Backend

**Development:**
```bash
cd backend
bun run dev        # Watch mode, auto-reload on changes
```

**Production:**
```bash
bun run src/index.ts
```

**Testing:**
```bash
bun test
```

---

### Frontend Development

#### File Structure
```
frontend/src/
├── main.tsx                    # Vite entry point
├── App.tsx                     # Root component
├── components/
│   ├── common/                 # Buttons, forms, modals, etc.
│   └── layout/                 # Header, sidebar, navigation
├── context/
│   ├── AuthContext.tsx         # Global auth state
│   └── useDebounce.tsx         # Debounce hook
├── hooks/
│   └── useAuth.ts              # useAuth hook
├── pages/
│   ├── auth/                   # Login, Register
│   ├── client/                 # Client-exclusive pages
│   ├── employee/               # Employee dashboard
│   └── ...PageNotFound.tsx
├── router/
│   └── AppRouter.tsx           # Routes with role guards
├── services/
│   └── api.ts                  # Axios instance with JWT injection
└── types/
    └── ...
```

#### Key Files

**[frontend/src/hooks/useAuth.ts](frontend/src/hooks/useAuth.ts)** - Authentication hook:
```typescript
export const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);
  
  return {
    user,
    login: (email: string, password: string) => {
      // Call API, store JWT, update context
    },
    logout: () => {
      // Clear token, reset context
    }
  };
};
```

**[frontend/src/services/api.ts](frontend/src/services/api.ts)** - API client with JWT:
```typescript
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**[frontend/src/router/AppRouter.tsx](frontend/src/router/AppRouter.tsx)** - Protected routes:
```typescript
<Routes>
  <Route element={<ProtectedRoute roles={["client"]} />}>
    <Route path="/home" element={<HomePage />} />
    <Route path="/services" element={<ClientServicesPage />} />
  </Route>
  <Route element={<ProtectedRoute roles={["employee", "admin"]} />}>
    <Route path="/dashboard" element={<EmployeeDashboard />} />
  </Route>
</Routes>
```

#### Running Frontend

**Development:**
```bash
cd frontend
npm run dev       # Vite dev server on http://localhost:5173
```

**Build:**
```bash
npm run build     # Optimized production build in dist/
```

**Lint:**
```bash
npm run lint      # ESLint checks
```

**Test:**
```bash
npm run test      # Vitest with React Testing Library
```

---

### Adding a New Module

Example: Adding a "Review" feature

#### 1. Create Module Structure
```bash
mkdir -p backend/src/modules/review
touch backend/src/modules/review/{review.routes.ts,review.controller.ts,review.service.ts,types.ts}
```

#### 2. Define Types
```typescript
// review/types.ts
export interface Review {
  id_review: number;
  rating: number;
  comment: string;
  id_user: number;
  id_service: number;
  created_at: Date;
}
```

#### 3. Create Service (Business Logic)
```typescript
// review/review.service.ts
export class ReviewService {
  async getReviews(id_service: number) {
    const result = await query(
      `SELECT * FROM Review WHERE id_service = $1`,
      [id_service]
    );
    return result.rows;
  }

  async createReview(data: Review) {
    // Insert logic
  }
}
```

#### 4. Create Controller (Request Handler)
```typescript
// review/review.controller.ts
export class ReviewController {
  private service = new ReviewService();

  async getReviews({ params }: { params: { id_service: number } }) {
    return this.service.getReviews(params.id_service);
  }

  async createReview({ body }: { body: Review }) {
    return this.service.createReview(body);
  }
}
```

#### 5. Create Routes
```typescript
// review/review.routes.ts
import { Elysia } from "elysia";
import { ReviewController } from "./review.controller";

export const ReviewRoutes = new Elysia({ prefix: "/reviews" })
  .get("/:id_service", ReviewController.prototype.getReviews)
  .post("/", ReviewController.prototype.createReview, {
    guard: createAuthGuard()
  });
```

#### 6. Register in Main App
```typescript
// src/app.ts
import { ReviewRoutes } from "./modules/review/review.routes";

app.use(ReviewRoutes);
```

---

## Testing

### Backend Tests

```bash
cd backend
bun test
```

Tests located in `backend/src/tests/`

**Example:**
```typescript
// utils.test.ts
import { expect, test } from "bun:test";

test("password hashing", async () => {
  const password = "test123";
  const hashed = await hash(password);
  const match = await compare(password, hashed);
  expect(match).toBe(true);
});
```

### Frontend Tests

```bash
cd frontend
npm run test
```

Tests located in `frontend/src/tests/` using Vitest + React Testing Library

**Example:**
```typescript
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "../components/Button";

test("renders button with text", () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText("Click Me")).toBeInTheDocument();
});
```

---

## Deployment

### Production with Docker Compose

1. **Update `docker-compose.yml` with production settings:**
   - Set `JWT_SECRET` to a strong key
   - Use production database URL
   - Update API URL

2. **Build and deploy:**
   ```bash
   docker-compose up --build -d
   ```

3. **Access:**
   - Frontend: http://your-domain:8080
   - API: http://your-domain:3000

### Cloud Deployment (Example: AWS EC2)

1. **Build images:**
   ```bash
   docker build -t barber-api:latest ./backend
   docker build -t barber-frontend:latest ./frontend
   ```

2. **Push to registry:**
   ```bash
   docker tag barber-api:latest your-registry/barber-api:latest
   docker push your-registry/barber-api:latest
   ```

3. **Deploy:**
   - Use `docker-compose.production.yml` or Kubernetes manifest
   - Configure networking and SSL

---

## Troubleshooting

### Database Connection Issues

**Error: `connect ECONNREFUSED 127.0.0.1:5432`**

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # Docker
   docker ps | grep postgres

   # Local
   pg_isready -h localhost -p 5432
   ```

2. Verify credentials in `.env`

3. Restart services:
   ```bash
   docker-compose restart db
   ```

### JWT Token Errors

**Error: `Unauthorized - Invalid token`**

**Solution:**
1. Ensure token is in Authorization header:
   ```
   Authorization: Bearer eyJhbGciOi...
   ```

2. Check token expiration:
   ```bash
   # Decode token (use jwt.io or similar)
   ```

3. Verify `JWT_SECRET` matches between backend and token creation

### Port Conflicts

**Error: `Port 3000 already in use`**

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 bun run dev
```

### Docker Build Issues

**Error: `failed to solve with frontend dockerfile`**

**Solution:**
1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

2. Check Dockerfile syntax

3. Rebuild:
   ```bash
   docker-compose up --build --no-cache
   ```

### Stock Not Updating

**Issue: Products stock doesn't decrease after sale**

**Check:**
1. Trigger `trg_update_stock_after_sale` is enabled:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trg_update_stock_after_sale';
   ```

2. Sale detail products are correctly inserted:
   ```sql
   SELECT * FROM SaleDetailProduct WHERE id_sale = ?;
   ```

3. Check triggers in `db/init.sql`

---

## Contributing

### Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes:**
   - Follow existing code structure
   - Add/update tests
   - Update documentation

3. **Test:**
   ```bash
   # Backend
   cd backend && bun test

   # Frontend
   cd frontend && npm run test && npm run lint
   ```

4. **Commit:**
   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push & create PR:**
   ```bash
   git push origin feature/new-feature
   ```

### Code Standards

- **Backend**: TypeScript with strict mode, use Elysia decorators
- **Frontend**: React functional components, React Router, TypeScript types
- **Database**: Normalize to 3NF, use meaningful table/column names
- **Commits**: Conventional Commits (feat:, fix:, docs:, etc.)

---

## Project Statistics

- **Total Tables**: 13 (Users, Roles, Products, Services, Reservations, Sales, etc.)
- **Seed Data**: 25+ entries per table
- **Endpoints**: 20+ REST API routes
- **Database Features**: Triggers, procedures, views, CTEs
- **Frontend Pages**: 10+ pages (auth, dashboard, client, employee)
- **Lines of Code**: 2000+
- **Test Coverage**: Basic coverage for utilities and components

---

## Database Diagram

See `/docs/` for ER diagrams:
- `DERCSF.puml` (PlantUML format)
- `DERchen.dot` (Graphviz format)

1. **Build and start all services**:
   ```bash
   docker compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database: localhost:5432

3. **Login with demo credentials**:
   - Admin: `admin@example.com` / `password123`
   - Employee: `employee@example.com` / `password123`
   - Client: `client@example.com` / `password123`

### Local Development

1. **Install dependencies**:
   ```bash
   cd backend && bun install
   cd ../frontend && npm install
   ```

2. **Start PostgreSQL** (requires Docker):
   ```bash
   docker run -d -p 5432:5432 \
     -e POSTGRES_USER=proy2 \
     -e POSTGRES_PASSWORD=secret \
     -e POSTGRES_DB=barberdb \
     postgres:15
   ```

3. **Initialize database**:
   ```bash
   psql -U proy2 -d barberdb -f db/init.sql
   ```

4. **Start backend**:
   ```bash
   cd backend
   bun run src/index.ts
   ```

5. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

**POST /auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```
Response: User object + JWT token

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```
Response: `{ user: {...}, token: "jwt..." }`

### Protected Endpoints

All endpoints require `Authorization: Bearer <token>` header.

**GET /users** - List users (admin/employee)
**GET /services** - List all services
**POST /reservations** - Create reservation
**GET /reservations** - List user's reservations
**POST /products** - Create product (employee/admin)
**GET /categories** - List categories
**GET /suppliers** - List suppliers

## Database Diagram

See `docs/DERchen.dot` and `docs/DERCSF.puml` for entity relationship diagrams.

## Development Notes

- Uses `elysia` for HTTP server with guard middleware for auth
- JWT stored in Authorization header (not cookies)
- Role-based access via `UserRole` junction table (flexible permissions model)
- Automatic demo user creation ensures immediate testability
- Service selection and employee assignment provide better UX for clients

The services will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Seeding demo users

After starting the stack you can create demo users (admin, employee, client) by calling the backend endpoint:

```
GET http://localhost:3000/setup-demo

```
This will create three users with password `password123`. To verify current users and roles, call:

```
GET http://localhost:3000/debug/users
```

Note: temporary helper endpoints used during development were removed once role mappings were fixed.

## Local Development

If you want to run the apps without Docker:

- Backend: go to `backend/` and run `bun run dev`
- Frontend: go to `frontend/` and run `npm run dev`

If you see numeric formatting errors (e.g. `toFixed is not a function`), the backend may be returning numeric values as strings. The frontend coerces price/total values to numbers before formatting, but restarting the backend after a schema change is recommended.

## Notes

- `docker-compose.yml` and `docker-compose.yml.example` should stay in sync.
- The current repository layout is centered on the Docker Compose workflow.
