# GramCo — Government Scheme Discovery Platform

AI-powered platform that helps Indian citizens discover government schemes they qualify for. Built with a **FastAPI** backend and a **React + Vite + Tailwind CSS** frontend, powered by **Groq LLM** (`llama-3.3-70b-versatile`) for eligibility reasoning.

---

## Project Structure

```
GramCo/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app, startup, router registration
│   │   ├── config.py          # Pydantic Settings (reads .env)
│   │   ├── database.py        # SQLAlchemy engine + session factory
│   │   ├── models.py          # ORM table definitions
│   │   ├── schemas.py         # Pydantic request / response models
│   │   ├── crud.py            # Database helpers + JSON seeder
│   │   ├── data/
│   │   │   ├── schemes.json   # 20 pre-loaded Indian government schemes
│   │   │   └── situations.json# 15 real-life situations with category mappings
│   │   ├── routes/
│   │   │   ├── scheme_routes.py
│   │   │   ├── user_routes.py
│   │   │   └── situation_routes.py
│   │   └── services/
│   │       ├── groq_service.py       # Groq LLM API integration
│   │       └── eligibility_engine.py # Pre-filter + AI orchestration
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/client.js          # Axios API client
    │   ├── components/            # Navbar, Footer, SchemeCard, etc.
    │   ├── pages/                 # Home, BrowseSchemes, SchemeDetail,
    │   │                          # SituationSearch, EligibilityCheck
    │   └── utils/categoryConfig.js
    ├── index.html
    ├── vite.config.js             # Dev proxy: /api → localhost:8000
    └── package.json
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| Groq API key | [console.groq.com](https://console.groq.com) |

> **No database installation needed.** The app uses SQLite — a local file (`gramco.db`) that is created automatically on first run.

---

## Setup & Run

### 1. Set your Groq API key

Open `backend/.env` and replace the placeholder with your real key:

```
GROQ_API_KEY=your_actual_key_from_console_groq_com
```

Get a free key at [console.groq.com](https://console.groq.com).  
Everything else in `.env` is pre-configured and ready to go.

### 2. Install dependencies

```bash
# From the repo root (GramCo/)
npm install                        # concurrently (for single-command startup)
pip install -r backend/requirements.txt
```

---

## Running the App

From the **repo root** (`GramCo/`):

```bash
npm run dev
```

That's it. This starts both:
- **Backend** → http://localhost:8000  (API, auto-reloads on save)
- **Frontend** → http://localhost:5173

On first run, the backend automatically creates `gramco.db` and seeds it with 20 government schemes. No database setup required.

Interactive API docs: http://localhost:8000/docs

---

### Or start separately

```
Terminal 1 → backend:   cd backend  && python -m uvicorn app.main:app --reload --port 8000
Terminal 2 → frontend:  cd frontend && npm run dev
```

---

## Troubleshooting

### AI check returns empty results
Make sure `GROQ_API_KEY` in `backend/.env` is set to a valid key from [console.groq.com](https://console.groq.com).

### Frontend shows "Network Error"
The backend is not running. Start it with `npm run dev` from the project root.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/schemes` | List all schemes (paginated) |
| `GET` | `/api/schemes/{id}` | Scheme detail by ID |
| `GET` | `/api/situation-search/all` | List all supported life situations |
| `POST` | `/api/situation-search` | Schemes matching a life situation |
| `POST` | `/api/user-profile` | Submit and persist a user profile |
| `POST` | `/api/check-eligibility` | **AI eligibility check** (core endpoint) |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Core Endpoint: `/api/check-eligibility`

### Request

```json
POST /api/check-eligibility
{
  "user_profile": {
    "age": 30,
    "income": 180000,
    "occupation": "farmer",
    "location": "Tamil Nadu"
  },
  "situation": "crop loss"
}
```

### Response

```json
{
  "user_profile": { "age": 30, "income": 180000, "occupation": "farmer", "location": "tamil nadu" },
  "situation": "crop loss",
  "total_recommended": 3,
  "recommended_schemes": [
    {
      "scheme_id": 1,
      "scheme_name": "PM Kisan Samman Nidhi (PM-KISAN)",
      "category": "Agriculture",
      "benefits": [
        "₹6,000 per year financial assistance in 3 instalments",
        "Direct benefit transfer (DBT) to bank account"
      ],
      "official_link": "https://pmkisan.gov.in",
      "required_documents": ["Aadhaar Card", "Bank Account Passbook", "Land Ownership / Khasra-Khatauni records"],
      "application_centers": ["Common Service Centre (CSC)", "Local Patwari / Revenue Officer"],
      "reason": "You are a farmer and your annual income of ₹1,80,000 is within the ₹2,00,000 eligibility limit for this scheme."
    }
  ],
  "ai_summary": "Based on your profile as a Tamil Nadu farmer facing crop loss, you are eligible for 3 key schemes that provide immediate financial and insurance relief."
}
```

---

## AI Pipeline

```
POST /api/check-eligibility
        │
        ▼
Save UserProfile → DB
        │
        ▼
Load all Schemes from DB
        │
        ▼
Pre-filter (income / age / occupation / situation tags)
        │
        ▼
Send filtered schemes + user profile → Groq LLM
        │
        ▼
LLM reasons over eligibility → returns JSON
        │
        ▼
Merge AI picks with full scheme data
        │
        ▼
Persist EligibilityResult → DB
        │
        ▼
Return EligibilityResponse to client
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/gramco` | PostgreSQL connection string |
| `GROQ_API_KEY` | _(required)_ | Your Groq API key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Groq model to use |
| `DEBUG` | `false` | Enable debug logging |
| `ALLOWED_ORIGINS` | `["http://localhost:3000","http://localhost:5173"]` | CORS allowed origins |
