# Frontend Architecture Document

## 1. Frontend Philosophy

The SkillSync frontend is built to be a robust, enterprise-grade React application utilizing Vite. The architecture is driven by the following core philosophies:

- **Scalability:** The codebase is designed to grow gracefully. Feature modules are isolated to prevent the "spaghetti code" effect as new domains (like AI Interviews) are added.
- **Maintainability:** Strict folder structures, naming conventions, and separation of concerns ensure that any engineer can easily locate and update code.
- **Performance:** Leveraging Vite's ultra-fast HMR and build times, combined with React 19's optimized rendering, lazy-loading, and intelligent code splitting.
- **Reusability:** A strict separation between UI components and business logic allows components to be reused across different tenant dashboards.
- **Accessibility:** UI components adhere to WCAG standards (keyboard navigation, ARIA labels, color contrast) to ensure inclusivity.
- **Developer Experience (DX):** Enforced formatting (Prettier), strict linting (ESLint), and modular structure make development fast and predictable.

---

## 2. Folder Structure

The application strictly follows a feature-based architecture within the `client/` directory.

```text
client/
└── src/
    ├── app/          # Core initialization (providers, global error boundaries)
    ├── assets/       # Static files (images, SVGs, global fonts)
    ├── components/   # Shared, purely presentational UI components (buttons, modals, inputs)
    ├── features/     # Feature-based modules (e.g., /auth, /jobs, /student-dashboard)
    ├── hooks/        # Global custom React hooks (e.g., useTheme, useDebounce)
    ├── layouts/      # Structural layout wrappers (e.g., StudentLayout, RecruiterLayout)
    ├── pages/        # Top-level page components connecting features to routes
    ├── routes/       # Route definitions, guards, and lazy-loading configurations
    ├── services/     # Global API configuration (Axios instances, interceptors)
    ├── store/        # Global state management context/configuration
    ├── styles/       # Global CSS, Tailwind entry points, CSS variables
    ├── types/        # Global TypeScript interfaces/types (if TS is adopted)
    └── utils/        # Pure helper functions (date formatting, text transformation)
```

**Purpose of `features/`:** This is the heart of the architecture. Instead of organizing by file type (e.g., putting all reducers in one folder and all components in another), code is grouped by domain feature (e.g., `features/resume`). A feature folder contains its own components, hooks, and API service definitions specific to that domain.

---

## 3. Routing Architecture

Routing is managed by **React Router**. We utilize a nested routing architecture that heavily leverages Route Guards.

- **Public Routes:** Accessible without authentication (e.g., Landing Page, Login, Forgot Password).
- **Private Routes:** Require a valid JWT token. Wrapped in a `<RequireAuth>` guard.
- **Role-Based Routes:** Sub-routes protected by RBAC logic. For example, `/dashboard/student` is wrapped in a `<RequireRole allowedRoles={['STUDENT']}>` guard.
- **404 Not Found:** A catch-all route mapping to a friendly generic "Page Not Found" component.
- **403 Unauthorized:** Redirected here if a logged-in user attempts to access a route outside their role boundary.
- **Nested Routing:** The primary UI shell (Navbar, Sidebar) is loaded at a parent layout route, and sub-pages (e.g., `/jobs/list`, `/jobs/applications`) are rendered into the parent's `<Outlet />`.

---

## 4. Layout System

Layouts dictate the macroscopic structure of the page. SkillSync utilizes role-specific layouts due to differing navigation needs.

- **Public Layout:** Minimal navigation, primary focus on branding and calls-to-action.
- **Student Layout:** Focuses on career progress, resume strength, and job discovery.
- **Placement Officer Layout:** Focuses on cohort management, student verification, and approval workflows.
- **College Admin Layout:** Focuses on institutional settings, billing, and high-level college metrics.
- **Recruiter Layout:** Focuses on applicant pipelines, job postings, and AI candidate scoring.
- **Company HR Layout:** Focuses on corporate branding, team management, and aggregate hiring analytics.
- **Super Admin Layout:** Technical dashboard focusing on global tenant health and onboarding.

---

## 5. State Management Strategy

To prevent unnecessary complexity, state is kept as close to where it is needed as possible.

- **Global State:** Minimized. Used only for truly global concepts (e.g., Theme preference, current authenticated User session, current Tenant branding).
- **Server State:** Represents data fetched from the API (e.g., job lists, user profiles). Should eventually be managed by a caching library (like React Query or SWR) to handle loading, caching, and background refetching automatically.
- **Authentication State:** Managed globally, storing the decoded JWT payload to rapidly verify roles across components.
- **Form State:** Managed locally within the component (or via a library like React Hook Form) to prevent global re-renders on every keystroke.
- **Recommendation:** Start with React's native **Context API** combined with local state for the MVP. As server state complexity grows, introduce a dedicated data-fetching library. Avoid heavy flux architectures like Redux unless complex, multi-component interactive client state (e.g., an advanced visual resume builder) becomes necessary.

---

## 6. API Communication

All communication with the `server/` is centralized through an optimized API layer.

- **Axios Instance:** A singleton Axios instance is configured in `client/src/services/apiClient.js` with the base URL pointing to `/api/v1`.
- **Interceptors (Request):** Automatically attach the JWT token from `localStorage` (or memory) to the `Authorization` header of every outbound request.
- **Interceptors (Response):** Globally catch HTTP errors. If a `401 Unauthorized` is detected, trigger the refresh token flow or log the user out.
- **JWT Refresh:** A silent mechanism to request a new access token before the current one expires, preventing user disruption.
- **Error Handling:** Standardized parsing of the backend error envelope to display unified Toast notifications to the user.
- **Retry Strategy:** Idempotent requests (like `GET` for analytics) will automatically retry once on a `502` or `503` network error.
- **Timeout:** Explicit 10-second timeout on standard requests, extended to 30 seconds for AI-heavy operations (e.g., resume parsing).

