# ERP Lead Management Module

An enterprise-grade ERP Lead Management Dashboard built using React, Vite, and Tailwind CSS. It features a complete responsive UI for managing customer leads, integrated with a mock REST API via `json-server`.

## Features

- **Lead Dashboard:** Responsive table with leads overview.
- **Search & Filters:** Real-time search (debounced) and advanced filtering by Status, Assigned Employee, and Date Range.
- **Pagination:** Server-side pagination via the mock REST API.
- **Lead Details:** Dedicated view for comprehensive lead information.
- **Notes Management:** Ability to add, edit, and delete notes for each lead.
- **Lead Edit/Creation:** Validated forms using `react-hook-form` and `zod`.
- **Mock REST API:** Fully functional fake backend using `json-server`.

## Tech Stack

- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **API Fetching:** Fetch API with Custom Hooks
- **Mock Backend:** json-server
- **Notifications:** react-hot-toast

## Project Structure

```
src/
├── api/             # API client wrapper
├── components/      # Reusable UI components
│   ├── common/      # Badge, Button, Input, Card
│   ├── layout/      # Sidebar, Header, Main Layout
│   └── table/       # Data table, Pagination
├── hooks/           # Custom hooks (useLeads, useLead, useDebounce)
├── pages/           # Route views (Dashboard, Leads, Details, Edit)
├── App.jsx          # Router configuration
└── main.jsx         # Application entry point
```

## Setup & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Mock Data (Optional, already provided):**
   ```bash
   node scripts/generateMockData.js
   ```

3. **Start Development Server (UI + Mock API):**
   ```bash
   npm run dev
   ```

This will concurrently run the Vite React app (usually on http://localhost:5173) and the `json-server` mock backend on http://localhost:5000.

## Assumptions Made

- Leads dataset operates completely locally using `json-server`, saving data to `db.json`.
- Authentication is mocked (current user is assumed).
- Lead creation creates a random UUID and adds a new record to the local JSON file.
- The UI follows an enterprise dashboard design language utilizing simple slate grays, clean borders, and blue primary colors similar to standard CRM systems.
