# Setup & Database Instructions

This project uses a custom database setup (PostgreSQL recommended, SQLite supported for local dev). 

## Database Setup

By default, the project uses **SQLite3** for rapid local development, meaning you do not need to install a running database server just to test the application. The database is automatically generated at `backend/db.sqlite3`.

If you wish to run **PostgreSQL** (Production mode), update your `.env` file in the `backend/` directory:
```env
USE_POSTGRES=True
DB_NAME=quizdb
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

## Running Migrations (DDL Setup)

The database schema definitions are managed through Django's robust migration system.
To generate the tables, constraints, relationships, and indexes, run:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Schema Overview

- `users_user`: Custom user model (email as primary identifier, stores Google OAuth flags and Admin status).
- `quizzes_quiz`: Stores quiz metadata (title, description, created by).
- `quizzes_question`: Linked to `Quiz` via Foreign Key. Contains question text, an array of exactly 4 options (JSON field), and the correct answer index.
- `attempts_attempt`: Links users to the quizzes they've taken. Stores submitted answers as JSON and the server-calculated score.

## Seeding Data

A seed script is provided to quickly populate the database with a user and a sample quiz to test functionality without manual entry.

To seed the database:
```bash
cd backend
python seed.py
```
*Note: Ensure you have run migrations before executing the seed script.*

## Authentication & Security

This project implements robust Server-Side authentication:
1. **Google OAuth 2.0:** Frontend gets an ID token, backend strictly verifies it with Google's public keys via `google-auth` before issuing short-lived JWTs.
2. **Traditional Auth:** Users can also register via Email/Password natively. Passwords are cryptographically hashed using PBKDF2.
3. **Admin Protection:** Admin privileges are strictly derived from the `ADMIN_EMAILS` environment setting, ensuring robust RBAC (Role-Based Access Control). Only Admins can access `POST /api/quizzes/`.
