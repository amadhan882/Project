# 🌾 Smart Agriculture AI System

> An AI-powered crop recommendation and yield prediction platform built for precision agriculture — designed as an MCA Final Year Project.

![Smart Agriculture AI](https://img.shields.io/badge/AI-Agriculture-green?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?style=for-the-badge&logo=postgresql)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Changelog](#changelog)
- [License](#license)

---

## 🎯 Overview

The **Smart Agriculture AI System** is a full-stack web application that uses machine learning algorithms to:

- **Recommend the best crop** to grow based on soil and environmental conditions
- **Predict expected yield** in kg/ha and total kg for a given area
- **Show prediction history** with detailed logs and exportable reports
- **Browse a crop library** with 22 supported crops and agronomic data

The system analyzes 7 key parameters — Nitrogen, Phosphorus, Potassium (NPK), Temperature, Humidity, Rainfall, and Soil pH — and returns intelligent crop recommendations with confidence scores and yield forecasts.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 Crop Recommendation AI | Scores all 22 crops against your soil/climate inputs |
| 📊 Yield Prediction | Estimates yield per hectare and total output |
| 📸 Crop Images | Visual result cards with real crop photography |
| 📄 PDF Report Download | Export a full professional prediction report |
| 📥 CSV History Export | Download all prediction history as a spreadsheet |
| 🌓 Dark / Light Mode | Toggle between dark (default) and light themes |
| 📈 Interactive Charts | Radial gauge, bar chart, and line chart visualizations |
| 🌿 Crop Library | Browse 22 crops with season, pH, and water requirements |
| 📜 Prediction History | View and filter all past predictions |
| 📱 Responsive Design | Works on mobile and desktop |
| ✨ Smooth Animations | Framer Motion transitions throughout |
| 🧠 Model Metrics | Live accuracy dashboard (97% crop model accuracy) |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Recharts | Charts and data visualization |
| Radix UI | Accessible component primitives |
| React Hook Form + Zod | Form management and validation |
| React Query (TanStack) | Data fetching and caching |
| jsPDF + jspdf-autotable | PDF report generation |
| Wouter | Client-side routing |
| next-themes | Dark/light mode |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 24 | Runtime |
| Express 5 | REST API server |
| TypeScript | Type safety |
| Drizzle ORM | Database ORM |
| PostgreSQL | Database |
| Zod | Input validation |
| Pino | Structured logging |
| esbuild | Backend bundler |

### Architecture
| Pattern | Detail |
|---|---|
| Monorepo | pnpm workspaces |
| API Contract | OpenAPI 3.1 → Orval codegen |
| DB Schema | Drizzle ORM with push migrations |
| Type Safety | End-to-end TypeScript |

---

## 📁 Project Structure

```
smart-agri-ai/
├── artifacts/
│   ├── agri-ai/                    # React frontend
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx        # Landing page
│   │   │   │   ├── Dashboard.tsx   # Prediction dashboard
│   │   │   │   ├── History.tsx     # Prediction history
│   │   │   │   └── Crops.tsx       # Crop library
│   │   │   ├── components/
│   │   │   │   ├── layout/         # Navbar, Layout
│   │   │   │   ├── ui/             # Radix UI components
│   │   │   │   └── theme-provider.tsx
│   │   │   ├── lib/
│   │   │   │   ├── cropImages.ts   # Crop image/emoji mapping
│   │   │   │   ├── reportGenerator.ts  # PDF & CSV export
│   │   │   │   └── utils.ts
│   │   │   ├── hooks/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api-server/                 # Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── health.ts       # Health check
│       │   │   └── predictions.ts  # All AI prediction routes
│       │   ├── app.ts
│       │   └── index.ts
│       └── package.json
│
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml            # OpenAPI 3.1 contract
│   ├── api-client-react/           # Generated React Query hooks
│   ├── api-zod/                    # Generated Zod validators
│   └── db/
│       └── src/schema/
│           └── predictions.ts      # Drizzle table schema
│
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js** v20 or higher — [Download](https://nodejs.org/)
- **pnpm** v9 or higher — Install with `npm install -g pnpm`
- **PostgreSQL** — [Download](https://www.postgresql.org/download/) or use a cloud provider

---

### 1. Clone the Repository

```bash
git clone https://github.com/amadhan882/Smart-Agri-AI-System.git
cd Smart-Agri-AI-System
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all dependencies across the monorepo (frontend, backend, shared libraries).

### 3. Set Up Environment Variables

Create a `.env` file in the root or export variables directly:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/agri_ai
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=agri_ai

# Session
SESSION_SECRET=your-random-secret-key-here
```

> For Replit users: These are set automatically when you provision a database.

### 4. Set Up the Database

Create the database tables:

```bash
pnpm --filter @workspace/db run push
```

### 5. Generate API Types (Optional — already committed)

If you modify the OpenAPI spec, regenerate the hooks and validators:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## 🚀 Running the App

### Development Mode

Run the backend and frontend in separate terminals:

**Terminal 1 — Backend API:**
```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Frontend:**
```bash
pnpm --filter @workspace/agri-ai run dev
```

Then open `http://localhost:5173` in your browser.

### Build for Production

```bash
# Build everything
pnpm run build

# Start the API server
pnpm --filter @workspace/api-server run start
```

---

## 🔗 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/healthz` | Server health check |
| `POST` | `/api/predict-crop` | Get crop recommendation |
| `POST` | `/api/predict-yield` | Get yield forecast |
| `GET` | `/api/prediction-history` | List past predictions |
| `GET` | `/api/crops` | List all 22 supported crops |
| `GET` | `/api/crop-stats` | Aggregated statistics |
| `GET` | `/api/model-accuracy` | AI model accuracy metrics |

### POST `/api/predict-crop` — Request Body

```json
{
  "nitrogen": 80,
  "phosphorus": 45,
  "potassium": 40,
  "temperature": 27,
  "humidity": 82,
  "rainfall": 210,
  "ph": 6.2
}
```

### POST `/api/predict-crop` — Response

```json
{
  "crop": "rice",
  "confidence": 0.94,
  "alternatives": [
    { "crop": "jute", "confidence": 0.81 },
    { "crop": "coconut", "confidence": 0.76 }
  ],
  "reasoning": "Based on soil parameters...",
  "season": "Kharif"
}
```

---

## 🌱 Supported Crops

The system supports **22 crops** across all major categories:

| Category | Crops |
|---|---|
| Cereals | Rice, Maize |
| Pulses | Chickpea, Kidney Beans, Pigeon Peas, Moth Beans, Mung Bean, Black Gram, Lentil |
| Fruits | Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Pomegranate, Coconut |
| Cash Crops | Cotton, Jute, Coffee |

---

## 📸 Screenshots

| Page | Description |
|---|---|
| **Home** | Animated hero with "Data-Driven Yields. Smarter Farming." |
| **Dashboard** | Input sliders for NPK + environment, model accuracy gauges |
| **Results** | Crop image card, confidence bar, yield charts, download button |
| **History** | Prediction table with CSV export |
| **Crop Library** | Grid of 22 crops with agronomic details |

---

## 📄 Changelog

### v1.2.0 — Report & Image Features *(Latest)*
- **Added** Crop image banner in prediction result cards (22 real crop photos)
- **Added** PDF report download with full prediction details, charts summary, model metrics
- **Added** CSV export button on the History page
- **Added** Crop emoji fallback when image unavailable
- **Improved** Result card redesigned with image banner and "AI Recommended" badge

### v1.1.0 — Core AI Features
- **Added** `/predict-crop` endpoint — scores all 22 crops against 7 soil/climate parameters
- **Added** `/predict-yield` endpoint — estimates yield in kg/ha with seasonal trend
- **Added** `/prediction-history` endpoint — stores and retrieves all predictions from PostgreSQL
- **Added** `/crop-stats` endpoint — aggregated statistics for dashboard
- **Added** `/model-accuracy` endpoint — returns model performance metrics
- **Added** Prediction history saved to PostgreSQL on every yield prediction
- **Seeded** 12 sample historical predictions for immediate demo

### v1.0.0 — Initial Release
- **Built** Full React + Vite frontend with Tailwind CSS and Framer Motion
- **Built** Express 5 REST API backend with TypeScript
- **Built** Prediction Dashboard with input sliders for all 7 parameters
- **Built** Results section with radial gauge charts (97% accuracy), bar chart, line chart
- **Built** Prediction History page with stats overview
- **Built** Crop Library page with 22 crops and agronomic details
- **Built** Dark mode (default) + light mode toggle
- **Built** Fully responsive layout (mobile + desktop)
- **Built** Smooth Framer Motion animations throughout
- **Configured** OpenAPI 3.1 contract with Orval codegen
- **Configured** pnpm monorepo workspace
- **Configured** Drizzle ORM with PostgreSQL

---


## 📜 License

This project is for academic purposes. All rights reserved © 2025.
