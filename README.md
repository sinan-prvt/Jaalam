# Jaalam Website Builder

Jaalam is a monorepo for generating and managing storefront websites. It combines a Django REST backend with a React/Vite frontend for public websites, an authenticated dashboard, an editor, and live preview flows.

## Repository Layout

- [backend/](backend) - Django project, REST API, SQLite database, and server-side apps.
- [frontend/](frontend) - React + TypeScript client, router, dashboard, editor, and themed website renderer.

## Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Quick Start

1. Start the backend from [backend/](backend): run migrations, then launch the Django server with `python manage.py runserver`.
2. Start the frontend from [frontend/](frontend): install dependencies with `npm install`, then run `npm run dev`.

## Project Notes

- The backend uses SQLite with the database file at [backend/db.sqlite3](backend/db.sqlite3).
- API routes are mounted under `/api/users/` and `/api/websites/`.
- The frontend currently wraps the app with Google OAuth in [frontend/src/main.tsx](frontend/src/main.tsx); replace the client ID before production use.
