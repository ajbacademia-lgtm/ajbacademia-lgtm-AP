# Security Audit Checklist

Security controls implemented and verified for the Academic Journal Platform.

---

## 1. Authentication & Password Security

- [x] **Password Hashing**: Passwords stored as salted hashes using `bcrypt` (cost factor 10).
- [x] **Secret Exposure Prevention**: User object database queries strip `passwordHash` before returning to clients (`const { passwordHash, ...safeUser } = userDoc`).
- [x] **JWT Token Signing & HTTP-Only Cookies**: Tokens cryptographically signed with `HS256` using secure `JWT_SECRET` and stored in `HttpOnly` cookies.
- [x] **Role-Based Access Control (RBAC)**: Fine-grained authorization middleware checking `admin`, `editor`, `reviewer`, `author`, and `reader` permissions.

---

## 2. API & Network Security

- [x] **JSON Error Standard**: Error handlers catch internal exceptions and return structured JSON responses (`{ "success": false, "error": "..." }`) rather than leaking stack traces or raw HTML.
- [x] **Rate Limiting**: Rate limiting applied to authentication endpoints and file upload routes to prevent brute-force attacks.
- [x] **Gemini API Protection**: `GEMINI_API_KEY` kept strictly in server-side environment variables and proxied via `/api/ai/*` backend routes.

---

## 3. Storage Security & File Upload Enforcement

- [x] **MIME Type Validation**: Storage service and Multer middleware reject non-PDF file uploads (`application/pdf` enforced).
- [x] **File Size Caps**: Hard limit of 25MB enforced at server middleware layer.
- [x] **Path Traversal Protection**: Filenames and paths sanitized against directory traversal attacks (`../`).
- [x] **Storage Segregation**: Public files placed in `/uploads/public`, private confidential manuscripts in `/uploads/private` accessible only via authenticated proxy endpoints.
