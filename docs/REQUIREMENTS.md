# Requirements and acceptance criteria

## Stakeholders
- Employee: raises and tracks an internal service request.
- Support agent: triages, assigns and resolves requests.
- Administrator: monitors queue health and activity.

## Scope
Included: authentication, role-based permissions, IT/HR/Facilities categories, request creation, status updates, assignment, comments, SLA due dates, dashboard summary and activity logs.

Out of scope for this MVP: email/SMS notifications, file attachments, external HRIS integration, automated escalation and production SSO.

## Success measures
- A valid request can be submitted and persisted.
- Employees can only view their own requests.
- Support staff can update and assign requests.
- Every create/update/comment action creates an activity record where implemented.
- A mentor can reproduce the application using the README.

## SLA assumptions
Demo targets: Urgent 4h, High 8h, Medium 24h, Low 72h. These are simulated targets, not a contractual service commitment.
