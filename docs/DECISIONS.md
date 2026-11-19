# Decision log

| Decision | Rationale |
|---|---|
| React + Vite | Simple development server and component-based UI |
| Express REST API | Clear separation of client and server |
| PostgreSQL | Relational integrity for users, requests and comments |
| JWT | Stateless API authentication for the demo |
| SLA stored as due_at | Makes overdue requests queryable |
| Seeded demo accounts | Allows reviewers to reproduce role-specific workflows |

## Known limitations
- No password reset, email notifications or attachment uploads.
- Demo SLA values are fixed assumptions.
- No automated test suite is bundled; see manual acceptance checklist.
- Before real deployment, add rate limiting, stronger secrets, HTTPS, audit retention policy, backups and automated tests.
