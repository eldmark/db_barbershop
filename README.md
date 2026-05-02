# Barber Shop Management System

Full-stack database project for a barber shop appointment and inventory management system. Features JWT authentication with role-based access control, real-time reservations, product inventory, and service management.

## Repository Structure

- `backend/`: Bun + Elysia REST API running on port `3000`
- `frontend/`: React 18 + Vite + React Router SPA running on port `5173`
- `db/`: PostgreSQL initialization scripts (schema + demo data)
- `docs/`: Database diagrams (DER)
- `docker-compose.yml`: Production setup for database, backend, and frontend
- `docker-compose.yml.example`: Reference compose configuration
- `.env.example`: Example environment variables

## Architecture

### Database (PostgreSQL)
- **Users**: Registration, login, role-based access (admin/employee/client)
- **Roles**: Predefined role types (admin=1, employee=2, client=3)
- **Services**: Haircut services with pricing
- **Products**: Inventory items with categories and suppliers
- **Sales**: Transaction tracking for product sales
- **Reservations**: Appointment booking with service and employee assignment
- **Permissions**: Fine-grained access control (extensible)

### Backend (Elysia/Bun)
Entry point: `backend/src/index.ts`

**Authentication**:
- JWT tokens (bearer token in Authorization header)
- Bcrypt password hashing
- Role-based route guards via `createRoleGuard()` and `createAuthGuard()`

**Routes**:
- `POST /auth/register` - Create new user account (auto-assigned "client" role)
- `POST /auth/login` - Authenticate and receive JWT token
- `GET /users` - List all users (admin/employee only)
- `POST /products` - Create product (employee/admin)
- `GET /categories`, `GET /suppliers`, `GET /services` - Public endpoints
- `POST/GET /reservations` - Appointment management

**Demo Users** (auto-created on startup): Press the botton tu create them
```
Email: employee@example.com    | Role: Employee   | Password: password123
Email: client@example.com      | Role: Client     | Password: password123
```

### Frontend (React + Vite)
Entry point: `frontend/src/main.tsx`

**Authentication Context** (`src/hooks/useAuth`):
- JWT token storage (localStorage/sessionStorage)
- Automatic Bearer token injection in API calls
- User info with roles array

**Role-Based Routes**:
- **Admin/Employee**: `/dashboard` → Products, Services, Reservations, Users
- **Client**: `/home` → Browse services, book appointments

**Client Pages**:
- `ServicesPage`: Browse and select services (shows detailed pricing)
- `ReservationsPage`: Book appointments with optional employee selection (randomly assigned if blank)

**Employee Pages**:
- `ProductsPage`: Manage inventory with category/supplier dropdowns
- `ServicesPage`: Create and update services
- `ReservationsPage`: View and manage all reservations

## Configuration

### Environment Variables

Root `.env.example` (for docker compose):
```env
DB_HOST=db
DB_PORT=5432
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=barberdb
JWT_SECRET=your-secret-key-here
```

Backend-specific (`backend/.env.example`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=barberdb
JWT_SECRET=your-secret-key-here
```

Frontend (`frontend/.env.example`):
```env
VITE_API_URL=http://localhost:3000
```

## Quick Start

### With Docker (Recommended)

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
