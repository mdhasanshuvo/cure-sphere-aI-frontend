# CureSphere AI Frontend

React + TypeScript SPA for the CureSphere AI platform. Ships multi-role dashboards (patient, doctor, admin), an AI doctor chat experience backed by the backend Gemini proxy, and supporting flows like symptom analysis, pharmacy finder, diagnostics, lab report tools, and blood bank browsing.

## Features
- Patient, Doctor, and Admin dashboards with KPI cards, charts, and task widgets
- AI Doctor chat (Gemini-backed) with symptom intake and structured recommendations
- Symptom Analyzer, Lab Report Analyzer, Diagnostic Center finder, and Pharmacy finder screens
- Doctor consultation listings and blood bank/donor browsing
- Mock authentication and profile persistence via `AuthContext` + `localStorage`
- Centralized API helpers in `src/services` for REST and Gemini calls

## Tech Stack
- React 18 + TypeScript
- Vite build tool
- Radix UI / shadcn components
- Recharts for data visualization
- CSS modules + global styles

## Environment Variables
See `.env.example` for a template.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL for the backend API (e.g., http://localhost:5001) |

## Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template and set the backend URL:
   ```bash
   cp .env.example .env
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173` by default.

## Build
```bash
npm run build
```
Outputs static assets to `dist/` for hosting behind any static server or CDN.

## Folder Structure
```
frontend/
├─ src/
│  ├─ components/          # Feature screens + UI library
│  │  └─ dashboards/       # Patient, Doctor, Admin, AIChat
│  ├─ context/             # AuthContext (mock auth)
│  ├─ services/            # API helpers (REST + Gemini proxy)
│  ├─ types/               # Shared TypeScript types
│  ├─ styles/              # Global styles
│  └─ App.tsx              # View routing via local state
├─ public/
├─ .env.example
├─ package.json
└─ README.md
```

## Security Considerations
- Do not store API keys in the frontend; backend handles Gemini secrets
- Auth is demo-only (stored in `localStorage`)—replace with real backend auth before production
- Keep `.env` out of version control; `VITE_API_BASE_URL` should point to HTTPS in production

## Deployment Notes
- Provide `VITE_API_BASE_URL` at build time so the frontend points to the deployed backend
- Serve the built `dist/` assets from a static host (Vercel/Netlify/S3+CloudFront/NGINX)

## Author
- mdhasanshuvo / CureSphere AI team
