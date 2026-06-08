# TODO - Windows 11 UI build

## Step 1: Repo understanding
- [x] Scan structure and identify placeholder widgets


## Step 2: Create CSS structure + widget wrappers
- [x] Add base Windows-11-like CSS variables to `src/index.css`
- [x] Create per-widget CSS files under `src/pages/layout/styles/`
- [x] Update each placeholder component to render a wrapper DOM element and import its CSS


## Step 3: Layout composition
- [ ] Ensure `LayoutUI.jsx`, `DesktopUI.jsx`, `TaskbarUI.jsx`, `FormsUI.jsx` have DOM wrappers/classes for styling

## Step 4: Run + verify
- [ ] Run `npm run dev` and fix any build/import issues
- [ ] Confirm UI renders without runtime errors

