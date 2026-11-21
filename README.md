# CareerChain

CareerChain is a full-stack platform for DIU students, alumni, and administrators. It provides role-based profiles, a community feed, job matching, mentorship, messaging, and career guidance.

## What it includes

- Role-based student, alumni, and admin accounts.
- A shared feed for updates, success stories, images, comments, replies, and reactions.
- Job listings, profile-to-job matching, resume comparison, and alumni referrals.
- Alumni discovery, mentorship, direct messages, career articles, and events.
- A local career assistant and resume builder; optional external AI services need their own configuration.

The project has a React/Vite frontend and a FastAPI backend. Most application data is stored in SQLite for local development; MySQL can be configured for a deployment.

## Requirements

- Python 3.9 or newer
- Node.js 18 or newer and npm
- Git

## Run locally

### Backend

From the repository root:

```bash
cd careerchain/backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Optional; SQLite fallback works without MySQL
python seed.py                   # Seeds demo data only when the database has no users
uvicorn app.main:app --reload --port 8000
```

The API is at `http://localhost:8000`; interactive API documentation is at `http://localhost:8000/docs`. By default, the backend tries MySQL and falls back to `careerchain/backend/careerchain.db` when MySQL is unavailable.

`seed.py` creates demo users and content only in an empty database. It skips seeding if users already exist, to avoid deleting or replacing existing data.

### Frontend

In another terminal:

```bash
cd careerchain/frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The default API URL is `http://localhost:8000/api/v1`; set `VITE_API_BASE_URL` in `careerchain/frontend/.env` only if the backend uses another URL.

## Demo accounts

Run `python seed.py` from `careerchain/backend` first if using a new, empty database. Then sign in with one of these local demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@diu.edu.bd` | `Admin123!` |
| Student | `student@diu.edu.bd` | `Student123!` |
| Alumni | `alumni@diu.edu.bd` | `Alumni123!` |

These are public development credentials. Use them only on a local demo database; change or disable them before deployment. For personal accounts, use the email and password supplied during registration. Public registration supports student and alumni accounts; it does not create administrators.

## Troubleshooting sign-in

1. Make sure both backend and frontend servers are running in separate terminals.
2. Use the exact demo email above; the old `@careerchain.local` demo addresses are not the seeded accounts.
3. If this is a fresh database, run the seed command once before signing in. The seeder intentionally does not replace data in a non-empty database.
4. On successful sign-in, the app opens the dashboard feed. If the feed fails, check the backend terminal for an API error; a feed loading error does not necessarily mean the password was rejected.
5. To verify the API independently, open `http://localhost:8000/docs` and check `POST /api/v1/auth/login`. A successful response includes an access token.

## Tests

```bash
cd careerchain/backend
source .venv/bin/activate        # Windows: .venv\Scripts\activate
python -m pytest tests/ -v
```

## Configuration and data

- Backend settings: `careerchain/backend/.env.example`.
- Frontend API setting: `careerchain/frontend/.env.example`.
- Registration requires a DIU ID or a `@diu.edu.bd` email address.
- The SQLite database and uploaded media are local development data. Use a production database and durable media storage before deployment.

Without `SECRET_KEY`, development generates a temporary signing key each time the backend starts, so existing sessions must sign in again after a restart. To keep sessions stable, generate a key with `python3 -c 'import secrets; print(secrets.token_urlsafe(48))'` and set `SECRET_KEY=<generated-value>` in `careerchain/backend/.env`. Use a separate, private key for each deployment; do not commit `.env`.

## Project layout

- `careerchain/backend/app/` — FastAPI routes, authentication, database models, and AI services.
- `careerchain/backend/tests/` — backend API and behavior tests.
- `careerchain/frontend/src/` — React application, pages, components, and API client.
- `careerchain/docs/` — API, database, architecture, and AI reference documents.
