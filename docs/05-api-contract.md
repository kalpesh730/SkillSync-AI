# API Contract Document

## 1. API Design Principles

The SkillSync API is built adhering to robust, enterprise-grade RESTful architecture principles.

- **REST Conventions:** Endpoints utilize standard HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) mapping to CRUD operations.
- **Resource Naming:** Nouns are used instead of verbs (e.g., `/jobs` instead of `/getJobs`). Plural nouns are used consistently.
- **Stateless APIs:** Every request is independent and contains all information necessary for the server to fulfill it, utilizing JWT for authentication context.
- **Versioning:** All endpoints are prefixed with `/api/v1` to ensure future structural changes do not break legacy clients.
- **JSON Responses:** All request payloads and response bodies strictly adhere to the `application/json` format (except for `multipart/form-data` during file uploads).
- **HTTP Status Codes:** Standard HTTP status codes reflect the exact nature of the operation's outcome (e.g., `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `500` Internal Server Error).

---

## 2. Authentication APIs

### `POST /api/v1/auth/login`
- **Purpose:** Authenticates a user and issues a JWT access token.
- **Authorization Required:** None (Public)
- **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response Body:** `{ "token": "jwt_string", "user": { "id": "...", "role": "STUDENT", "tenantId": "..." } }`
- **Success Codes:** `200 OK`
- **Error Codes:** `400 Bad Request`, `401 Unauthorized`
- **Business Rules:** Determines the user's role and associated `tenantId` (College ID) upon successful authentication.

### `POST /api/v1/auth/logout`
- **Purpose:** Invalidates the current session.
- **Authorization Required:** Valid JWT
- **Request Body:** None
- **Response Body:** Null (Standard Success format)
- **Success Codes:** `200 OK`
- **Error Codes:** `401 Unauthorized`
- **Business Rules:** Client-side token deletion; server-side token blacklisting if Redis is implemented.

### `GET /api/v1/auth/me`
- **Purpose:** Retrieves the profile of the currently authenticated user.
- **Authorization Required:** Valid JWT
- **Request Body:** None
- **Response Body:** Profile object based on role.
- **Success Codes:** `200 OK`
- **Error Codes:** `401 Unauthorized`
- **Business Rules:** Implicitly uses the decoded `userId` from the JWT.

*(Note: Other standard endpoints include `/register`, `/refresh-token`, `/forgot-password`, and `/reset-password` following standard implementation patterns).*

---

## 3. Student APIs

- **`GET /api/v1/students`**: List students (Placement Officer / College Admin only, scoped to `tenantId`).
- **`GET /api/v1/students/:id`**: Get specific student details.
- **`PUT /api/v1/students/me`**: Update own student profile.
- **`PATCH /api/v1/students/:id/verify`**: Placement Officer verifies a student's academic credentials.

---

## 4. College APIs

- **`GET /api/v1/colleges/:id`**: Retrieve public or tenant-specific college details.
- **`PUT /api/v1/colleges/:id`**: Update college branding and settings (College Admin only).
- **`GET /api/v1/colleges/:id/metrics`**: Placement metrics for the college.

---

## 5. Company APIs

- **`GET /api/v1/companies`**: List partner companies.
- **`POST /api/v1/companies`**: Register a new company (Super Admin / HR).
- **`GET /api/v1/companies/:id`**: Get company details.
- **`PUT /api/v1/companies/:id`**: Update company details (Company HR only).

---

## 6. Recruiter APIs

- **`GET /api/v1/recruiters`**: List recruiters for a company (Company HR only).
- **`POST /api/v1/recruiters`**: Invite a new recruiter to the company.
- **`DELETE /api/v1/recruiters/:id`**: Revoke recruiter access.

---

## 7. Job APIs

- **`GET /api/v1/jobs`**: List available jobs (Students see eligible jobs; Recruiters see their postings).
- **`POST /api/v1/jobs`**: Create a new job posting (Recruiter only).
- **`GET /api/v1/jobs/:id`**: View job details.
- **`PUT /api/v1/jobs/:id`**: Update job criteria.
- **`PATCH /api/v1/jobs/:id/status`**: Open or close a job.

---

## 8. Resume APIs

- **`GET /api/v1/resumes`**: List all resumes uploaded by the authenticated student.
- **`GET /api/v1/resumes/:id`**: View specific resume metadata.
- **`DELETE /api/v1/resumes/:id`**: Delete (soft-delete) a resume.

---

## 9. AI APIs

