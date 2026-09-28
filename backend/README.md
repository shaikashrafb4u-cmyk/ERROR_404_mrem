# Nexura AI — Backend API & Complaint Intelligence Service

Backend architecture for **Nexura AI**, built with **Node.js, Express, TypeScript, and MongoDB/Mongoose**.

## Architecture Highlights
- **Autonomous Complaint Intelligence**: Analyzes natural language messages, categorizes intent across 10 complaint types, calculates urgency (Low/Medium/High/Critical), extracts transaction/order numbers, and suggests remediation actions.
- **Auto-Ticket Generation**: Issues unique, formatted ticket identifiers (e.g., `CS-2026-10482`) and stores detailed complaint dossiers.
- **Smart Escalation**: Escalates urgent complaints (fraud, critical deductions, human request) to level-2 support desks automatically.
- **Fail-Safe Zero-Config Mode**: If MongoDB is unavailable or no AI key is provided, the server gracefully boots into high-speed in-memory demo mode with pre-seeded realistic records.

## API Endpoints
- `POST /api/chat` - Processes customer input, runs complaint intelligence, and auto-generates tickets.
- `GET /api/tickets` - Lists all tickets with filters (`category`, `priority`, `status`, `search`).
- `GET /api/tickets/:id` - Retrieves a single ticket dossier and timeline.
- `PATCH /api/tickets/:id` - Updates ticket status, department, priority, and appends audit timeline notes.
- `POST /api/tickets/:id/escalate` - Escalates a ticket to human specialist.
- `POST /api/feedback` - Records customer CSAT rating (1-5 stars) and comments.
- `GET /api/dashboard/stats` - Returns aggregated KPI metrics for the support cockpit.
- `GET /api/health` - Service health status.

## Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nexura_support
GEMINI_API_KEY=
FORCE_DEMO_MODE=false
```

## Running Backend
```bash
npm install
npm run dev
```
Server runs on `http://localhost:5000`.
