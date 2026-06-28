# ReleaseCheck — Release Checklist Tool (Frontend)

A modern, responsive frontend for tracking software releases through their
checklist — from **Planned** to **Ongoing** to **Done**.

Built with **React + Vite + JavaScript (JSX) + Tailwind CSS + TanStack Query + Axios + React Router**.

> The app ships with a built-in **localStorage mock backend** so it runs fully
> with zero server. Point it at a real API by flipping one env flag.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run lint       # oxlint
```

### Connecting a real backend

By default `VITE_USE_MOCK=true` (mock mode). To call the real backend, create a
gitignored `frontend/.env.local`:

```bash
# frontend/.env.local
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
VITE_API_PROXY=http://localhost:8080   # dev proxy target for /api
```

Then **restart `npm run dev`** (Vite reads env files only at startup) and make
sure the backend is running. See [.env.example](.env.example).

---

## Tech stack

| Concern        | Choice                       | Why |
| -------------- | ---------------------------- | --- |
| Build tool     | **Vite**                     | Instant HMR, fast builds |
| UI             | **React 19 + JSX**           | Component model, no build-time type ceremony |
| Styling        | **Tailwind CSS v3**          | Utility-first, themeable, tiny shipped CSS |
| Server state   | **TanStack Query v5**        | Caching, invalidation, optimistic updates |
| HTTP           | **Axios**                    | Interceptors + a clean service layer |
| Routing        | **React Router v7**          | Nested layout + route params |

---

## Folder structure

```
src/
  api/            Axios client, mock backend, releases service
  assets/         Static assets
  components/     Reusable UI + domain components
    ui/           Primitives: Button, Input, Textarea, Modal
  constants/      Enums, labels, status styles, query keys
  hooks/          Query/mutation hooks, theme + toast providers
  pages/          Route-level screens
  utils/          Formatting, status derivation, error helpers
```

### Component inventory

`Navbar` · `AppLayout` · `ReleaseTable` · `ReleaseCard` · `ReleaseForm` ·
`ReleaseDetails` · `StepChecklist` · `StepItem` · `StatusBadge` ·
`DeleteDialog` · `LoadingSkeleton` · `EmptyState` · `ErrorState` ·
`ErrorBoundary` · `Toast` · `Button` · `Input` · `Textarea` · `Modal`

---

## Architecture decisions

### Data layer: a swappable API service

`src/api/releases.js` exposes one function per endpoint. Each routes to either
the **Axios client** (`client.js`) or the **localStorage mock** (`mock.js`) based
on `VITE_USE_MOCK`. The rest of the app never knows which is active — components
only ever import hooks. This means the UI was built and verified end-to-end
before a backend existed, and switching over is a one-line env change.

Endpoints mirrored:

```
GET    /api/releases
GET    /api/releases/:id
POST   /api/releases
PATCH  /api/releases/:id/steps
PATCH  /api/releases/:id/info
DELETE /api/releases/:id
```

### Server state with TanStack Query

- **Centralized query keys** (`constants/index.js → queryKeys`) keep reads and
  invalidations in sync.
- **Optimistic updates** for the two highest-frequency actions:
  - *Toggling a checklist step* updates both the detail and list caches
    immediately (including the derived status badge), and rolls back on error.
  - *Deleting a release* removes it from the list cache instantly.
- **Invalidation** on settle/success guarantees the cache reconciles with the
  server's source of truth.

### Derived status

Status (`PLANNED`/`ONGOING`/`DONE`) is derived from checklist progress
(`utils/deriveStatus`). The backend remains authoritative, but deriving locally
powers instant optimistic badge updates without a round-trip.

### Styling strategy

- **Tailwind utility-first** with a small design system in `tailwind.config.js`:
  a `brand` color ramp, soft shadow tokens, and entrance animations.
- **Status colors** are centralized in `constants → STATUS_STYLES`
  (gray / orange / green) so badges, dots and progress never drift.
- A couple of reusable patterns (`.skeleton` shimmer) live in `@layer
  components` in `index.css`; everything else is utilities on the elements.

### Responsive strategy

One component tree, breakpoint-driven presentation:

- **Desktop (`md+`)** → full data **table** (`ReleaseTable`) with a sortable
  Date column and inline progress bars.
- **Tablet / Mobile (`< md`)** → the same data as stacked **cards**
  (`ReleaseCard`); action buttons go full-width and stack for easy tapping.
- Forms, modals and the checklist all reflow; the layout is verified from
  **320px** up to large desktops. Modals dock to the bottom on phones.

### Theming (dark mode)

`darkMode: "class"` with a `ThemeProvider`. An inline script in
[index.html](index.html) applies the persisted/system theme **before paint** to
avoid a flash of the wrong theme. Preference persists to `localStorage`.

### Resilience & feedback

- **ErrorBoundary** wraps the app for render-time crashes.
- Every async screen has explicit **loading (skeleton)**, **empty**, and
  **error (retry)** states.
- **Toasts** (`useToast`) confirm create/delete/save and surface API errors via
  a single `getErrorMessage` normalizer.
- **Confirmation modal** guards deletes.

---

## Nice-to-haves implemented

Responsive design · Dark mode toggle · Search releases · Sort by date ·
Confirmation modal · Toast notifications · Animations · Skeleton loading ·
Empty-state illustrations · Optimistic updates · Error boundary.
