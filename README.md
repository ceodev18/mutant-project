# Mutant Detector

This is a fullstack TypeScript project to analyze DNA sequences and determine if they belong to a mutant. It includes:
- A **NestJS** backend with PostgreSQL and Redis.
- A **React + Material UI** frontend.

---

## Tech Stack

- **Backend:** NestJS, TypeORM, PostgreSQL, Redis, class-validator
- **Frontend:** React, Vite, TypeScript, Material UI
- **DevOps:** Docker, Docker Compose

---

## Run with Docker Compose

```bash
docker-compose up --build
```

This will only:
- Start a PostgreSQL database
- Start a Redis instance

---

## Backend Setup

```bash
cd mutant-backend
cp .env.example .env
pnpm install
pnpm migration:run
pnpm start:dev
```

`.env` should include:

```env
DB_USER=admin
DB_PASSWORD=secret
DB_HOST=localhost
DB_PORT=5433
DB_NAME=mutants
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL=postgres://admin:secret@localhost:5432/mutants
```
---

## Coverage

```bash
cd mutant-backend
pnpm test:cov
```
The minimun acceptance criteria is 80%

---

## Frontend Setup

```bash
cd mutant-frontend
pnpm install
pnpm dev
```

---

## 🔬 API Endpoints

- `POST /api/v1/mutant`: analyze a DNA sequence
- `GET /api/v1/mutant/stats`: get detection stats
- `GET /api/docs`: Swagger UI

---

## Example Input

```json
["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
```

---

## Goal

This project is part of a coding challenge to detect whether a DNA belongs to a mutant by analyzing patterns horizontally, vertically, or diagonally.

---