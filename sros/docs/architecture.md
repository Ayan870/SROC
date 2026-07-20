# SROS System Architecture - Phase 1

This document describes the high-level architecture, module organization, database connections, and operational commands for **SROS (Smart Repository Operating System)** after Phase 1 setup.

## Architecture Diagram

```mermaid
graph TD
    User([User Browser]) <--> |HTTP / JSON| Frontend[Next.js Web Frontend]
    User <--> |HTTP / JSON| Backend[FastAPI Backend Server]
    Frontend <--> |API Requests| Backend
    Backend <--> |SQLAlchemy Asyncpg| DB[(PostgreSQL Database)]
```

---

## Directory Organization

The project contains the following directory structures:

- `/frontend`: Next.js 15 application utilizing TypeScript, App Router, and Vanilla CSS (no Tailwind).
- `/backend`: FastAPI Python application with structured config parsing and database connection capabilities.
- `/database`: Stores database migrations, initial SQL seeds, and schemas.
- `/agents`: Modular agents directory for LLM and LangGraph orchestrations (future phases).
- `/memory`: System modules managing conversation memory structures and contextual indexing (future phases).
- `/workflows`: Module defining graph workflows and pipeline logic (future phases).
- `/parsers`: Extractors and document parsers (PDF, OCR, statistical sets) (future phases).
- `/docker`: Houses base images and specific platform setups.
- `/docs`: Project documentations and guides.

---

## Technical Stack

| Layer | Technology |
| --- | --- |
| Frontend | React + Next.js (App Router, TypeScript, Vanilla CSS) |
| Backend API | FastAPI + Uvicorn (Python 3.12+) |
| Database Connection | SQLAlchemy 2.0 + Asyncpg (Async PostgreSQL) |
| Relational DB | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |

---

## Development Setup

### Environment Variables
Both backend and frontend apps share settings configured in the root `.env` file. You can template configurations using `.env.example`.

### Running Locally

#### 1. Start PostgreSQL
Ensure you have a running PostgreSQL instance locally. Update `.env` with your database credentials. By default:
```ini
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=sros_db
DATABASE_URL=postgresql+asyncpg://postgres:postgres_password@localhost:5432/sros_db
```

#### 2. Running FastAPI Backend
1. Initialize the Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Unix
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the application:
   ```bash
   uvicorn app.main:app --reload
   ```
The API docs will be accessible at `http://localhost:8000/docs`.

#### 3. Running Next.js Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
The site will be running at `http://localhost:3000`.

---

## Running with Docker Compose

To spin up the entire foundation stack (PostgreSQL, FastAPI, and Next.js) in containerized services:

1. Make sure Docker is running on your system.
2. Execute the build and start command from the project root:
   ```bash
   docker-compose up --build
   ```
3. Check the application interfaces:
   - Next.js Frontend: `http://localhost:3000`
   - FastAPI backend: `http://localhost:8000`
   - API interactive documentation: `http://localhost:8000/docs`
