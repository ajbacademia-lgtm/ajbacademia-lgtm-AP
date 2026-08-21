# Deployment Rollback Guide

This guide describes procedures for rolling back application versions in case of critical production issues.

---

## 1. Quick Emergency Rollback (Hostinger Managed Node.js)

1. Open **Hostinger hPanel** -> select your website -> navigate to **Node.js**.
2. Click **Stop** on the Node.js application card.
3. In SSH or File Manager, restore the previous working build artifacts:
   ```bash
   cp -r backup/dist/* ./dist/
   ```
4. Click **Start** or **Restart** in Hostinger hPanel to bring the application back online.

---

## 2. Database Backup & Rollback (MySQL)

If a database rollback is required:

1. Use **phpMyAdmin** in Hostinger hPanel or MySQL CLI to export/import database backups:
   ```bash
   # Create backup
   mysqldump -u u123456789_academic -p u123456789_academic > backup_ajp.sql

   # Restore backup
   mysql -u u123456789_academic -p u123456789_academic < backup_ajp.sql
   ```

---

## 3. Database State Safety

- The application uses timestamp tracking (`createdAt`, `updatedAt`).
- Schema updates and record insertions use safe upsert / merge statements to prevent accidental data loss.
