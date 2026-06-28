# Release-Checklist-Tool

A small single-page app for tracking software releases and their checklist.
For each release you can record a **name**, **due date**, and optional
**additional information**, then **check/uncheck** the eight steps that make up
its checklist. Release **status** (Planned / Ongoing / Done) is computed
automatically from how many steps are done.

> Single-user — no login or user management.

- **Frontend:** React + Vite (single-page app), Tailwind CSS, TanStack Query, Axios
- **Backend:** Java 21 + Spring Boot 3 REST API, Spring Data JPA, Flyway
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech))

```
Release-Checklist-Tool/
├── frontend/   React SPA            (see frontend/README.md)
├── backend/    Spring Boot REST API (see backend/README.md)
└── README.md   ← you are here
```

---

## Run locally

### 1. Backend (`backend/`)

Needs JDK 21 and a hosted PostgreSQL connection string.

```bash
cd backend
cp .env.example .env          # then put your Postgres credentials in .env
./mvnw spring-boot:run        # mvnw.cmd on Windows
```

The API starts on `http://localhost:8080` and Flyway creates the schema on first
run. `.env` is gitignored — credentials never get committed.

### 2. Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

**Mock mode vs. real API.** By default the frontend runs in **mock mode**
(`VITE_USE_MOCK=true` in `frontend/.env`) — it uses an in-browser localStorage
store, so a fresh clone works immediately with **no backend or database**.

To make the frontend call the **real backend API** instead, create a gitignored
`frontend/.env.local`:

```bash
# frontend/.env.local
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
VITE_API_PROXY=http://localhost:8080
```

Then **restart `npm run dev`** (Vite only reads env files at startup) and make
sure the backend is running. The frontend calls `/api`, which Vite proxies to
`http://localhost:8080` in dev (no CORS setup needed). For a deployed frontend,
set `VITE_API_BASE_URL` to the backend's public URL (e.g.
`https://your-backend.onrender.com/api`).

---

## API endpoints

Base path: `/api/releases`

| Method | Path                       | Body                                     | Description                   |
| ------ | -------------------------- | ---------------------------------------- | ----------------------------- |
| GET    | `/api/releases`            | —                                        | List all releases             |
| GET    | `/api/releases/{id}`       | —                                        | Get one release               |
| POST   | `/api/releases`            | `{ name, releaseDate, additionalInfo? }` | Create a release              |
| PATCH  | `/api/releases/{id}/info`  | `{ additionalInfo }`                     | Update additional information |
| PATCH  | `/api/releases/{id}/steps` | `{ step, completed }`                    | Check / uncheck a step        |
| DELETE | `/api/releases/{id}`       | —                                        | Delete a release              |

Interactive docs (Swagger UI): `http://localhost:8080/swagger-ui.html`

**Example — create:**

```http
POST /api/releases
{ "name": "Version 2.0", "releaseDate": "2026-07-01T10:00:00", "additionalInfo": "Production release" }
```

**Example — check a step:**

```http
PATCH /api/releases/1/steps
{ "step": "TESTS_PASSING", "completed": true }
```

Steps (enum): `PRS_MERGED`, `CHANGELOG_UPDATED`, `TESTS_PASSING`,
`GITHUB_RELEASE_CREATED`, `STAGING_DEPLOYED`, `QA_VERIFIED`,
`PRODUCTION_DEPLOYED`, `SMOKE_TESTED`.

---

## Database schema

Two tables. **Status is not stored** — it is derived from the completed steps.

```
releases
├── id               BIGINT        PK, auto-generated
├── name             VARCHAR(255)  NOT NULL
├── release_date     TIMESTAMP     NOT NULL          (the due date)
├── additional_info  VARCHAR(5000) NULL              (optional)
├── created_at       TIMESTAMP     NOT NULL
└── updated_at       TIMESTAMP     NOT NULL

release_completed_steps                              (one row per checked step)
├── release_id  BIGINT       FK → releases(id) ON DELETE CASCADE
└── step        VARCHAR(64)  enum name, e.g. "TESTS_PASSING"
    PRIMARY KEY (release_id, step)
```

Schema is managed by Flyway: `backend/src/main/resources/db/migration/`.

---

## Deployment

The app is designed to run online:

- **Database:** Neon (managed PostgreSQL)
- **Backend:** Render — set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`,
  `SPRING_DATASOURCE_PASSWORD`, and `APP_CORS_ALLOWED_ORIGINS` as env vars
- **Frontend:** Vercel — set `VITE_API_BASE_URL` to the deployed backend's `/api`

> 🔗 Live URLs: _add your deployed frontend & backend links here once deployed_

Full backend run/deploy details and learning notes: [backend/README.md](backend/README.md).

---

## Requirements checklist

**Core**
- [x] View all releases
- [x] Create a release (name, due date, optional additional information)
- [x] Check / uncheck checklist steps
- [x] Update additional information
- [x] Single repository on GitHub
- [x] Single-page application
- [x] State in hosted PostgreSQL (Neon)
- [x] Frontend ↔ backend over an API
- [x] Simple, usable, styled UX
- [x] README with run instructions, API endpoints, and DB schema
- [x] Single-user (no auth)

**Nice-to-have**
- [x] Delete a release
- [x] Responsive interface
- [ ] GraphQL API layer _(used REST instead)_
- [x] Run backend with Docker (`backend/Dockerfile` + compose) _(optional; not required to run)_
- [x] Automated tests (28 backend tests: unit + integration)
