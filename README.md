# CampusSplit 💜

A working campus expense-splitting web application with a Node.js backend, responsive browser frontend, persistent JSON database, secure password hashing, and graph-based debt settlement recommendations.

## Quick start

Requirements: **Node.js 20+**. No npm install, Docker, MySQL, or cloud account needed.

```bash
npm start
```

Open **http://localhost:3000**. Create an account, create a group, and add your friends by their registered email addresses.

## Features

- Sign up / sign in (scrypt password hashing, bearer sessions)
- Create expense groups and add registered friends
- Add expenses, select payer, participants, and category
- Equal, exact amount, and percentage splits
- Automatically calculate net balances
- Graph-based greedy debt settlement optimization (sorting and two pointers)
- Record payments and see settlement history
- Category-wise spending analytics
- Export expenses and payments to CSV
- Responsive dashboard, group views, and activity navigation
- Input validation and group membership authorization
- Persistent data saved to `server/data.json` (created automatically)
- Automated tests: `npm test`

## Algorithm

For each group, initialize every member's net balance to zero. For each expense, credit the payer by the amount and debit each participant by their share. For each recorded payment, credit the sender and debit the recipient. Sort debtors and creditors by their outstanding amounts; match them greedily with two pointers, transferring the minimum of each pair's remaining balance. Runtime: **O(E×S + M log M)** in the current implementation, where E is expenses, S is average split participants, and M is group members; the optimization itself is **O(M log M)**. Greedy reduces transfers, but does **not** always find the globally minimum number of transactions.

## Project layout

```
public/              Browser UI (HTML, CSS, JS)
server/index.js       HTTP server, REST API, authentication, persistence
server/logic.js       Split calculator, balances, settlement optimizer
tests/logic.test.js   Unit tests
```

## API

- `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/me`
- `GET/POST /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups/:id/members`
- `POST /api/groups/:id/expenses`
- `DELETE /api/groups/:id/expenses/:expenseId`
- `POST /api/groups/:id/settlements`
- `GET /api/groups/:id/export`

Send `Authorization: Bearer <token>` for authenticated endpoints.

## Important notes

This is a **fully runnable local MVP** built without external packages. It uses a JSON file rather than MySQL, and a vanilla JavaScript frontend rather than React/Spring Boot, so it starts immediately. For multi-server production use, migrate persistence to PostgreSQL/MySQL, use HTTPS and secure cookie sessions, add rate limiting, audit logs, backups, and transactional database writes. Invitees must register first. Settlements are self-reported, not payment gateway transactions.
