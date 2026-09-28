# Nexura AI — Frontend SaaS Application

Modern dark-theme SaaS interface for **Nexura AI**, built with **React, TypeScript, Vite, Tailwind CSS, and Lucide React**.

## Key Pages
- **Landing Page (`/`)**: Value proposition, 10-step autonomous workflow breakdown, problem statement, and demo entry points.
- **Customer Chat (`/chat`)**: Real-time AI chat stream with autonomous complaint intelligence, inline ticket summary cards, and quick demo scenarios.
- **Ticket Detail Page (`/ticket/:id`)**: Comprehensive complaint dossier, audit timeline, status management, human escalation, and CSAT feedback rating.
- **Customer Portal (`/dashboard`)**: Customer view of all reported tickets, active statuses, and quick issue reporting.
- **Support Cockpit (`/agent`)**: Operations dashboard for human support specialists with KPI metrics, search, category/status filters, and inspection slide-over drawer.

## Running Frontend
```bash
npm install
npm run dev
```
Runs at `http://localhost:5173`.
All `/api` calls are automatically proxied to `http://localhost:5000`.
