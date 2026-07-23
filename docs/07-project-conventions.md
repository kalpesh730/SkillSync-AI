# Project Conventions & Engineering Standards

## 1. Engineering Philosophy

The SkillSync platform is designed to scale securely across hundreds of tenants while remaining easy to maintain by a growing engineering team. We strictly adhere to the following principles:

- **Maintainability:** Code is read 10x more than it is written. Optimize for the reader.
- **Readability:** Prefer expressive, descriptive naming over clever, condensed syntax.
- **Scalability:** Design features knowing they will eventually handle millions of documents and thousands of concurrent users.
- **Consistency:** Uniformity across the codebase reduces cognitive load. Follow conventions over personal preferences.
- **Clean Architecture:** Decouple business logic from framework-specific implementation (e.g., separate Services from Express Controllers).
- **SOLID:** Strictly enforce single responsibility and dependency inversion.
- **DRY (Don't Repeat Yourself):** Abstract shared logic, but avoid premature abstraction.
- **KISS (Keep It Simple, Stupid):** Do not over-engineer. Solve the immediate problem using the simplest effective pattern.
- **YAGNI (You Aren't Gonna Need It):** Build for the current requirement. Do not add speculative "future-proofing" logic that adds immediate complexity.

---

## 2. Folder Naming Convention

All folders must be named using **lowercase kebab-case**.

- `client/` - React frontend application.
- `server/` - Node.js/Express backend application.
- `features/` - Domain-specific modules (e.g., `student-dashboard`, `job-management`).
- `components/` - Shared presentational UI elements.
- `hooks/` - Reusable React hooks.
- `services/` - API clients or backend business logic.
- `utils/` - Pure helper functions.

---

## 3. File Naming Convention

We prioritize consistency. The vast majority of files will use **lowercase kebab-case**.

### Examples:
- `student-card.jsx`
- `login-page.jsx`
- `auth-service.js`
- `job-controller.js`
- `resume-parser.js`

### Case Rules:
- **kebab-case:** Used for all folders, non-component files, services, controllers, utilities, and Markdown documentation (e.g., `07-project-conventions.md`).
- **PascalCase:** Reserved exclusively for React Component files and Class definitions (if specifically mandated, though kebab-case for component files like `student-card.jsx` is standard here to align with URL structures and OS safety).
- **camelCase:** Used for variables, object instances, and function names within the code.
- **UPPER_CASE:** Used strictly for global constants and environment variables (e.g., `JWT_SECRET`, `MAX_UPLOAD_SIZE`).

---

## 4. Variable Naming

- **camelCase:** Default format for all variables (`studentName`, `jobList`).
- **Booleans:** Must be prefixed with `is`, `has`, `can`, or `should` (e.g., `isVerified`, `hasApplied`).
- **Arrays:** Must be plural nouns (e.g., `students`, `activeJobs`).
- **Descriptiveness:** No single-letter variables except in standard loop counters (`i`, `j`) or extremely short callback maps (`arr.map(x => x.id)`).

---

## 5. Function Naming

- **camelCase:** Default format for all functions.
- **Action-Oriented:** Functions must start with a verb (e.g., `getStudentProfile`, `calculateAtsScore`, `handleJobApply`).
- **Event Handlers:** Prefix with `handle` (e.g., `handleSubmit`, `handleFileDrop`).
- **API Calls:** Prefix with `fetch`, `create`, `update`, `delete` (e.g., `fetchColleges`).

---

## 6. Component Naming

- **PascalCase:** Used for the component function declaration internally (`const StudentCard = () => {}`).
- **Descriptive:** Components must describe what they render (`PlacementDashboard`, not `Dashboard1`).
- **Suffixes:** Append `Page` to top-level route components (`LoginPage.jsx`, `JobBoardPage.jsx`).

---

## 7. Folder Organization (Feature First)

Code is grouped by **Domain Feature**, not by technical file type.

**Incorrect (Layered):**
```text
client/
├── components/ (Contains Auth, Jobs, Resumes)
├── hooks/      (Contains Auth, Jobs, Resumes)
```

**Correct (Feature First):**
```text
client/
└── features/
    ├── auth/
    │   ├── components/
    │   ├── hooks/
    │   └── auth-service.js
    ├── jobs/
```
This ensures high cohesion. When you delete a feature, you delete the folder, leaving no orphaned code behind.

---

## 8. Import Order

Maintain a clean, standardized import order at the top of every file to avoid merge conflicts and improve readability.

1. **External Node Modules / Libraries:** (e.g., `react`, `express`, `mongoose`)
2. **Internal Aliases / Contexts:** (e.g., `@/store`, `@/features`)
3. **Components:** (e.g., `../components/button`)
4. **Services / Utils:** (e.g., `../utils/format-date`)
5. **Styles / Assets:** (e.g., `./student-card.css`, `../assets/logo.png`)

Leave one blank line between each group.

---

## 9. Code Style

- **Maximum Function Size:** Aim for under 40 lines. If a function is longer, extract logic into pure helper functions.
- **Maximum File Size:** Aim for under 250 lines. Large files violate the Single Responsibility Principle.
- **Maximum Nesting:** Avoid nesting deeper than 3 levels (e.g., `if` inside `if` inside `for`). Return early instead.
- **Comment Rules:** Comment the *why*, not the *what*. Self-documenting code is preferred. Use comments for complex business logic, Regex, or AI prompt engineering rationale.
- **Whitespace:** 2 spaces for indentation.
- **Formatting:** Prettier will enforce formatting on save. No manual formatting debates.

---

## 10. Git Standards

- **Branch Naming:** `type/short-description` (e.g., `feat/ai-resume-parser`, `fix/login-crash`, `docs/api-contract`).
- **Commit Naming:** Adhere strictly to Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- **Pull Request Rules:** 
  - Must pass CI/CD (linting, tests).
  - Must be reviewed by at least one core maintainer.
  - PR title must match Conventional Commits.
- **Merge Strategy:** "Squash and Merge" is preferred to keep the `main` history linear and clean.

---

## 11. Documentation Standards

- **JSDoc:** Required for complex utility functions and shared services to provide IntelliSense types.
- **README:** Every major feature module (e.g., `/server/features/ai/`) should have a local `README.md` explaining its purpose and external dependencies.
- **Architecture Docs:** Maintain central architectural truth in the `docs/` folder. Update these *before* implementing massive changes.
- **API Documentation:** Use Postman collections or Swagger (OpenAPI) generated from JSDoc/Route definitions.

---

## 12. Error Handling Standards

- **Naming:** Suffix custom error classes with `Error` (e.g., `TenantIsolationError`, `AiParsingError`).
- **Throwing Errors:** Throw early, catch late. The service layer throws specific errors; the controller layer catches them and formats the HTTP response.
- **Logging:** Log errors at the top boundary (Express global error handler) to avoid duplicate stack traces. Include `tenantId` and `userId` in logs for debugging.
- **Custom Errors:** Extend the native JS `Error` class and include HTTP `statusCode` and `errorCode` strings for frontend translation.

---

## 13. Security Standards

- **Secrets:** Never hardcode secrets. Always use `.env` files and access via `process.env`.
- **JWT:** Access tokens are short-lived. Never store PII (Personally Identifiable Information) inside the JWT payload.
- **Validation:** Trust no client. Validate every request payload using a strict schema (e.g., Zod or Joi) before it touches the controller.
- **Authorization:** Perform RBAC checks on every protected route.
- **Tenant Isolation:** Every single database query in the server must explicitly include `tenantId`. Never assume the context is isolated without proving it in the query.

---

## 14. Performance Standards

- **Memoization:** Use `useMemo` and `useCallback` in React only when rendering expensive lists or passing props to heavy child components.
- **Pagination:** All array-returning APIs must be paginated via standard `limit` and `page` parameters.
- **Caching:** Cache expensive AI results and static college configurations to reduce database/API load.
- **Lazy Loading:** Implement route-based lazy loading in React to keep the initial JS bundle under 250KB.
- **Database Optimization:** Ensure all query predicates (like `tenantId` + `status`) are covered by compound MongoDB indexes.

---

## 15. Testing Standards

- **Unit Testing:** Focus on isolated business logic (Services, Utils, Reducers, AI prompt generators).
- **Integration Testing:** Focus on API endpoints (Controller -> Service -> Test Database).
- **E2E Testing:** Critical user journeys (e.g., Student Application Flow, Recruiter Job Posting) tested via tools like Cypress or Playwright.
- **Folder Naming:** Tests live next to the file they test, in a `__tests__` folder.
- **File Naming:** `[filename].test.js` or `[filename].spec.js` (e.g., `auth-service.test.js`).

---

## 16. Future Rules

To ensure SkillSync remains an enterprise-grade platform, future contributors must:

1. Consult the `docs/` folder before proposing structural changes.
2. Ensure new modules adopt the Feature-First architecture.
3. Apply the Tenant Isolation Rule to every new database schema natively.
4. If a standard defined in this document proves inadequate, the document must be updated via a Pull Request *before* the codebase deviates from it.
