# End-to-End Testing Guide

This guide outlines manual and automated verification steps for testing the Academic Journal Platform APIs.

---

## 1. Authentication Endpoints

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testauthor@journal.org","password":"password123","name":"Test Author","role":"author"}'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testauthor@journal.org","password":"password123"}'
```

---

## 2. Article PDF Storage Endpoints

### Upload Article PDF (Max 25MB, application/pdf)
```bash
curl -X POST http://localhost:3000/api/journals/j1/articles/a1/pdf \
  -F "file=@/path/to/sample.pdf;type=application/pdf"
```

### Replace Article PDF
```bash
curl -X PUT http://localhost:3000/api/journals/j1/articles/a1/pdf \
  -F "file=@/path/to/updated.pdf;type=application/pdf"
```

### Download Article PDF
```bash
curl -X GET http://localhost:3000/api/journals/j1/articles/a1/pdf -o downloaded_article.pdf
```

### Delete Article PDF
```bash
curl -X DELETE http://localhost:3000/api/journals/j1/articles/a1/pdf
```

---

## 3. Data Integrity & Validation Testing

### File Type Validation Test (Should fail with 400 JSON)
```bash
curl -X POST http://localhost:3000/api/journals/j1/articles/a1/pdf \
  -F "file=@/path/to/image.png;type=image/png"
```
*Expected Response:* `{ "success": false, "error": "Invalid file type. Only PDF documents (application/pdf) are allowed." }`

### Oversized File Test (Should fail with 400 JSON)
Upload a file exceeding 25MB.
*Expected Response:* `{ "success": false, "error": "File size exceeds maximum limit of 25MB" }`