---

## 7. Authentication Flow

1. **Login:** User submits credentials. Client receives JWT.
2. **Token Storage:** JWT is securely stored (in memory for highest security, or `localStorage`/`httpOnly` cookies depending on XSS vs CSRF trade-offs).
3. **Protected Routes:** User navigates to a protected route. The router checks for a valid token in state. If valid, the route renders; if not, redirects to `/login`.
4. **Session Expiry:** If the backend returns a `401` due to an expired token, the Axios response interceptor intercepts the error, clears the local auth state, and redirects the user to the login screen with a "Session Expired" message.
5. **Logout:** User clicks logout. The client calls the `/auth/logout` API, clears all local context, and routes to `/login`.

---

## 8. Component Strategy

- **Shared Components:** Found in `src/components/`. Completely agnostic, dumb UI components (Buttons, Inputs, Cards). They contain no business logic and rely entirely on props.
- **Feature Components:** Found in `src/features/[featureName]/components/`. Specific to a domain (e.g., `ResumeUploadDropzone`). They may contain local business logic.
- **Layout Components:** Found in `src/layouts/`. Structural wrappers (Sidebars, Headers) that yield to an `<Outlet />`.
- **Reusable Components:** Any component used in more than two places should be promoted from a feature to the shared folder.
- **Business Components:** Smart components (usually Pages) that connect to the Context API or services to fetch data, and pass that data down to dumb presentational components.

---

## 9. Form Strategy

- **Validation:** Client-side validation prevents unnecessary API calls. Complex forms utilize a schema-based validation approach (e.g., Zod/Yup) to mirror backend validation schemas.
- **Error Display:** Errors are displayed inline below the corresponding input fields in red, alongside an ARIA live region for screen readers.
- **Loading States:** Submit buttons display a spinner and are disabled during API transit to prevent double submissions.
- **Disabled States:** Forms are disabled entirely if the user lacks the required RBAC permissions to edit the data.
- **Optimistic UI:** For non-critical toggle actions (e.g., "starring" a job), the UI updates instantly before the API responds, reverting only if the API call fails, creating a highly responsive feel.

---

## 10. Performance Strategy

- **Lazy Loading:** React `lazy()` and `Suspense` are used to split the application bundle by Route. The Recruiter dashboard code is never loaded by a Student.
- **Code Splitting:** Handled natively by Vite. Heavy third-party libraries (e.g., PDF generation, chart libraries) are separated into distinct chunks.
- **Memoization:** Strategic use of `useMemo` and `useCallback` to prevent expensive re-renders on complex dashboards or data tables.
- **Image Optimization:** Avatars and static assets are served in WebP format and lazy-loaded via the `loading="lazy"` HTML attribute.
- **Virtualization:** Extremely long lists (e.g., thousands of students in a College Admin view) are rendered using a virtualization library to only paint visible DOM nodes.
- **Caching:** Global configuration ensures static assets (CSS, JS chunks) are heavily cached by the browser.

---

## 11. Error Handling

- **404:** Unmatched routes display a branded "Lost in space" empty state with a call-to-action returning to the dashboard.
- **403:** Role violations display a "Restricted Access" screen indicating the user lacks necessary permissions.
- **500:** Unexpected API crashes trigger an Error Boundary, displaying a friendly "Something went wrong" graphic instead of a blank white screen.
- **Offline:** The client detects `navigator.onLine` status and displays a persistent banner warning the user of lost connectivity.
- **API Errors:** Gracefully caught by Axios and displayed via non-intrusive Toast notifications.
- **Empty States:** When a list is empty (e.g., no jobs applied to), a beautiful graphical empty state is shown rather than a blank table.
- **Loading States:** Skeleton loaders are used in place of spinners for complex UI blocks to reduce perceived loading time and layout shift.

---

## 12. Responsive Strategy

Tailwind CSS provides the utility classes for a mobile-first responsive design.

- **Mobile (< 768px):** Sidebars collapse into hamburger menus. Tables convert into stacked card layouts. Modals become full-screen sheets.
- **Tablet (768px - 1024px):** Layouts expand, sidebars may become icons-only to save horizontal space.
- **Desktop (> 1024px):** Full utilization of screen real estate. Multi-column layouts, persistent navigation, and dense data tables.

---

## 13. Security

- **JWT:** Access tokens are managed carefully. If stored in `localStorage`, strict XSS mitigation is enforced.
- **XSS Prevention:** React natively escapes string variables to prevent Cross-Site Scripting. We strictly avoid `dangerouslySetInnerHTML`.
- **Route Guards:** The frontend router validates roles, but it is treated purely as a UI convenience. The backend is the ultimate source of truth for authorization.
- **Sensitive Data:** PII (Personally Identifiable Information) like passwords or exact financial packages are masked by default.
- **Role Validation:** UI elements (like a "Delete College" button) are entirely excluded from the DOM if the user's role does not permit the action.

---

## 14. Future Expansion

The modular feature-based architecture ensures future scalability:

- **AI Chat:** Can be added as a floating global component in `src/app/` or as a specific feature module `src/features/chat/`, fetching data independently.
- **Notifications:** A real-time WebSocket connection can easily be integrated into a global Context provider without restructuring the layout.
- **Admin Panel:** Can be isolated entirely into its own lazy-loaded route chunk to keep the core student bundle small.
- **Coding Platform / Interview Module:** These highly interactive components will live inside `src/features/assessments/`, completely decoupled from the standard job boards.
- **Training Platform:** Educational video components and tracking logic will be isolated into `src/features/training/`, interacting seamlessly with the existing shared layout and API client.
