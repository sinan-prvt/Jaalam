# Backend

This package contains the Django REST backend for Jaalam. It exposes user, notification, website, image upload, AI generation, and physical order endpoints, and it stores data in SQLite during local development.

## Stack

- Django 4.2
- Django REST Framework
- django-cors-headers
- SQLite

## Apps

- `users` handles authentication-related data, user management, and notifications.
- `websites` handles website content, generation, chat, uploads, and physical orders.

## URL Surface

- `/admin/` - Django admin.
- `/api/users/` - user and notification API routes.
- `/api/websites/` - website, generation, chat, upload, and order routes.

## Local Setup

1. Change into the backend directory.
2. Activate the existing virtual environment in [venv/](venv) if you want to reuse it.
3. Run database migrations with `python manage.py migrate`.
4. Start the server with `python manage.py runserver`.

## Notes

- The database file is [db.sqlite3](db.sqlite3).
- Custom user handling is configured with `AUTH_USER_MODEL = 'users.User'` in [config/settings.py](config/settings.py).
- CORS middleware is enabled in [config/settings.py](config/settings.py).