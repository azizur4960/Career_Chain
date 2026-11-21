# CareerChain Backend

FastAPI service powering role-based authentication, student profiles, alumni network, job management, community feeds, and local AI matching.

## Quickstart
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --reload --port 8000
```
Interactive documentation available at `http://localhost:8000/docs`.
