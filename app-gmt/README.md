Build a complete React.js enterprise ERP UI design system from scratch.

🎯 Goal

Design a data-heavy ERP interface optimized for long working hours:

Eye-friendly
High readability
Minimal distraction
Fast data scanning
Professional enterprise look
🎨 Design Style Requirements
Primary Theme
Base colors: White + deep green (primary brand color)
Style: Modern enterprise, minimal, data-first
UI effect: Subtle glassmorphism (VERY light, not flashy)
Background: Soft off-white or light gray (not pure white)
Color System
Primary Green: #1B7F5A
Dark Green: #145A41
Light Green Accent: #DFF5EC
Background: #F6F8F7
Surface/Card: rgba(255,255,255,0.75) (glass effect)
Border: #E6ECEA
Text Primary: #1F2A2E
Text Secondary: #6B7C78
Danger: #E5484D
Warning: #F4B740
Info: #2F80ED
🧊 UI Style Rules
Use glassmorphism lightly (blur: 8–12px max, low transparency)
Avoid heavy shadows
No animations except subtle hover transitions (150–200ms)
Must support dense data display
Everything optimized for table-heavy ERP usage
📊 Core Components to Build (from scratch)
1. Layout System
Sidebar (collapsible)
Topbar (search, user profile, notifications)
Responsive grid layout
2. Input Components

Create reusable inputs:

Text input
Number input
Search input
Password input
Select dropdown
Multi-select
Textarea

Features:

Floating labels OR clean inline labels
Focus state with green highlight
Error + success states
Disabled state
3. Table System (VERY IMPORTANT)

Build a high-performance data table:

Features:

Zebra striping rows (very subtle gray/green tint)
Sticky header
Sortable columns
Pagination
Row hover highlight
Checkbox selection
Inline actions column
Optional expandable row

Must support:

Large datasets (ERP use case)
Clean spacing (compact + comfortable modes)
4. Calendar Component
Monthly view + weekly view
Event indicators (green dots/badges)
Click to open detail panel
Clean minimal grid
No heavy colors, only green accents
5. Form System
Responsive form grid (1/2/3 column layout)
Validation messages
Section grouping (card-based)
Save / cancel sticky action bar
6. Buttons

Variants:

Primary (green)
Secondary (outline)
Ghost
Danger

States:

Hover
Active
Disabled
Loading spinner
7. Cards / Panels
Glass-style soft cards
Title + subtitle + content layout
Optional action menu (3-dot)
8. Notifications / Toasts
Success (green)
Error (red)
Info (blue)
Auto dismiss
🧠 UX Principles
Data-first layout
Minimal visual noise
Fast scanning of numbers and tables
Consistent spacing system (8px grid)
Enterprise-grade clarity