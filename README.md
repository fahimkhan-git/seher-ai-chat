# Homesfy Chatbot Monorepo

Full-stack workspace for the embeddable Homesfy chat widget, REST API, and internal dashboard.

---

## Repository Structure

| Path | Description |
| --- | --- |
| `apps/api` | Express API for leads, widget configuration, chat transcripts, and event tracking (optional MongoDB support). |
| `apps/widget` | React widget compiled into a single embeddable bundle (`widget.js`). |
| `apps/dashboard` | React SPA for operations teams to review leads and tweak widget themes. |
| `local-microsite` | Static HTML harness used to preview the widget bundle locally. |

---

## Prerequisites

- **Node.js 20.x** (LTS) and npm 10.x  
- Optional: **MongoDB** (local or Atlas) if you plan to use the Mongo datastore instead of the JSON file store.

---

## Initial Setup

```bash
# Clone from GitHub
git clone https://github.com/fahimkhan-git/homesfy-chatbot.git
cd homesfy-chatbot

# Install workspace dependencies
npm install
```

Copy the provided environment templates and customise for your environment:

```bash
cp apps/api/env.example apps/api/.env
cp apps/widget/env.example apps/widget/.env
```

Key variables:

| Variable | Location | Purpose |
| --- | --- | --- |
| `API_PORT` | `apps/api/.env` | Port for the Express server (defaults to `4000`). |
| `ALLOWED_ORIGINS` | `apps/api/.env` | Comma-separated CORS whitelist for the API + Socket.IO. |
| `DATA_STORE` | `apps/api/.env` | `file` (default) or `mongo`. |
| `DATA_DIRECTORY` | `apps/api/.env` | Directory used when `DATA_STORE=file` (defaults to `./data`). |
| `MONGO_URI` | `apps/api/.env` | MongoDB URI when `DATA_STORE=mongo`. |
| `VITE_WIDGET_API_BASE_URL` | `apps/widget/.env` | Default API URL baked into the widget bundle. |
| `VITE_WIDGET_DEFAULT_PROJECT_ID` | `apps/widget/.env` | Optional fallback project id for auto-init. |

> The API falls back to the file datastore if Mongo credentials are absent. Corrupted JSON files are now quarantined automatically and replaced with a clean copy.

---

## Running Locally

Open three terminals (or background sessions) from the repository root.

### 1. API

```bash
npm --prefix apps/api run dev
```

- Reads environment from `apps/api/.env`.
- Serves REST endpoints at `http://localhost:4000` (by default).
- Stores data under `apps/api/data/` unless `DATA_DIRECTORY` points elsewhere.

### 2. Dashboard

```bash
npm --prefix apps/dashboard run dev
```

The dashboard will prompt for the API base URL on first load if `VITE_API_BASE_URL` is not set.

### 3. Widget Playground

```bash
npm --prefix apps/widget run dev
```

This exposes the widget bundle on `http://localhost:5001`.  
Use `local-microsite/index.html` as a quick harness (served from any static file server or IDE live server).

---

## Quality Checks

```bash
# Build widget bundle exactly as CI/CD does
npm run build:widget

# Lint / health check (add your own unit or integration tests here)
npm --prefix apps/api run lint   # if a linter is introduced
# npm test                        # hook in Jest/Playwright as needed
```

---

## Deployment Guide

### API

1. Provision MongoDB (optional) and set `DATA_STORE=mongo` + `MONGO_URI` in your production environment.  
   With file storage, ensure the `DATA_DIRECTORY` path is on durable storage.
2. **Vercel**: the platform file system is read-only, so you must supply a MongoDB Atlas (or similar) connection string. Set the following environment variables in the project:
   - `DATA_STORE=mongo`
   - `MONGO_URI=<your mongodb+srv:// URI>`
   - `ALLOWED_ORIGINS=https://dashboard-seven-brown-56-ten.vercel.app,https://widget-eight-ebon-chi.vercel.app` (add any domains that should call the API)
   The server now defaults to Mongo automatically when running on Vercel. Deployments without `MONGO_URI` will fail fast with a descriptive error.
3. **Migrating existing leads/events** (optional, one-time):
   - Ensure `MONGO_URI` in `apps/api/.env` points to the target cluster.
   - Run `npm run migrate:file-to-mongo` from the repo root to copy data from `apps/api/data/*.json` into MongoDB (skips documents already imported).
4. Deploy `apps/api` to your platform of choice:
   - **Vercel** – create a Node Serverless project pointing at `apps/api/package.json`.
   - **Render/Fly.io** – containerise or run as a Node service.
5. Configure environment variables in the hosting dashboard (mirror your `.env` file).

### Widget

1. The repo includes `vercel.json` so Vercel automatically runs `npm run build:widget`
   and serves `apps/widget/dist` for production deployments. Simply push to the
   production branch and the latest `widget.js` will be published at your Vercel domain.
2. To build locally or for other CDNs, run `npm run build:widget`; the production
   bundle drops into `apps/widget/dist/`.
3. Embed the snippet:
   ```html
   <script
     src="https://cdn.example.com/widget.js"
     data-project="default"
     data-api-base-url="https://api.example.com"
     data-microsite="nivasa-enchante"
     async
   ></script>
   ```
   The widget also respects `VITE_WIDGET_API_BASE_URL` baked at build time, and `window.HOMESFY_WIDGET_API_BASE_URL` if supplied globally.

### Dashboard

Deploy `apps/dashboard` as a static SPA (Vercel, Netlify, etc.). Point it at the same API by setting `VITE_API_BASE_URL` in that environment.
When deploying to Vercel, the included `vercel.json` ensures all routes rewrite to `index.html`, so deep links like `/analytics` work out of the box.
The settings page now lets you tailor every scripted widget response—welcome, follow-up, configuration prompt, inventory reassurance, phone prompt, and thank-you—without touching code.

---

## Recommended Workflow

1. **Branching** – create feature branches from `main`, open PRs, and rely on CI to lint/build the widget.
2. **Environments** – maintain separate `.env` files (or remote secrets) for local, staging, and production.
3. **Backups & Monitoring** – forward API logs to your log aggregator, enable uptime checks, and snapshot the data directory (or MongoDB) regularly.
4. **Testing** – add Jest/Playwright suites as you expand functionality; wire them into CI before merging to main.

---

## API Quick Reference

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/leads` | Persist a lead (`phone`, `bhkType`, `microsite`, `payload`). |
| `GET` | `/api/leads` | Retrieve leads (future work: pagination/filters). |
| `GET` / `POST` | `/api/widget-config/:projectId` | Read/update widget theming. |
| `POST` | `/api/events` | Record analytics events emitted by the widget. |
| `GET` | `/health` | Liveness probe used by deployment platforms. |

Socket.IO emits room-scoped updates keyed by `microsite` for realtime dashboards.

---

## Contributing

1. Fork or create a feature branch.
2. Run `npm install` + local services.
3. Make changes with lint/build clean.
4. Commit with descriptive messages and open a PR.
5. After review, merge to `main` → deploy staging → promote to production once smoke tests pass.

Happy shipping! 🚀
