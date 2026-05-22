# TODO

## Completed
- [x] Repo exploration: identified frontend hierarchy mismatch (UI lacks `t_projects`) and backend endpoints/schema.
- [x] Read key frontend components and backend API/schema SQL.

## In Progress
- [x] Step 1: Update hooks to include `projects` (`/api/projects`) and targeted refreshers.

- [x] Step 2: Update `App.jsx` + `TabContent.jsx` to carry `selectedProjectId`.


- [ ] Step 3: Refactor `src/components/ProjectsPanel.jsx` to render full hierarchy: Projects → Modules → Submodules → Features → Tables links.
- [ ] Step 4: Ensure selection/expansion resets and default selections work correctly.
- [ ] Step 5: Production-grade UX improvements (validation, better empty states, disable while saving, label standardization).
- [ ] Step 6 (Optional): Update `ErdBoard.jsx` labels to include project grouping.

## Next Steps (after code changes)
- [ ] Run `npm run lint`
- [ ] Run `npm run dev`
- [ ] Manual testing matrix: CRUD per level + table-feature link/unlink + ERD rendering.

