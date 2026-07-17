Use this prompt with an AI coding assistant:

```text
You are a senior Frontend Architect and UI/UX Engineer.

Your task is to transform this React application into a modern, scalable, production-ready ERP frontend framework.

## Objectives

Refactor the entire frontend styling architecture while preserving existing functionality.

### 1. CSS Architecture

Use the following structure:

- index.css
  - Global design system
  - CSS Variables
  - Theme colors
  - Typography
  - Spacing scale
  - Shadows
  - Border radius
  - Animations
  - Utility classes
  - Responsive breakpoints
  - Scrollbars
  - Global reset

- App.css
  - Main application layout
  - Header
  - Footer
  - Content wrapper
  - Navigation
  - Dashboard grid
  - Authentication layouts
  - ERP shell layout

Component-specific styling should remain inside each component CSS file if it exists, but all colors, spacing, fonts, shadows, and sizing must come from the design tokens defined in index.css.

---

## 2. Design System

Create a modern enterprise design system inspired by:

- Ant Design
- Material Design 3
- Shadcn UI
- Chakra UI
- Tailwind CSS
- Salesforce Lightning
- SAP Fiori

Avoid copying any framework.

Create a clean enterprise UI suitable for:

- ERP
- CRM
- HRMS
- Inventory
- Manufacturing
- Finance
- POS
- Healthcare

---

## 3. Theme Variables

Create a complete CSS variable system.

Example:

:root {
    --primary: ...;
    --primary-hover: ...;
    --secondary: ...;
    --success: ...;
    --warning: ...;
    --danger: ...;
    --info: ...;

    --background: ...;
    --surface: ...;
    --surface-alt: ...;

    --text-primary: ...;
    --text-secondary: ...;
    --text-muted: ...;

    --border: ...;
    --border-light: ...;

    --radius-sm;
    --radius-md;
    --radius-lg;

    --shadow-sm;
    --shadow-md;
    --shadow-lg;

    --spacing-xs;
    --spacing-sm;
    --spacing-md;
    --spacing-lg;
    --spacing-xl;

    --transition-fast;
    --transition-normal;
}

Support:

- Light theme
- Dark theme
- High contrast friendly

Use semantic variables only.

Never hardcode colors inside components.

---

## 4. Modern Color Palette

Use a professional enterprise palette.

Characteristics:

- Neutral gray backgrounds
- Blue primary
- Green success
- Orange warning
- Red danger
- Indigo accents

Maintain WCAG AA contrast.

---

## 5. Typography

Modern font stack.

Example:

Inter
Segoe UI
Roboto
System UI

Create typography scale.

Display
H1
H2
H3
H4
Body
Small
Caption

Consistent line heights.

---

## 6. Spacing System

Create an 8px spacing system.

Examples:

4
8
12
16
20
24
32
40
48
64

Use variables everywhere.

---

## 7. Shadows

Provide multiple elevation levels.

Example:

shadow-xs
shadow-sm
shadow-md
shadow-lg
shadow-xl

Soft modern shadows.

---

## 8. Border Radius

Small
Medium
Large
XL
Pill

Consistent everywhere.

---

## 9. Buttons

Create reusable button classes.

Examples:

btn

btn-primary

btn-secondary

btn-success

btn-danger

btn-warning

btn-outline

btn-ghost

btn-link

btn-icon

btn-sm

btn-md

btn-lg

Include:

Hover

Focus

Active

Disabled

Loading

---

## 10. Forms

Modern ERP form styling.

Inputs

Textarea

Select

Checkbox

Radio

Toggle

Date

Time

Search

Autocomplete

Validation states

Floating labels (optional)

---

## 11. Tables

ERP-quality tables.

Features:

Sticky headers

Alternating rows

Hover

Sorting styles

Pagination

Responsive

Selection

Toolbar

Dense mode

Professional appearance.

---

## 12. Cards

Modern cards.

Header

Body

Footer

Actions

Shadow

Hover animation

---

## 13. Top Navigation

Modern top app bar.

Search

Notifications

Profile

Quick actions

Breadcrumbs

Theme switch

---

## 14. Dashboard Layout

Create reusable layouts.

dashboard-grid

stats-card

chart-card

table-card

activity-card

widgets

Responsive grid.

---

## 15. Utility Classes

Create reusable utilities similar to Bootstrap and Tailwind naming.

Examples:

container

container-fluid

row

col

d-flex

flex-column

justify-content-between

justify-content-center

align-items-center

gap-1

gap-2

gap-3

gap-4

gap-5

text-center

text-start

text-end

fw-bold

fw-semibold

fw-normal

rounded

rounded-sm

rounded-lg

shadow

shadow-sm

shadow-lg

w-100

h-100

overflow-hidden

position-relative

sticky-top

mt-1

mt-2

mt-3

mb-1

mb-2

mb-3

p-1

p-2

p-3

p-4

d-none

d-block

grid

grid-2

grid-3

grid-4

Avoid utility duplication.

---

## 16. Component Class Naming

Rename CSS classes throughout the project using a clean, scalable naming convention inspired by modern frameworks.

Examples:

app-shell

app-header

app-content

page

page-header

page-body

card

card-header

card-body

card-footer

table

table-responsive

table-toolbar

form-group

form-label

form-control

form-select

btn

badge

alert

modal

drawer

tabs

tab-panel

navbar

breadcrumb

dropdown

avatar

chip

list-group

accordion

stat-card

widget

layout-grid

section

panel

Avoid vague names like:

left

right

box

wrapper1

container2

newDiv

Use semantic, reusable names.

---

## 17. JSX Refactoring

Update every JSX file.

Replace old class names with the new design system.

Remove duplicated styles.

Remove inline styles.

Use reusable layout classes.

Improve HTML semantic structure.

Improve accessibility.

---

## 18. Responsiveness

Support:

Desktop

Laptop

Tablet

Mobile

Tables become responsive.

Cards wrap correctly.

Navigation adapts.

---

## 19. Accessibility

ARIA where appropriate.

Keyboard navigation.

Visible focus states.

Proper heading hierarchy.

High contrast.

Accessible forms.

---

## 20. Performance

Remove unused CSS.

Avoid duplicated selectors.

Reduce specificity.

Organize CSS logically.

Keep CSS maintainable.

---

## 21. Animations

Subtle transitions only.

Hover

Dropdown

Modal

Toast

Accordion

Loading

No excessive animations.

---

## 22. Production Readiness

Ensure the project becomes a reusable ERP frontend framework suitable for enterprise-scale applications.

The resulting architecture should support:

- Dashboard
- CRM
- Inventory
- Purchasing
- Sales
- HR
- Payroll
- Manufacturing
- Accounting
- POS
- Reporting
- Administration
- Multi-tenant systems

The design should feel modern, premium, clean, and consistent.

---

## 24. Constraints

- Do not change business logic.
- Do not break functionality.
- Preserve routing.
- Preserve API calls.
- Preserve state management.
- Preserve component behavior.
- Refactor styling only.
- Replace inline styles with reusable classes.
- Ensure every JSX file adopts the new design system.
- Ensure all colors, spacing, typography, shadows, and sizing come from CSS variables defined in `index.css`.
- Keep `App.css` focused on application layout, while component styles remain modular and reusable.
- Deliver clean, maintainable, production-ready code suitable as the foundation of a large-scale ERP development framework.
```