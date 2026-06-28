# ReleaseCheck — Backend

Production-quality REST API for tracking software releases and their checklist
progress. Built with **Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL,
Flyway, Lombok, and springdoc/OpenAPI**.

> **Key design rule:** a release's **status is never stored**. It is computed
> on every read from how many checklist steps are complete.

---

## Table of contents

- [Architecture](#architecture)
- [Database schema](#database-schema)
- [API endpoints](#api-endpoints)
- [Status computation](#status-computation)
- [Setup (local)](#setup-local)
- [Deployment (Render + Neon)](#deployment-render--neon)
- [Testing](#testing)
- [Spring Boot mentoring notes](#spring-boot-mentoring-notes)

---

## Architecture

A classic layered architecture. Each layer has one job and depends only on the
layer beneath it:

```
            HTTP request
                 │
                 ▼
      ┌───────────────────────┐
      │     Controller        │  HTTP adapter: bind + validate + map status
      │  (ReleaseController)   │
      └───────────┬───────────┘
                  │ DTOs
                  ▼
      ┌───────────────────────┐
      │      Service          │  Business logic + transactions
      │   (ReleaseService)    │
      └─────┬───────────┬─────┘
            │           │
       Mapper        Repository
   (entity<->DTO)   (Spring Data JPA)
            │           │
            ▼           ▼
      ┌───────────────────────┐
      │   Entity (Release)    │  JPA mapping; computes status (@Transient)
      └───────────┬───────────┘
                  │ Hibernate
                  ▼
      ┌───────────────────────┐
      │     PostgreSQL        │  releases + release_completed_steps
      └───────────────────────┘

  Cross-cutting: GlobalExceptionHandler (@RestControllerAdvice),
                 OpenApiConfig (Swagger), WebConfig (CORS).
```

### Package structure

```
com.releasecheck
├── controller   REST endpoints (ReleaseController)
├── service      Business logic (ReleaseService)
├── repository   Spring Data JPA (ReleaseRepository)
├── entity       JPA entities + enums (Release, ReleaseStep, ReleaseStatus)
├── dto          Request/response records + ErrorResponse
├── mapper       Entity <-> DTO conversion (ReleaseMapper)
├── exception    ResourceNotFoundException, GlobalExceptionHandler
├── config       OpenApiConfig, WebConfig (CORS)
└── util         ReleaseStatusCalculator (pure status logic)
```

---

## Database schema

Two tables. Note the **absence of a `status` column** by design.

```
releases
┌──────────────────┬──────────────┬───────────────────────────────┐
│ column           │ type         │ notes                         │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ BIGINT (PK)  │ generated identity            │
│ name             │ VARCHAR(255) │ NOT NULL                      │
│ release_date     │ TIMESTAMP    │ NOT NULL                      │
│ additional_info  │ VARCHAR(5000)│ nullable                      │
│ created_at       │ TIMESTAMP    │ NOT NULL                      │
│ updated_at       │ TIMESTAMP    │ NOT NULL                      │
└──────────────────┴──────────────┴───────────────────────────────┘

release_completed_steps          (maps Release.completedSteps via @ElementCollection)
┌──────────────┬──────────────┬───────────────────────────────────┐
│ column       │ type         │ notes                             │
├──────────────┼──────────────┼───────────────────────────────────┤
│ release_id   │ BIGINT (FK)  │ -> releases(id) ON DELETE CASCADE │
│ step         │ VARCHAR(64)  │ enum name, e.g. TESTS_PASSING     │
│ PK (release_id, step)                                            │
└──────────────┴──────────────┴───────────────────────────────────┘
```

Schema is created and versioned by **Flyway**
(`src/main/resources/db/migration/V1__create_releases.sql`). Hibernate runs in
`ddl-auto: validate` mode in production, so the app refuses to start if the
entity mappings ever drift from the migrated schema.

---

## API endpoints

Base path: `/api/releases`

| Method | Path                     | Body                              | Success | Description                       |
| ------ | ------------------------ | --------------------------------- | ------- | --------------------------------- |
| GET    | `/api/releases`          | —                                 | 200     | List all releases (summaries)     |
| GET    | `/api/releases/{id}`     | —                                 | 200     | Get one release (full)            |
| POST   | `/api/releases`          | `CreateReleaseRequest`            | 201     | Create a release                  |
| PATCH  | `/api/releases/{id}/info`| `UpdateInfoRequest`               | 200     | Update additional information     |
| PATCH  | `/api/releases/{id}/steps`| `ToggleStepRequest`              | 200     | Toggle a checklist step on/off    |
| DELETE | `/api/releases/{id}`     | —                                 | 204     | Delete a release                  |

### Example: create

```http
POST /api/releases
Content-Type: application/json

{
  "name": "Version 2.0",
  "releaseDate": "2026-07-01T10:00:00",
  "additionalInfo": "Production release"
}
```

```json
{
  "id": 1,
  "name": "Version 2.0",
  "releaseDate": "2026-07-01T10:00:00",
  "additionalInfo": "Production release",
  "status": "PLANNED",
  "completedSteps": [],
  "completedStepCount": 0,
  "totalStepCount": 8,
  "createdAt": "2026-06-28T12:00:00",
  "updatedAt": "2026-06-28T12:00:00"
}
```

### Example: toggle a step

```http
PATCH /api/releases/1/steps
Content-Type: application/json

{ "step": "TESTS_PASSING", "completed": true }
```

### Error shape

Every error returns the same body:

```json
{
  "timestamp": "2026-06-28T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Release not found with id: 99",
  "path": "/api/releases/99",
  "fieldErrors": null
}
```

Validation failures (400) additionally populate `fieldErrors`:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "fieldErrors": [{ "field": "name", "message": "name is required" }]
}
```

### Swagger / OpenAPI

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## Status computation

`status` is a derived value, computed by `ReleaseStatusCalculator`:

```
completed == 0           -> PLANNED
0 < completed < total    -> ONGOING
completed == total (8)   -> DONE
```

The entity exposes it via a `@Transient` getter, so:

- It is always consistent with the checklist — impossible to have a "DONE"
  release with unchecked steps.
- There is no column to migrate or keep in sync.
- The logic is a pure function, unit-tested without a database.

---

## Setup (local)

The database is **hosted online** (Neon / Supabase / Railway / …). The app reads
its connection details from a gitignored `.env` file, so credentials never live
in source control.

### Prerequisites

- JDK 21
- A hosted PostgreSQL database + its connection string
  (see [Deployment](#deployment-render--neon) to create a free Neon one)

> The Maven Wrapper (`./mvnw`) is included, so you do **not** need Maven installed.

### 1. Configure your database

```bash
cp .env.example .env
```

Edit `.env` with your provider's values (keep `?sslmode=require` for managed DBs):

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://<your-host>/releasecheck?sslmode=require
SPRING_DATASOURCE_USERNAME=<user>
SPRING_DATASOURCE_PASSWORD=<password>
```

### 2. Run

The app auto-loads `backend/.env` (via `spring-dotenv`), so just start it with
the Maven wrapper — no need to export anything:

```bash
./mvnw spring-boot:run          # macOS/Linux
mvnw.cmd spring-boot:run        # Windows
```

> `.env` is only used locally and is gitignored. In production (Render/etc.)
> there is no `.env` file, so the platform's environment variables are used
> instead — `spring-dotenv` simply does nothing when no `.env` is present.

The API comes up on `http://localhost:8080`. **Flyway creates the schema in your
hosted database on first start.**

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

> **Docker** files (`Dockerfile`, `docker-compose*.yml`) are included for later,
> but are **not needed** to run the app — the Maven wrapper above is all you need.

---

## Deployment (Render + Neon)

### 1. Database — Neon (managed PostgreSQL)

1. Create a project at [neon.tech](https://neon.tech) and a database named
   `releasecheck`.
2. Copy the connection string. Convert it to a JDBC URL, e.g.:
   ```
   jdbc:postgresql://<host>/releasecheck?sslmode=require
   ```
   Note the **username** and **password** separately.

### 2. App — Render (Docker web service)

1. Push this repo to GitHub.
2. On [render.com](https://render.com): **New → Web Service**, point it at the
   repo, set the root directory to `backend`, and choose **Docker** (Render uses
   the `Dockerfile`).
3. Add environment variables:

   | Key                          | Value                                             |
   | ---------------------------- | ------------------------------------------------- |
   | `SPRING_DATASOURCE_URL`      | `jdbc:postgresql://<neon-host>/releasecheck?sslmode=require` |
   | `SPRING_DATASOURCE_USERNAME` | _Neon user_                                       |
   | `SPRING_DATASOURCE_PASSWORD` | _Neon password_                                   |
   | `APP_CORS_ALLOWED_ORIGINS`   | your frontend URL, e.g. `https://your-app.vercel.app` |

   Render injects `PORT` automatically; the app already binds to `${PORT:8080}`.
4. Deploy. Flyway runs the migration against Neon on first boot.

> **Tip:** keep `ddl-auto: validate` in production so a schema mismatch fails
> fast instead of silently corrupting data.

---

## Testing

```bash
./mvnw test
```

Tests run against an **in-memory H2** database (PostgreSQL compatibility mode),
so no Docker/PostgreSQL is needed to run them.

| Test                            | Type        | Covers                                    |
| ------------------------------- | ----------- | ----------------------------------------- |
| `ReleaseStatusCalculatorTest`   | Unit        | Status derivation rules                   |
| `ReleaseMapperTest`             | Unit        | Entity ↔ DTO mapping + counts             |
| `ReleaseServiceTest`            | Unit (Mockito) | Service logic, not-found, toggle add/remove |
| `ReleaseControllerTest`         | Integration (`@WebMvcTest`) | Endpoints, validation 400, 404 |
| `ReleaseRepositoryTest`         | Integration (`@DataJpaTest`) | Persistence of `@ElementCollection`, ordering |

---

## Spring Boot mentoring notes

A walkthrough of *why* the project is shaped this way.

### Why Controllers exist
A controller is a **thin adapter between HTTP and your application**. Its only
jobs: read/validate the request, call a service, and turn the result into an
HTTP response (status code + body). It holds **no business logic**, so your
rules aren't tangled up with web concerns and can be tested without HTTP.

### Why Services exist
The service is where **business logic and transaction boundaries** live
(`@Transactional`). Putting logic here (not in controllers or repositories)
means it's reusable (a future scheduled job or message consumer can call the
same method) and unit-testable with mocks. Example: "toggle a step" decides
whether to add or remove from the set — that decision belongs in the service.

### Why Repositories exist
The repository is the **data-access abstraction**. By extending
`JpaRepository`, Spring Data **generates the implementation at runtime** — you
get `save`, `findById`, `findAll`, `delete`, etc. for free, and can declare
extra queries just by naming a method (`findAllByOrderByReleaseDateDesc`). Your
business code depends on an interface, not on SQL or Hibernate details.

### Why DTOs exist
DTOs (Data Transfer Objects) **decouple your API contract from your database
model**. Benefits:
- You don't leak entity internals (or accidentally expose fields).
- The API can shape data for clients (e.g. add `status`, `completedStepCount`).
- You avoid lazy-loading/serialization traps that come from serializing
  entities directly.
Here they're Java `record`s — immutable and concise, with validation
annotations on the request types.

### Why JPA mappings are used
JPA/Hibernate is an **ORM**: it maps Java objects to relational rows so you work
with objects (`release.getCompletedSteps().add(...)`) instead of hand-writing
SQL. Annotations like `@Entity`, `@Table`, `@Column`, `@Id`, and
`@GeneratedValue` describe how the `Release` object corresponds to the
`releases` table, and Hibernate handles the INSERT/UPDATE/SELECT for you.

### Why @ElementCollection is used
`completedSteps` is a collection of **value objects** (enum values), not a
collection of full entities — there's no "Step" with its own identity and
lifecycle. `@ElementCollection` is exactly for this: it stores the set in a
separate table (`release_completed_steps`) owned entirely by the `Release`.
Combined with `@Enumerated(EnumType.STRING)`, each step is stored as its
readable name. (If a step ever needed its own fields/identity, we'd promote it
to a `@OneToMany` entity instead.)

### How dependency injection works
You never call `new ReleaseService(...)` yourself. Spring **creates and wires**
your beans: it sees `@Service`, `@Repository`, `@Component`, `@RestController`,
constructs a single instance of each, and injects the dependencies a class
declares. We use **constructor injection** (via Lombok's
`@RequiredArgsConstructor` on `final` fields), which makes dependencies explicit
and the object immutable and easy to test (just pass mocks to the constructor).

### How status computation works
See [Status computation](#status-computation). The short version:
`Release.getStatus()` is a `@Transient` method that delegates to the pure
`ReleaseStatusCalculator.compute(...)`. Because it's derived from
`completedSteps` and never persisted, the status is always correct by
construction and there's nothing to keep in sync.

### Best practices used here & possible improvements
**Already applied**
- Layered architecture with single-responsibility classes.
- DTOs + a dedicated mapper; entities never cross the API boundary.
- Centralized error handling with a consistent error body.
- Bean Validation on inputs; constructor injection; `open-in-view: false`.
- Flyway-managed schema + Hibernate `validate`.
- Derived (never-stored) status.

**Where you'd go next**
- **Testcontainers** for repository/integration tests against real PostgreSQL
  (closer to prod than H2).
- **Pagination & sorting** on `GET /api/releases` (`Pageable`) for large data.
- **Optimistic locking** (`@Version`) to handle concurrent edits safely.
- **MapStruct** to generate the mapper at compile time.
- **Spring Security** + auth if releases become multi-user.
- **Actuator** health/metrics endpoints for observability.
- A `@ControllerAdvice` handler for `DataIntegrityViolationException` if you add
  unique constraints (e.g. unique release names).
```
