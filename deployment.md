# Production Deployment Guide (Hostinger Managed Node.js)

This guide provides instructions for deploying the Academic Journal Platform (AJP) to **Hostinger Managed Node.js Hosting** (hPanel) or Hostinger VPS.

---

## 1. System Requirements & Prerequisites

- **Node.js**: v18.x, v20.x, or v22.x (Recommended: Node.js 20 LTS)
- **Hostinger**: Feature "Node.js" enabled in hPanel
- **MySQL Database**: Hostinger MySQL 8+ created via hPanel Databases
- **File Storage**: Local filesystem `/uploads` managed via `StorageAdapter`

---

## 2. Required Environment Variables

Configure these variables inside Hostinger hPanel Node.js environment controls or `.env`:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Application runtime environment | `production` |
| `PORT` | Local runtime port (assigned by Hostinger) | `3000` |
| `DB_HOST` | MySQL Server Host | `127.0.0.1` |
| `DB_PORT` | MySQL Server Port | `3306` |
| `DB_NAME` | MySQL Database Name | `u123456789_academic` |
| `DB_USER` | MySQL Database User | `u123456789_academic` |
| `DB_PASSWORD` | MySQL Database Password | `your_secure_password` |
| `JWT_SECRET` | Secret for signing JWT authentication tokens | `64+ char random string` |
| `STORAGE_BASE_DIR` | Base storage folder for uploaded files | `./uploads` |
| `GEMINI_API_KEY` | Google Gemini API Key (optional for AI assistant) | `AIzaSy...` |

---

## 3. Build & Deployment Pipeline

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Application Bundle
```bash
npm run build
```
*Outputs:*
- `dist/` containing compiled client assets (`dist/index.html`, etc.)
- `dist/server.cjs` (compiled self-contained CommonJS backend bundle)

### Step 3: Verify Local Production Start
```bash
npm start
```

---

## 4. Hostinger App Startup Configuration

In Hostinger hPanel -> Node.js:
- **Application Startup File**: `dist/server.cjs`
- **Application Root**: `/` (or directory where repository is placed)
- **Node.js version**: `20.x` or `22.x`
