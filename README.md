# Arrowstack Project 2 — Employee Service Request System

A full-stack internal service portal for employees to raise IT, HR and Facilities requests, track status and SLAs, while support agents/admins assign and resolve requests.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT + bcrypt
- UI: CSS
- Deployment: Docker Compose

## Roles
- **Employee:** create requests, view their own requests, add comments.
- **Support:** view all requests, update status/priority/category, assign requests, add comments.
- **Admin:** all support permissions plus user/summary visibility.

## Prerequisites
Install Node.js 20+, Docker Desktop, and Git. Start Docker Desktop before running the database.

## Quick start (Windows PowerShell or CMD)
1. Extract this ZIP and open the project folder in VS Code.
2. Start PostgreSQL:
   ```bash
   docker compose up -d db
   ```
3. Backend:
   ```bash
   cd server
   copy .env.example .env
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```
   Backend: http://localhost:5000
4. Frontend (open a second terminal from project root):
   ```bash
   cd client
   copy .env.example .env
   npm install
   npm run dev
   ```
   Frontend: http://localhost:5173

## Demo accounts
All seeded demo accounts use password `Demo@123`.
- Admin: `admin@arrowstack.demo`
- Support: `support@arrowstack.demo`
- Employee: `employee@arrowstack.demo`

## Main workflow
1. Sign in as Employee and create an IT, HR or Facilities request.
2. Add a description and choose a priority.
3. View the request in My Requests and add a comment.
4. Sign in as Support to assign the request and update status.
5. Sign in as Admin to view the dashboard and activity history.

## Useful commands
```bash
# backend
cd server
npm run dev
npm run db:migrate
npm run db:seed

# frontend
cd client
npm run dev

# stop PostgreSQL
docker compose down
```

## Notes
- This is a portfolio/demo application. It uses simulated SLA targets and sample accounts.
- Do not use real employee personal data in the demo.
- JWT secret and database credentials are development defaults; replace them before deployment.
- `docs/API.md` documents the API and `docs/TESTING.md` contains a manual acceptance checklist.
