# Production Audit & Verification Checklist

This document details the production readiness audit for the Academic Journal Platform (AJP).

---

## 1. Environment & Build Integrity

- [x] **npm install**: Restores all node_modules dependencies deterministically.
- [x] **npm run build**: Compiles client SPA to `dist/` and server code to `dist/server.cjs` using esbuild.
- [x] **npm start**: Launches `node dist/server.cjs` cleanly using `process.env.PORT` bound to `0.0.0.0`.
- [x] **Hostinger Managed Node.js**: Entrypoint configured as `dist/server.cjs` for hPanel Node.js.
- [x] **API Route Isolation**: `/api/*` endpoints strictly return JSON and bypass SPA HTML rewrite fallback.

---

## 2. Database & Data Persistence

- [x] **MySQL CRUD**: All entities (journals, issues, articles, users, submissions, news, settings) operate through MySQL via `mysql2/promise`.
- [x] **No In-Memory Fallbacks in Production**: Database is the single source of truth when `NODE_ENV=production`.
- [x] **Connection Pooling & Transactions**: Managed connection pool with prepared statements and query validation.
- [x] **Data Persistence Across Restarts**: Verified that data set in MySQL remains intact after application restarts.

---

## 3. Authentication & Security

- [x] **Authentication Engine**: Express authentication with bcrypt password hashing and JWT tokens.
- [x] **HTTP-Only Cookies & RBAC**: Role-based access control with secure cookie handling.
- [x] **JSON API Error Responses**: All API endpoints return `{ "success": false, "error": "..." }` or clean JSON objects—never unexpected HTML error pages.

---

## 4. Storage & File Management

- [x] **StorageAdapter Integration**: Local file storage segregated into `/uploads/public` and `/uploads/private`.
- [x] **Public & Private Isolation**: Confidential submissions and review drafts protected behind authenticated endpoints.
- [x] **Storage CRUD Operations**: PDF Upload, Replace, Delete, and Stream supported.
- [x] **Validation Rules**: Strictly enforces PDF MIME type (`application/pdf`), maximum 25MB file size, and path traversal prevention.

---

## 5. Observability & Centralized Logging

- [x] **Startup Logging**: Displays environment, port, database engine, and storage adapter upon boot.
- [x] **Request Logging**: Express middleware logs method, URL, status code, and execution duration.
- [x] **Database & Storage Logging**: Standardized console logs for `[Database GET]`, `[Database POST]`, `[Database PUT]`, `[Database DELETE]`, `[Storage SAVE]`, `[Storage DELETE]`, and `[Auth LOGIN]`.
- [x] **Unhandled Exceptions**: Global handlers for `uncaughtException` and `unhandledRejection`.
- [x] **Graceful Shutdown**: Traps `SIGTERM` and `SIGINT` to close the HTTP server cleanly before process exit.
