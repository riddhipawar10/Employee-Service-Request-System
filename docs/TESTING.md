# Manual test checklist

## Authentication and authorization
- [ ] Valid employee login succeeds.
- [ ] Invalid password returns an error.
- [ ] Employee cannot access support dashboard endpoints.
- [ ] Support/admin can access the dashboard.

## Employee workflow
- [ ] Employee creates a request with a title, description, category and priority.
- [ ] Empty title/description is rejected.
- [ ] Employee sees only their own requests.
- [ ] Employee can view comments and add a comment.
- [ ] Employee cannot update request status.

## Support workflow
- [ ] Support sees all requests.
- [ ] Support changes a request status.
- [ ] Support assigns a request to an available agent.
- [ ] Support can view activity records.
- [ ] Invalid status values are rejected.

## SLA and reliability
- [ ] Urgent due date is 4 hours from creation.
- [ ] High due date is 8 hours from creation.
- [ ] Medium due date is 24 hours from creation.
- [ ] Low due date is 72 hours from creation.
- [ ] `/api/health` reports database connected when PostgreSQL is running.
