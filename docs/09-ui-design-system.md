# UI/UX Design System

## 1. Design Philosophy

The SkillSync interface is engineered to handle complex, data-rich workflows without overwhelming the user. Our design philosophy rests on the following pillars:

- **Professional:** Inspires trust among institutional clients (Colleges) and corporate partners (Companies). Clean lines, ample whitespace, and structured layouts.
- **Minimal:** Reduces cognitive load by eliminating decorative elements that do not serve a functional purpose.
- **Accessible:** Usable by everyone, regardless of visual, motor, or cognitive ability. Strictly adheres to WCAG 2.1 AA standards.
- **Modern:** Utilizes subtle depth (shadows), soft border radii, and a vibrant but controlled color palette to feel state-of-the-art.
- **Responsive:** A mobile-first approach ensuring parity of critical functions across devices, gracefully expanding on desktop.
- **Consistency:** Uniform visual language across all tenant dashboards (Student, Admin, Recruiter) to reduce learning curves.

---

## 2. Color System

Colors are defined semantically. They communicate state and brand identity.

- **Primary:** Deep Indigo (`#4F46E5`). Used for primary actions (Submit, Apply), active navigation states, and primary branding.
- **Secondary:** Slate Gray (`#64748B`). Used for secondary buttons, less prominent icons, and subdued interactions.
- **Success:** Emerald Green (`#10B981`). Used for successful application submissions, verified profiles, and positive KPIs.
- **Warning:** Amber (`#F59E0B`). Used for incomplete profiles, pending verifications, or approaching deadlines.
- **Danger:** Rose Red (`#EF4444`). Used for destructive actions (Delete Account, Reject Application) and critical errors.
- **Info:** Sky Blue (`#0EA5E9`). Used for informational tooltips, neutral system alerts, and onboarding highlights.
- **Neutral:** A spectrum of Gray (`#F8FAFC` to `#0F172A`).
  - **Background:** `gray-50` (Light mode base)
  - **Surface:** `white` (Cards, Modals)
  - **Text Primary:** `gray-900` (Headings)
  - **Text Secondary:** `gray-500` (Captions, helper text)

---

## 3. Typography

**Recommended Font Family:** `Inter` (sans-serif) for all text due to its exceptional legibility on digital screens. `JetBrains Mono` for code snippets (future coding platform).

- **Heading 1 (Page Title):** 2.25rem (36px), Bold.
- **Heading 2 (Section Title):** 1.875rem (30px), SemiBold.
- **Heading 3 (Card Title):** 1.5rem (24px), Medium.
- **Body Text (Primary):** 1rem (16px), Regular.
- **Body Text (Secondary):** 0.875rem (14px), Regular (used for dense data tables).
- **Captions & Labels:** 0.75rem (12px), Medium. Uppercase tracking for strict labels (e.g., table headers).
- **Buttons:** 0.875rem (14px), Medium.

---

## 4. Spacing System

Powered by a strict 4pt baseline grid.

