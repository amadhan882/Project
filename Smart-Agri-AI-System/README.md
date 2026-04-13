# Smart Agriculture AI System

An end-to-end agriculture intelligence platform that helps users make better crop decisions with data-driven recommendations and yield forecasts.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?style=for-the-badge&logo=postgresql)

---

## Overview

Smart Agriculture AI System is a full-stack monorepo application that:

- recommends suitable crops based on soil and climate inputs,
- predicts expected yield per hectare and total output,
- stores historical predictions for analytics,
- presents insights through a modern, responsive dashboard.

The prediction flow evaluates 7 agronomic inputs:

- Nitrogen
- Phosphorus
- Potassium
- Temperature
- Humidity
- Rainfall
- Soil pH

---

## Key Features

- **Crop recommendation engine** with confidence score and alternatives
- **Yield prediction** with grade classification and monthly trend projection
- **Prediction history** persisted in PostgreSQL
- **Crop library** for supported crop insights
- **Export capabilities** including PDF and CSV
- **Interactive analytics UI** (charts, gauges, and responsive components)
- **OpenAPI-based contract workflow** with generated client and schema packages

---

## Architecture

This repository is organized as a **pnpm workspace monorepo**.

- `artifacts/agri-ai` – React + Vite frontend
- `artifacts/api-server` – Express API server
- `lib/api-spec` – OpenAPI contract
- `lib/api-client-react` – generated React API client
- `lib/api-zod` – generated Zod validators/types
- `lib/db` – Drizzle ORM database layer

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Radix UI
- TanStack React Query
- React Hook Form + Zod

### Backend

- Node.js
- Express 5
- TypeScript
- Drizzle ORM
- PostgreSQL
- Pino logging

### Tooling

- pnpm workspaces
- OpenAPI 3.1
- Orval code generation

---

## Getting Started

### Prerequisites

Install the following:

- **Node.js** 20+
- **pnpm** 9+
- **PostgreSQL**

### 1) Clone

```bash
git clone <your-repository-url>
cd Project/Smart-Agri-AI-System
```

### 2) Install dependencies

```bash
pnpm install
```

### 3) Configure environment

Create a `.env` file in the project root:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/agri_ai
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=agri_ai
SESSION_SECRET=replace-with-a-secure-random-value
```

### 4) Initialize database schema

```bash
pnpm --filter @workspace/db run push
```

### 5) (Optional) Regenerate API clients after spec changes

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Run the Application

### Development

Run each service in separate terminals.

**API server**

```bash
pnpm --filter @workspace/api-server run dev
```

**Web app**

```bash
pnpm --filter @workspace/agri-ai run dev
```

Then open: `http://localhost:5173`

### Production build

```bash
pnpm run build
pnpm --filter @workspace/api-server run start
```

---

## API Reference

Base path: `/api`

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/healthz` | Health check |
| `POST` | `/predict-crop` | Crop recommendation |
| `POST` | `/predict-yield` | Yield forecast |
| `GET` | `/prediction-history` | Recent prediction records |
| `GET` | `/crops` | Supported crop catalog |
| `GET` | `/crop-stats` | Aggregated prediction statistics |
| `GET` | `/model-accuracy` | Model accuracy summary |

---

## Project Structure

```text
Smart-Agri-AI-System/
├── artifacts/
│   ├── agri-ai/
│   └── api-server/
├── lib/
│   ├── api-spec/
│   ├── api-client-react/
│   ├── api-zod/
│   └── db/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

---

## License

MIT License.
