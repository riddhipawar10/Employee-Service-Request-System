# REST API

Base URL: `http://localhost:5000/api`

Send `Authorization: Bearer <JWT>` for protected endpoints.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Authenticate and receive JWT |
| GET | `/health` | Public | API/database health (root path is `/api/health`) |
| GET | `/requests` | Authenticated | List own requests (employee) or all (staff) |
| POST | `/requests` | Employee/staff | Create a request |
| PATCH | `/requests/:id` | Support/Admin | Update status, priority or assignee |
| GET | `/requests/:id/comments` | Authenticated | List request comments |
| POST | `/requests/:id/comments` | Authenticated | Add a comment |
| GET | `/dashboard/summary` | Support/Admin | Request and overdue counts |
| GET | `/dashboard/activity` | Support/Admin | Latest activity events |
| GET | `/dashboard/agents` | Support/Admin | Support/admin assignees |

## Create request body
```json
{
  "title": "Laptop VPN is not connecting",
  "description": "VPN disconnects after sign-in.",
  "category": "IT",
  "priority": "High"
}
```
Categories: `IT`, `HR`, `Facilities`. Priorities: `Low`, `Medium`, `High`, `Urgent`.
