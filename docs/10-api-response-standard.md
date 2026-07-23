# API Response Standard

## 1. Purpose

In a large-scale Multi-Tenant SaaS platform like SkillSync, a unified API response standard is critical. It guarantees that the frontend applications (React clients, mobile apps, third-party integrations) can parse data and handle errors predictably, regardless of which backend module generated the response. It acts as the unbreakable contract between the Express server and the outside world.

---

## 2. General Principles

- **Consistency:** Every API response, whether success or failure, must be wrapped in a standard JSON envelope.
- **Predictability:** Clients should never have to guess the shape of the data. 
- **Security:** Error responses must never leak stack traces, database details (like MongoDB internal ObjectIDs in error messages), or sensitive server configurations.
- **Minimal Payloads:** Return only the data explicitly requested or required by the view. Do not over-fetch and dump entire Mongoose documents.
- **Version Compatibility:** Changes to response shapes must be additive. Removing or renaming fields requires a new API version (e.g., migrating to `/api/v2`).

---

## 3. Success Response Format

All successful responses return HTTP status codes in the `2xx` range and share a common envelope.

**Single Resource (`GET /users/:id`, `PUT /jobs/:id`):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-07-23T14:00:00Z"
  }
}
```

**Collection (`GET /jobs`):**
See Section 4 (Pagination). The `data` property will contain an array.

**Creation (`POST /jobs`):** Returns `201 Created`.
```json
{
  "success": true,
  "message": "Job successfully created.",
  "data": {
    "id": "job_456"
  }
}
```

**Deletion (`DELETE /jobs/:id`):** Returns `200 OK` (if returning meta) or `204 No Content` (if returning nothing).
```json
{
  "success": true,
  "message": "Resource successfully deleted."
}
```

---

## 4. Pagination Response

Any API endpoint that returns a list of resources must support pagination to ensure horizontal scalability.

```json
{
  "success": true,
  "data": [
    { "id": "job_1", "title": "Software Engineer" },
    { "id": "job_2", "title": "Product Manager" }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "requestId": "req_def456",
    "timestamp": "2026-07-23T14:05:00Z"
  }
}
```

---

## 5. Error Response Format

All errors return HTTP status codes in the `4xx` or `5xx` range. `success` is always `false`.

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Unauthorized access.",
    "details": null
  },
  "meta": {
    "requestId": "req_err789",
    "timestamp": "2026-07-23T14:10:00Z"
  }
}
```
- **400 Bad Request:** Validation errors, malformed syntax.
- **401 Unauthorized:** Missing or invalid JWT.
- **403 Forbidden:** Valid JWT, but insufficient RBAC permissions.
- **404 Not Found:** Resource does not exist or user lacks tenant rights to see it.
- **409 Conflict:** Duplicate data (e.g., user email already exists).
- **429 Too Many Requests:** Rate limit exceeded.
- **500 Internal Server Error:** Unhandled exception (stack trace logged internally, not sent to client).

---

## 6. Validation Error Structure

For `400 Bad Request` validation failures (e.g., via Zod or Express Validator), the `details` field is populated with specific property paths to allow the frontend to bind errors directly to form inputs.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_001",
    "message": "Request validation failed.",
    "details": [
      { "path": "email", "message": "Invalid email format." },
      { "path": "skills[0].experience", "message": "Experience must be a positive number." },
      { "path": "profile.address.zipCode", "message": "Zip code is required." }
    ]
  }
}
```

---

## 7. Authentication Errors

- **Missing Token (`AUTH_001`):** "Authentication token is missing."
- **Invalid Token (`AUTH_002`):** "Token is malformed or invalid."
- **Expired Token (`AUTH_003`):** "Token has expired." (Client should trigger silent refresh flow).
- **Inactive Account (`AUTH_004`):** "Account is suspended or pending verification."

---

## 8. AI Module Responses

AI responses generated via Gemini require explicit metadata, including confidence scores and potential hallucination warnings.

```json
{
  "success": true,
  "data": {
    "atsScore": 85,
    "extractedSkills": ["React", "Node.js"],
    "missingSkills": ["Docker", "Kubernetes"]
  },
  "meta": {
    "ai": {
      "confidenceScore": 0.92,
      "warnings": [
        "Education dates were unclear and have been estimated."
      ],
      "model": "gemini-1.5-pro",
      "processingTimeMs": 2450
    }
  }
}
```

---

## 9. File Upload Responses

```json
{
  "success": true,
  "message": "Resume uploaded successfully.",
  "data": {
    "fileId": "file_999",
    "url": "https://cdn.skillsync.app/resumes/user_123.pdf",
    "metadata": {
      "originalName": "John_Doe_Resume_2026.pdf",
      "sizeBytes": 1048576,
      "format": "application/pdf"
    }
  }
}
```
**Limits Error (`UPLOAD_002`):** `413 Payload Too Large` - "File exceeds the 5MB maximum limit."

---

## 10. Standard Metadata

Every response (success or failure) must include a `meta` block to aid in debugging and telemetry.

- `requestId`: A unique UUID generated at the middleware entry point. Essential for tracking a request through CloudWatch/Datadog logs.
- `timestamp`: ISO-8601 string of when the response was dispatched.
- `apiVersion`: (Optional) The current API version serving the request (e.g., `1.0.4`).
- `processingTime`: (Optional/Admin only) Time taken in milliseconds from request receipt to response dispatch.

---

## 11. Error Codes

To allow frontends to translate errors into multiple languages without relying on english `message` strings, strict alphanumeric codes are utilized.

- **AUTH_xxx:** Authentication and session issues.
- **RBAC_xxx:** Authorization and role violations.
- **USER_xxx:** User profile and registration errors.
- **JOB_xxx:** Job posting and application errors.
- **AI_xxx:** Gemini parsing timeouts or format failures.
- **UPLOAD_xxx:** Multer file type or size violations.
- **VALIDATION_xxx:** Request payload schema failures.
- **SYSTEM_xxx:** Internal infrastructure errors (e.g., database connection lost).

---

## 12. Best Practices

- **Do:** Return `404 Not Found` instead of `403 Forbidden` if a user attempts to access a resource belonging to another Tenant, to prevent leaking the existence of that resource.
- **Do:** Strip `_id` and `__v` from Mongoose documents before returning them. Map `_id` to `id`.
- **Do Not:** Ever return a raw database error string to the client.
- **Do Not:** Send empty arrays as `null`. Always send `[]`.
- **Backward Compatibility:** If an endpoint currently returns a flat object, do not suddenly wrap it in a nested object. Clients will crash.
- **Future-Proofing:** Always leave room for extension. Placing actual payload data inside `data` rather than at the root level ensures we can always add adjacent metadata later without breaking existing parsers.