- **`POST /api/v1/ai/parse-resume`**: Analyzes an uploaded resume and extracts structured skill/education JSON.
- **`POST /api/v1/ai/ats-score`**: Calculates resume compatibility against a specific `jobId`.
- **`GET /api/v1/ai/skill-gap/:jobId`**: Returns identified missing skills for the student regarding a specific job.
- **`GET /api/v1/ai/job-match`**: Returns a list of highly recommended jobs based on the student's AI parsed profile.
- **`GET /api/v1/ai/career-suggestions`**: Provides general career path recommendations based on current skill vectors.

---

## 10. Application APIs

- **`POST /api/v1/applications`**: Student applies to a `jobId`.
- **`POST /api/v1/applications/:id/withdraw`**: Student withdraws their application.
- **`PATCH /api/v1/applications/:id/status`**: Recruiter updates status (e.g., SHORTLISTED, REJECTED).
- **`GET /api/v1/applications`**: 
  - If Student: Lists their own applications.
  - If Recruiter: Lists applications for their posted jobs.
  - If Placement Officer: Lists applications submitted by students within their tenant.

---

## 11. Analytics APIs

- **`GET /api/v1/analytics/student`**: Skill progression and application success rates.
- **`GET /api/v1/analytics/college`**: Aggregate placement percentages, top companies, average packages.
- **`GET /api/v1/analytics/recruiter`**: Pipeline conversion rates, time-to-hire.
- **`GET /api/v1/analytics/admin`**: Platform usage, tenant growth, AI API utilization.

---

## 12. Notification APIs

- **`GET /api/v1/notifications`**: List user's notifications.
- **`PATCH /api/v1/notifications/:id/read`**: Mark specific notification as read.
- **`PATCH /api/v1/notifications/read-all`**: Mark all as read.

---

## 13. File Upload APIs

*(These endpoints consume `multipart/form-data` and return secure URLs).*

- **`POST /api/v1/uploads/resume`**: Uploads PDF/DOCX and returns the storage reference.
- **`POST /api/v1/uploads/profile-image`**: Uploads an image (JPG/PNG) for avatars.
- **`POST /api/v1/uploads/certificates`**: Uploads supporting academic documentation.

---

## 14. Pagination Standard

All list endpoints (`GET`) returning arrays must support the following query parameters:

- `page`: (Number) The page number to fetch. Default `1`.
- `limit`: (Number) The number of items per page. Default `20`. Max `100`.
- `sort`: (String) Field to sort by. Prefix with `-` for descending (e.g., `-createdAt`).
- `search`: (String) Text search query applied to indexed fields (e.g., name, email, job title).
- `filter[field]`: (String) Exact match filtering (e.g., `?filter[status]=ACTIVE`).

---

## 15. Error Response Standard

All errors follow a unified structure to allow frontend clients to handle failures predictably.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid request payload.",
    "details": [
      { "field": "email", "message": "Must be a valid email address." },
      { "field": "password", "message": "Minimum 8 characters required." }
    ]
  }
}
```

---

## 16. Success Response Standard

All successful responses wrap the payload in a standard envelope.

**Single Object:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Jane Doe"
  }
}
```

**Paginated List:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## 17. Authorization Rules

Every endpoint requires robust evaluation based on the RBAC specification.

- **Allowed Roles:** Handled by middleware (e.g., `requireRole(['STUDENT'])`).
- **RBAC Requirements:** Users cannot access endpoints outside their explicit role boundaries.
- **Tenant Rules:** All backend services implicitly inject `req.user.tenantId` into database queries. A College Admin calling `GET /api/v1/students` will *only* receive students where `student.tenantId === req.user.tenantId`.
- **Resource Ownership:** Even if a Student has the `STUDENT` role, calling `PUT /api/v1/students/:id` will fail with `403 Forbidden` unless the `:id` matches their own `req.user.id`.

---

## 18. API Naming Standards

- **Paths:** Always lowercase, separated by hyphens (kebab-case). E.g., `/skill-gap` not `/skillGap`.
- **Identifiers:** Path parameters are used for specific resource identifiers (e.g., `/jobs/123`).
- **Actions:** Query parameters or sub-resources are used for actions (e.g., `/applications/123/withdraw`).
- **Payload Keys:** JSON payloads always use `camelCase` (e.g., `tenantId`, `firstName`).

---

## 19. Future APIs

The URL namespace `/api/v1/` protects current integrations. Future expansion will seamlessly introduce new root paths:

- **Coding Platform:** `/api/v1/assessments`
- **Interview AI:** `/api/v1/interviews`
- **Training:** `/api/v1/courses`
- **Internships:** Supported natively within `/api/v1/jobs` via a `jobType=INTERNSHIP` query filter.

This API contract guarantees that future features will interlock seamlessly without necessitating breaking changes to the core V1 REST interface.
