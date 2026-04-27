# Proyecto de Bases de datos 1

This repository contains a full-stack database project with three main parts:
the database layer, a backend API, and a frontend client.

## Repository Structure

- `backend/`: Bun + Elysia service that exposes the backend API.
- `frontend/`: React + Vite client used in the browser.
- `db/`: SQL scripts used to initialize PostgreSQL data and schema.
- `docs/`: Database diagrams and design documents.
- `docker-compose.yml`: Local development setup for the database, backend, and frontend containers.
- `docker-compose.yml.example`: Example compose file that matches the current stack.
- `.env.example`: Sample environment variables for the backend/database connection.

## Backend

The backend lives in `backend/` and runs with Bun. Its entry point is
`backend/src/index.ts`, which starts the Elysia server on port `3000`.

## Frontend

The frontend lives in `frontend/` and uses Vite with React. In Docker it runs
the Vite dev server on port `5173` so it can be reached from the browser.

## Database

The database setup lives in `db/init.sql`. That script is mounted into the
PostgreSQL container and runs automatically on first startup.

## Configuration

Copy `.env.example` if you need a local environment file. The compose stack uses
these values for the backend database connection:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=barberdb
```

## Run With Docker

Start the full stack with:

```bash
docker compose up --build
```

The services will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Local Development

If you want to run the apps without Docker:

- Backend: go to `backend/` and run `bun run dev`
- Frontend: go to `frontend/` and run `npm run dev`

## Notes

- `docker-compose.yml` and `docker-compose.yml.example` should stay in sync.
- The current repository layout is centered on the Docker Compose workflow.
