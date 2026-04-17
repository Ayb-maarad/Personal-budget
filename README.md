# Envelope Budget Manager

A full-stack personal budget management application built on a microservices architecture. Users manage their budget using the **envelope method** — allocating money into named spending categories and tracking deductions via transactions.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services](#services)
  - [Auth Service](#auth-service)
  - [Budget Service](#budget-service)
  - [Frontend](#frontend)
  - [Database](#database)
- [API Reference](#api-reference)
  - [Auth API](#auth-api)
  - [Envelopes API](#envelopes-api)
  - [Transactions API](#transactions-api)
- [Authentication & Security](#authentication--security)
- [Data Models](#data-models)
- [Running the Application](#running-the-application)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Production](#production)
  - [Development](#development)
- [Database Migrations](#database-migrations)
- [Frontend Pages & Components](#frontend-pages--components)
- [Testing](#testing)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
└───────────────────────┬─────────────────────────────────┘
                        │ :80  (single entry point)
                        ▼
              ┌──────────────────┐
              │  Nginx Gateway   │
              │    port 80       │
              └──┬───────────────┘
                 │
      /api/auth/ │    /api/       │    /
         ┌───────┘   ┌────────────┘   ┌──────────┐
         ▼           ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │Budget Service│ │   Frontend   │
│  (internal)  │ │  (internal)  │ │    Nginx     │
│   :5001      │ │   :5000      │ │    :80       │
└──────┬───────┘ └──────┬───────┘ └──────────────┘
       │                │
       └────────┬───────┘
                ▼
      ┌──────────────────┐
      │   PostgreSQL 16  │
      │  DB: auth        │
      │  DB: budget      │
      └──────────────────┘
```

All services run in Docker containers on an internal Docker network. Only the gateway and the database are exposed to the host. The frontend is served by Nginx (static bundle) in production and a Vite dev server in development.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router v7, Axios, Recharts |
| Auth Service | Node.js, Express 5, Sequelize, bcrypt, jsonwebtoken, express-rate-limit, umzug |
| Budget Service | Node.js, Express 5, Sequelize, jsonwebtoken, swagger-jsdoc, umzug |
| Database | PostgreSQL 16 |
| Migrations | sequelize-cli, umzug |
| Gateway | Nginx (reverse proxy) |
| Infrastructure | Docker, Docker Compose |
| Testing | Jest, coverage via lcov |

---

## Project Structure

```
portfolio1/
├── docker-compose.yml          # Production compose file
├── docker-compose.dev.yml      # Development overrides (hot reload)
├── init-db.sql                 # Creates the `auth` database on first run
├── .env                        # Root secrets (gitignored)
│
├── Auth-service/
│   ├── app.js                  # Entry point — Express setup, route mounting
│   ├── Dockerfile
│   └── src/
│       ├── config/
│       │   └── database.js     # sequelize-cli DB config
│       ├── controllers/
│       │   └── authController.js
│       ├── db/
│       │   ├── index.js        # Sequelize connection + umzug migration runner
│       │   ├── migrations/
│       │   │   └── 20260417000001-create-users.js
│       │   └── models/
│       │       └── Users.js
│       ├── middleware/
│       │   ├── verifyToken.js
│       │   └── loginRateLimiter.js
│       ├── routes/
│       │   └── Authroutes.js
│       └── services/
│           └── authService.js
│
├── budget-service/
│   ├── app.js                  # Entry point — Express setup, route mounting
│   ├── Dockerfile
│   └── src/
│       ├── config/
│       │   ├── swagger.js
│       │   └── database.js     # sequelize-cli DB config
│       ├── controllers/
│       │   ├── envelopesController.js
│       │   └── transactionController.js
│       ├── db/
│       │   ├── index.js        # Sequelize connection + umzug migration runner
│       │   ├── migrations/
│       │   │   ├── 20260417000001-create-envelopes.js
│       │   │   └── 20260417000002-create-transactions.js
│       │   └── models/
│       │       ├── Envelope.js
│       │       └── Transaction.js
│       ├── middleware/
│       │   └── verifyToken.js
│       ├── routes/
│       │   ├── envelopesRoutes.js
│       │   └── transactionRoutes.js
│       ├── services/
│       │   ├── envelopeService.js
│       │   └── transactionService.js
│       └── tests/
│           ├── controllers/
│           │   ├── envelopeController.test.js
│           │   └── transactionController.test.js
│           └── services/
│               ├── envelopeService.test.js
│               └── transactionService.test.js
│
├── nginx/
│   ├── gateway.conf            # Production Nginx gateway config
│   └── gateway.dev.conf        # Development gateway config (proxies Vite HMR)
│
└── front/
    ├── index.html
    ├── vite.config.ts
    ├── Dockerfile              # Production (Nginx)
    ├── Dockerfile.dev          # Development (Vite dev server)
    └── src/
        ├── App.jsx             # Route definitions
        ├── main.jsx            # App entry — wraps in AuthProvider
        ├── index.css           # Tailwind + CSS variable theme
        ├── components/
        │   ├── CreateEnvelopeForm.tsx
        │   ├── EnvelopeItem.tsx
        │   ├── Modal.tsx
        │   ├── TransactionForm.tsx
        │   ├── Transactionlogs.tsx
        │   ├── UpdateEnvelopeFrom.tsx
        │   ├── ProtectedRoute.jsx
        │   └── ui/             # shadcn/ui primitives
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── login.tsx
        │   ├── register.tsx
        │   └── EnvelopePage.tsx
        └── services/
            ├── authService.js
            ├── envelopeService.js
            └── transactionService.js
```

---

## Services

### Auth Service

**Port:** `5001`  
**Base path:** `/api/auth`

Handles user registration, login, logout, and session verification. Issues a signed JWT stored as an `httpOnly` cookie on successful login.

**Responsibilities:**
- Register new users with bcrypt-hashed passwords
- Authenticate users and issue JWTs (1-hour expiry)
- Verify session via the `/me` endpoint (used by the frontend `AuthContext` on page load)
- Rate-limit login attempts to prevent brute-force attacks

**Key middleware:**
- `verifyToken` — validates the JWT from `req.cookies.token`, attaches decoded payload to `req.user`
- `loginRateLimiter` — limits login to **10 requests per 15 minutes** per IP

---

### Budget Service

**Port:** `5000`  
**Base paths:** `/api/envelopes`, `/api/transactions`

Core business logic for the envelope budgeting system. All routes are protected by `verifyToken` middleware — the `userId` extracted from the JWT is used to scope all data queries, ensuring users can only access their own envelopes and transactions.

**Responsibilities:**
- CRUD operations for budget envelopes
- Create transactions that deduct from an envelope's balance
- Prevent transactions that would result in a zero or negative balance
- Scope all data by `userId` for multi-user isolation

**Key business rules:**
- Envelope titles are stored trimmed and lowercased
- Budget must be ≥ 0
- A transaction fails if `envelope.budget - transaction.amount <= 0`
- Envelope titles must be unique per user

---

### Frontend

**Production port:** `80` (Nginx)  
**Dev port:** `5173` (Vite)

Single-page React application. Auth state is managed globally via `AuthContext`, which calls `GET /api/auth/me` on load to restore the session. Unauthenticated users are redirected to `/login` by the `ProtectedRoute` component.

**Routing:**

| Path | Component | Protected |
|---|---|---|
| `/` | `Login` | No |
| `/login` | `Login` | No |
| `/register` | `Register` | No |
| `/envelopes` | `EnvelopePage` | Yes |

---

### Database

PostgreSQL 16 running in Docker. Two databases are initialized:

- **`budget`** — default database, created by Docker Compose environment variables
- **`auth`** — created by `init-db.sql` at first container startup

Schema is managed by **versioned migrations** via [umzug](https://github.com/sequelize/umzug). On every service startup `umzug.up()` runs all pending migration files and records them in a `SequelizeMeta` table — already-applied migrations are skipped. `sequelize.sync()` is not used.

### Nginx Gateway

An Nginx reverse proxy sits in front of all services as the single entry point on port 80. It routes by path prefix:

| Path prefix | Upstream |
|---|---|
| `/api/auth/` | auth-service:5001 |
| `/api/` | budget-service:5000 |
| `/` | frontend:80 |

Backend services are **not** exposed to the host — only the gateway and the database port are published. In development, a separate `gateway.dev.conf` proxies to the Vite dev server with WebSocket support for HMR.

---

## API Reference

### Auth API

Base URL: `http://localhost/api/auth` (via gateway)  
Direct: `http://localhost:5001/api/auth` (dev only)

#### `POST /register`

Register a new user account.

**Request body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `201`:**
```json
{
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

**Errors:** `400` if fields are missing or email already exists.

---

#### `POST /login`

Authenticate and receive a session cookie. Rate limited to 10 requests per 15 minutes.

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{ "message": "Login successful" }
```

Sets cookie: `token=<JWT>; HttpOnly; SameSite=Strict; Max-Age=3600`

**Errors:** `401` for invalid credentials, `429` when rate limit exceeded.

---

#### `POST /logout`

Clear the session cookie.

**Response `200`:**
```json
{ "message": "Logged out successfully" }
```

---

#### `GET /me`

Return the currently authenticated user. Requires the `token` cookie.

**Response `200`:**
```json
{
  "user": { "id": 1, "iat": 1713300000, "exp": 1713303600 }
}
```

**Errors:** `401` if no token or token is expired/invalid.

---

### Envelopes API

Base URL: `http://localhost/api/envelopes` (via gateway)  
Direct: `http://localhost:5000/api/envelopes` (dev only)

All endpoints require a valid `token` cookie.

#### `GET /`

Get all envelopes for the authenticated user.

**Response `200`:**
```json
[
  { "id": 1, "title": "food", "budget": 500, "userId": 1 },
  { "id": 2, "title": "sport", "budget": 553, "userId": 1 }
]
```

---

#### `GET /:id`

Get a single envelope by ID.

**Response `200`:** Single envelope object.  
**Errors:** `404` if not found or doesn't belong to the user.

---

#### `POST /`

Create a new envelope.

**Request body:**
```json
{
  "title": "transport",
  "budget": 200
}
```

**Response `201`:** Created envelope object.  
**Errors:** `400` if title/budget missing, budget negative, or title already exists for user.

---

#### `PUT /:id`

Update an envelope's title and/or budget.

**Request body:**
```json
{
  "title": "transport",
  "budget": 250
}
```

**Response `200`:** Updated envelope object.  
**Errors:** `404` if not found.

---

#### `DELETE /:id`

Delete an envelope.

**Response `200`:** Deleted envelope object.  
**Errors:** `404` if not found.

---

### Transactions API

Base URL: `http://localhost/api/transactions` (via gateway)  
Direct: `http://localhost:5000/api/transactions` (dev only)

All endpoints require a valid `token` cookie.

#### `GET /`

Get all transactions belonging to the authenticated user (across all their envelopes).

**Response `200`:**
```json
{
  "transactions": [
    { "id": 1, "envelopeId": 2, "budget": 47, "date": "2026-04-17T..." }
  ]
}
```

---

#### `GET /:id`

Get all transactions for a specific envelope ID.

**Response `200`:** Array of transaction objects.

---

#### `GET /transaction/:id`

Get a single transaction by its ID.

**Response `200`:** Single transaction object.

---

#### `POST /`

Create a transaction against an envelope. Deducts the amount from the envelope's balance.

**Request body:**
```json
{
  "title": "food",
  "budget": 45
}
```

> `title` refers to the **envelope name**, not a transaction label.

**Response `201`:**
```json
{
  "transaction": { "id": 3, "envelopeId": 1, "budget": 45, "date": "..." },
  "updated_envelope": { "id": 1, "title": "food", "budget": 455, "userId": 1 }
}
```

**Errors:** `400` if envelope not found, budget is missing or negative, or insufficient funds.

---

## Authentication & Security

| Concern | Implementation |
|---|---|
| Password storage | bcrypt with salt rounds = 10 |
| Session token | JWT signed with `JWT_SECRET`, 1-hour expiry |
| Token transport | `httpOnly` cookie — inaccessible to JavaScript |
| Cookie policy | `SameSite=Strict` — prevents CSRF |
| Brute force | Rate limiter on `POST /login`: 10 req / 15 min |
| Data isolation | All DB queries scoped by `userId` from JWT payload |
| CORS | Explicit origin whitelist with `credentials: true` |
| Secret management | All secrets in `.env`, never committed to source control |

---

## Data Models

### User (auth database)

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `username` | STRING | Not null, unique |
| `email` | STRING | Not null, unique |
| `password` | STRING | Not null (bcrypt hash) |

---

### Envelope (budget database)

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `title` | STRING | Not null (trimmed + lowercased on write) |
| `budget` | INTEGER | Not null, min 0 |
| `userId` | INTEGER | Not null (from JWT, not a foreign key) |

---

### Transaction (budget database)

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `envelopeId` | INTEGER | Not null |
| `budget` | INTEGER | Not null, min 0 |
| `date` | DATE | Not null, defaults to `NOW` |

---

## Running the Application

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A `.env` file in the project root (see below)

### Environment Variables

Create a `.env` file in the root of the project:

```env
# PostgreSQL superuser (used by the postgres Docker image)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=budget

# Application DB credentials (used by services)
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT signing secret — use a long random string
JWT_SECRET=your_very_long_random_secret_here
```

> Never commit `.env` to version control. It is listed in `.gitignore`.

---

### Production

Builds optimized images and serves the frontend via Nginx on port 80.

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| App (via gateway) | http://localhost |
| PostgreSQL | localhost:5432 |

Backend services are internal only — access them through the gateway at `/api/auth/` and `/api/`.

---

### Development

Enables hot reload for all services. The backend services use `nodemon` and the frontend uses the Vite dev server with HMR.

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

| Service | URL |
|---|---|
| App (via gateway) | http://localhost |
| Frontend (Vite direct) | http://localhost:5173 |
| Auth Service (direct) | http://localhost:5001 |
| Budget Service (direct) | http://localhost:5000 |

**How dev mode differs from production:**
- Backend services mount source code as volumes — file changes restart the server automatically via `nodemon`
- Frontend uses `Dockerfile.dev` which runs `vite` instead of building a static bundle
- Gateway uses `gateway.dev.conf` which proxies the Vite dev server with WebSocket/HMR support
- `NODE_ENV=development` is set on both backend services
- `CORS_ORIGIN` is set to `http://localhost`

**Reset database volumes** (e.g., after schema changes):
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

---

## Database Migrations

Migration files live in `src/db/migrations/` in each service. They run automatically on startup via `umzug.up()`. Migration state is tracked in a `SequelizeMeta` table in each database.

**Adding a new schema change:**

```bash
cd budget-service
npx sequelize-cli migration:generate --name add-description-to-envelopes
# Edit the generated file, then restart the service — it runs automatically
```

**Manual migration commands** (useful for debugging):

```bash
# Run all pending migrations
npm run migrate

# Roll back the last migration
npm run migrate:undo

# Roll back all migrations
npm run migrate:undo:all
```

**Migration file structure:**

```js
module.exports = {
  async up(queryInterface, Sequelize) {
    // apply change — e.g. add a column
    await queryInterface.addColumn('envelopes', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    // undo the change
    await queryInterface.removeColumn('envelopes', 'description');
  },
};
```

**Current migrations:**

| Service | File | Description |
|---|---|---|
| auth-service | `20260417000001-create-users.js` | Creates `users` table |
| budget-service | `20260417000001-create-envelopes.js` | Creates `envelopes` table |
| budget-service | `20260417000002-create-transactions.js` | Creates `Transactions` table with FK to envelopes |

---

## Frontend Pages & Components

### Pages

**`/login`**  
Email/password login form. On success, navigates to `/envelopes`. Displays error messages on failed login.

**`/register`**  
Username, email, and password registration form. On success, navigates to `/login`.

**`/envelopes`** _(protected)_  
The main application view. Contains all envelope management and transaction functionality. Includes a **Disconnect** button that clears the session and returns to `/login`.

---

### Components

| Component | Responsibility |
|---|---|
| `ProtectedRoute` | Redirects unauthenticated users to `/login`. Renders nothing while auth state is loading. |
| `AuthContext` | Global auth state. Calls `GET /me` on mount to restore session. Provides `user`, `setUser`. |
| `EnvelopeItem` | Renders the list of envelopes with budget display, edit (opens modal), and delete actions. |
| `CreateEnvelopeForm` | Form to create a new envelope with a title and starting budget. |
| `UpdateEnvelopeFrom` | Form (inside a modal) to update an envelope's title and budget. |
| `TransactionForm` | Dropdown + amount input to record a spending transaction against an envelope. |
| `Transactionlogs` | Displays the full transaction history in a scrollable table. |
| `Modal` | Generic overlay wrapper with backdrop click-to-close behaviour. |

---

### State Flow

```
AuthContext (global)
  └── user: undefined (loading) | null (unauthenticated) | object (authenticated)

EnvelopePage (local)
  ├── envelopes[]       — fetched on mount and after any mutation
  └── transactions[]    — fetched on mount and after any transaction
```

---

## Testing

Tests live in `budget-service/src/tests/` and are run with Jest.

```bash
cd budget-service
npm test
```

Coverage reports are generated in `budget-service/coverage/`. Open `coverage/lcov-report/index.html` in a browser to view the full interactive report.

**Test structure:**

```
tests/
├── controllers/
│   ├── envelopeController.test.js
│   └── transactionController.test.js
└── services/
    ├── envelopeService.test.js
    └── transactionService.test.js
```
