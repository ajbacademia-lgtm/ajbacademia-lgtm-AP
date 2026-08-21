# Hostinger Managed Node.js Deployment Guide

This guide provides instructions for deploying the Academic Journal Platform (AJP) to **Hostinger Managed Node.js Hosting** (hPanel) or **Hostinger VPS**.

---

## 1. System Requirements & Architecture

- **Runtime**: Node.js v18.x, v20.x, or v22.x (Recommended: `20.x LTS`)
- **Hosting Environment**: Hostinger Web / Cloud / VPS Hosting with Managed Node.js (hPanel)
- **Backend Architecture**: Single bundled Express server (`dist/server.cjs`)
- **Frontend Architecture**: React 19 + Vite SPA compiled into `dist/`
- **Database Engine**: Hostinger MySQL 8+ via `mysql2/promise` with connection pooling & prepared statements
- **File Storage**: Segregated local filesystem storage via `StorageAdapter` (`/uploads/public` and `/uploads/private`)
- **Authentication**: Express + JWT + bcrypt password hashing + HTTP-only cookies + RBAC

---

## 2. Hostinger hPanel Configuration

### Step 1: Create MySQL Database in hPanel
1. Go to **Databases** -> **MySQL Databases** in hPanel.
2. Create a new database:
   - **Database Name**: e.g., `u123456789_academic`
   - **Username**: e.g., `u123456789_academic`
   - **Password**: Secure generated password
3. Take note of the database credentials.

### Step 2: Configure Node.js Application
1. Go to **Websites** -> select your domain -> click **Manage**.
2. Select **Node.js** in hPanel.
3. Configure application settings:
   - **Node.js Version**: `20.x` or `22.x`
   - **Application Mode**: `Production`
   - **Application Root**: `/` (or directory where code resides)
   - **Application Startup File**: `dist/server.cjs`
   - **Custom Package Manager**: `npm`

---

## 3. Production Environment Variables

Configure these variables under **Environment Variables** in hPanel (or in a secure `.env` file on the server):

| Variable | Required | Description | Example / Value |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | **Yes** | Runtime environment mode | `production` |
| `PORT` | Auto | Port assigned by Hostinger | Assigned automatically by Hostinger |
| `DB_HOST` | **Yes** | MySQL server host | `127.0.0.1` or `localhost` |
| `DB_PORT` | **Yes** | MySQL server port | `3306` |
| `DB_NAME` | **Yes** | MySQL database name | `u123456789_academic` |
| `DB_USER` | **Yes** | MySQL database user | `u123456789_academic` |
| `DB_PASSWORD` | **Yes** | MySQL database password | `your_secure_password` |
| `JWT_SECRET` | **Yes** | Cryptographic token secret | 64+ char random string |
| `STORAGE_BASE_DIR` | Optional | Custom uploads base directory | Defaults to `./uploads` |

---

## 4. Build & Deployment Steps

### Via Hostinger SSH / Terminal:

1. Connect to your Hostinger server via **SSH** or open the **Terminal** in hPanel.
2. Navigate to your project directory:
   ```bash
   cd ~/public_html
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build both frontend and backend bundles:
   ```bash
   npm run build
   ```
   *This compiles the React SPA into `dist/` and bundles the Express server into `dist/server.cjs`.*

5. Start or restart the Node.js application:
   ```bash
   npm start
   ```

---

## 5. Verification & Health Check

1. **Health Check**:
   Open `https://yourdomain.com/api/health` in your browser.
   Expected response:
   ```json
   {
     "status": "ok",
     "uptime": 120.4,
     "timestamp": "2026-08-21T12:00:00.000Z",
     "environment": "production",
     "port": 3000,
     "database": "connected"
   }
   ```

2. **Frontend Navigation**:
   Open `https://yourdomain.com/` and verify Journals, Articles, Editorial Board, and Author Hub work smoothly.

3. **Authentication**:
   Register a new author account or log in as administrator (`admin@journal.org`).

4. **Manuscript Uploads**:
   Submit a manuscript PDF and verify it routes through `/uploads/private` with authenticated proxy access.