- **Margins/Padding:** Scales proportionally (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- **Grid:** 12-column responsive layout. `gap-6` (24px) standard for desktop grids, `gap-4` (16px) for mobile.
- **Container Widths:** Max-width capped at `1280px` (`max-w-7xl`) for dashboards to prevent text lines from becoming unreadably long on ultrawide monitors.
- **Border Radius:** `rounded-lg` (8px) for cards and modals. `rounded-md` (6px) for inputs and buttons. `rounded-full` for avatars and pills.
- **Shadow Levels:**
  - `shadow-sm`: Interactive elements (buttons).
  - `shadow-md`: Default cards.
  - `shadow-lg`: Dropdowns and popovers.
  - `shadow-xl`: Modals and overlapping drawers.

---

## 5. Component Library

- **Buttons:** Primary (solid fill), Secondary (outline), Ghost (text only). Must have distinct `:hover`, `:focus`, and `:disabled` states.
- **Inputs:** Soft gray borders, turning primary color on `:focus`. Error state turns the border and label danger red.
- **Selects:** Custom styled to match inputs, featuring a native-feeling dropdown menu.
- **Checkboxes & Radios:** Primary color accent. Minimum touch target of 44x44px for accessibility.
- **Tables:** Alternating row backgrounds (zebra striping) disabled. Utilize subtle bottom borders to separate rows. Sticky headers for long datasets.
- **Cards:** White surface with `shadow-md` and `rounded-lg`. Used to group related information.
- **Badges:** Small, rounded pills. Color-coded (e.g., Green for "Shortlisted", Gray for "Pending").
- **Alerts:** Banner-style components. Used at the top of pages or forms for context.
- **Toasts:** Floating notifications at the bottom-right. Auto-dismiss after 4 seconds.
- **Modals:** Centered overlay with a dark, semi-transparent backdrop.
- **Drawers:** Slide-out panels from the right edge. Ideal for deep-dive details (e.g., viewing a student profile without leaving the table).
- **Tabs:** Horizontal navigation within a page. Active tab denoted by a thick primary bottom border.
- **Breadcrumbs:** Used in deep hierarchies (e.g., `Jobs > Software Engineer > Applicants`).
- **Pagination:** Simple `Previous [1] [2] [3] Next` structure.
- **Tooltips:** Dark gray background, white text. Appear on hover with a 200ms delay.
- **Avatars:** Circular. If no image is provided, display user initials over a primary-tinted background.
- **Skeleton Loaders:** Pulsing gray blocks that mimic the shape of the content they are replacing.
- **Empty States:** A centered illustration with a friendly message and a primary call-to-action button (e.g., "Post your first job").
- **Loading Indicators:** Primary colored spinners.

---

## 6. Dashboard Layout

- **Sidebar:** Fixed left navigation. Contains primary modules (Dashboard, Jobs, Students, Settings). Collapsible to icons-only on tablet.
- **Top Navigation:** Contains global search, notification bell, and user profile dropdown.
- **Content Area:** Scrollable main area. Features a prominent Page Header and a breadcrumb trail.
- **Footer:** Minimal. Contains copyright and links to support/privacy policies.
- **Role-Based:** The sidebar items automatically morph based on the authenticated user's role (e.g., Students do not see a "Post Job" link).

---

## 7. Forms

- **Validation:** Live client-side validation on `blur` (when the user leaves the field), not on every keystroke.
- **Error Messages:** Explicit text below the input field. Do not rely solely on color to convey errors.
- **Success Messages:** Displayed via Toast notifications upon successful form submission.
- **Loading States:** Forms are locked entirely during submission. The submit button displays a spinner and changes text to "Processing...".
- **Disabled States:** Lower opacity (50%) and `cursor-not-allowed`.

---

## 8. Data Visualization

- **Charts:** Use a standardized charting library (e.g., Recharts or Chart.js). Ensure color contrast between data lines.
- **KPIs (Key Performance Indicators):** Displayed in a top row of 3-4 cards. Features a large number and a smaller delta indicator (e.g., "↑ 12% from last month" in success green).
- **Filters:** Placed above tables or charts. Complex filters are hidden inside a "Filters" drawer to save space.
- **Search:** Prominent search bars above lists. Must include a clear (`x`) button.

---

## 9. Responsive Design

- **Mobile (< 768px):** Sidebar moves to a hidden hamburger menu. Tables transition into stacked cards.
- **Tablet (768px - 1024px):** Layout remains grid-based, but sidebars may collapse. Dual-column layouts transition to single-column.
- **Desktop (> 1024px):** Full utilization of sidebar, deep data tables, and multi-column forms.
- **Large Displays (> 1440px):** Containers max out to prevent the UI from stretching uncomfortably.

---

## 10. Accessibility

- **Keyboard Navigation:** Every interactive element must be reachable via the `Tab` key.
- **ARIA:** Use `aria-label`, `aria-describedby`, and `aria-live` regions for dynamic content (like toasts and form errors).
- **Color Contrast:** All text must meet a 4.5:1 contrast ratio against its background.
- **Focus Indicators:** Explicit `ring-2 ring-primary ring-offset-2` outline on focused elements. Never remove the focus ring without providing a custom alternative.
- **Screen Reader Support:** Ensure semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>` vs `<div>`) is used strictly.

---

## 11. Icons

- **Recommended Library:** `Lucide React` (modern, lightweight, consistent stroke widths).
- **Usage Rules:** Never use an icon alone without a tooltip or visible label unless its meaning is universally understood (like a magnifying glass for search).
- **Sizes:** Standardize on `16px`, `20px` (default), and `24px` to maintain a sharp pixel grid.

---

## 12. Motion

Motion should be purposeful, guiding the user's attention, not distracting them.

- **Transitions:** Fast and subtle. `duration-150 ease-in-out` for hover states.
- **Loading Animations:** Smooth, continuous pulsing for skeletons.
- **Hover Effects:** Slight vertical translation (`-translate-y-0.5`) and increased shadow for cards to indicate clickability.
- **Modal Animations:** A quick `scale-95` to `scale-100` and `opacity-0` to `opacity-100` transition over 200ms.

---

## 13. Branding

- **Logo:** Always placed at the top-left of the sidebar. Links to the home dashboard.
- **Illustrations:** Used sparingly for empty states and onboarding. Must match the primary color theme.
- **Authentication Screens:** A split-screen layout. Left side contains the functional form, right side features a branded graphic or dynamic university campus image to build trust.

---

## 14. Future Expansion

New modules (e.g., Coding Platform, AI Interview) must inherit from the shared `components/` library. 

If a unique, module-specific UI element is needed (like a code editor window), it must utilize the core Color System and Typography scales defined here to ensure the platform feels like a single, cohesive ecosystem.
