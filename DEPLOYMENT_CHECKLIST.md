# Deployment Checklist for Hostinger Managed Node.js

Use this checklist before and during deployment to Hostinger Managed Node.js or Hostinger VPS environments.

---

## Pre-Deployment Verification

- [ ] Hostinger MySQL database and user created in hPanel.
- [ ] Database credentials noted (host, port, database name, user, password).
- [ ] Environment variables verified in Hostinger hPanel Node.js App interface or `.env`:
  - `NODE_ENV` = `production`
  - `PORT` (assigned automatically by Hostinger)
  - `DB_HOST` (e.g. `127.0.0.1`)
  - `DB_PORT` (`3306`)
  - `DB_NAME` (e.g. `u123456789_academic`)
  - `DB_USER` (e.g. `u123456789_academic`)
  - `DB_PASSWORD`
  - `JWT_SECRET`
  - `STORAGE_BASE_DIR` (optional, defaults to `./uploads`)

---

## Deployment Steps

- [ ] Connect repository to Hostinger Git or upload files via SSH/FTP.
- [ ] Execute `npm install` in Hostinger terminal/SSH.
- [ ] Execute `npm run build` to generate `dist/` and `dist/server.cjs`.
- [ ] Verify entrypoint is set to `dist/server.cjs` in Hostinger hPanel.
- [ ] Start or restart Node.js application in Hostinger dashboard.

---

## Post-Deployment Verification

- [ ] Test API Health endpoint: GET `/api/health` -> returns `{ "status": "ok", "database": "connected", ... }`.
- [ ] Test Auth Registration & Login -> returns user authentication session with JWT token.
- [ ] Test Article PDF Upload: POST `/api/journals/{journalId}/articles/{articleId}/pdf`.
- [ ] Test PDF Download: GET `/api/journals/{journalId}/articles/{articleId}/pdf` -> returns PDF stream.
- [ ] Test Unmatched API Route: GET `/api/invalid-route` -> returns JSON 404 error (not HTML).
- [ ] Verify client-side React routes refresh properly without 404 errors.
