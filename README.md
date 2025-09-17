# SmartFinance Dashboard (WIP)

A full-stack personal finance dashboard that visualizes spending and generates **AI insights** from your transactions.

- **Frontend:** React (Vite) + Recharts
- **Backend:** Node/Express (ESM) under `backend/src/app.js`
- **AI:** OpenAI (server-side only)
- **Status:** Early alpha – mock data, local dev only

---

## ✅ What’s Done (MVP)
- **Transactions UI:** Table view of mock transactions (date, description, amount, category).
- **Spending by Category:** Pie chart (Recharts) aggregating absolute amounts by category.
- **AI Insights:** Button posts transactions to `/api/ai-insights`; backend calls OpenAI and returns concise saving tips.
- **CORS + JSON API:** Clean JSON responses; dev-friendly CORS config.
- **Safe secrets:** `.env` ignored; API key stays server-side.

---

## 🧭 What’s Next (Roadmap)
### High Priority (Next)
- **Authentication**
  - Sign up / Login (JWT)
  - Password hashing (bcrypt)
  - Protected routes (only read/write own data)
- **Real Bank Data**
  - Connect a provider (based on region):
    - Plaid (US/CA) **or** Flinks (CA) / Teller / GoCardless Bank Accounts (ex-Nordigen)
  - Secure OAuth flow + token storage
  - Sync accounts & transactions; refresh jobs
- **Database + Models**
  - PostgreSQL or MongoDB
  - Users, Accounts, Transactions, Categories, Budgets
  - ORM (Prisma / Mongoose) & migrations
- **Import/Export**
  - CSV upload (fallback when no bank API)
  - CSV export of transactions & budgets

### Enhancements
- **AI Improvements**
  - Return **JSON array** from the insights endpoint (not free-text) for reliable UI bullets
  - Caching/throttling, model controls & cost guardrails
- **Budgeting & Analytics**
  - Budgets per category, monthly rollups, trend lines
  - Recurring transactions detection
- **UX/Polish**
  - Empty states, loading skeletons, toasts
  - Dark/light theme toggle
- **Quality**
  - Validation (zod / joi), error boundaries
  - Tests (Jest + Supertest) for API
  - CI (GitHub Actions): lint, test
- **Deploy**
  - Backend: Render/Fly/railway
  - Frontend: Netlify/Vercel
  - Environment config per environment

---

## Tech Stack

**Frontend**
- React (Vite)
- Recharts (Pie chart)
- CSS (custom, soft-sand palette)

**Backend**
- Node.js, Express (ESM)
- OpenAI SDK
- CORS, dotenv

---

## Project Structure
SmartFinance_Dashboard/
├─ backend/
│ ├─ src/
│ │ └─ app.js
│ ├─ .env # NOT committed (OPENAI_API_KEY, PORT)
│ └─ package.json
└─ frontend/
├─ src/
│ ├─ App.jsx
│ ├─ App.css
│ ├─ main.jsx
│ └─ index.css
└─ package.json

---

## 🚀 Run Locally (Quickstart)

### 1) Backend
```bash
cd backend
npm install

# Create backend/.env (do NOT commit):
# OPENAI_API_KEY=sk-...your key...
# PORT=5000

# Ensure backend/package.json has:
# {
#   "type": "module",
#   "main": "src/app.js",
#   "scripts": {
#     "dev": "nodemon --watch src --ext js --exec node src/app.js",
#     "start": "node src/app.js"
#   }
# }
```
### 2) **Frontend** (Terminal B)
```bash
cd frontend
npm install
npm run dev   # app on http://localhost:5173
```
