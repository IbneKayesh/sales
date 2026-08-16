read below files need to implement them

phase 5: (ERP desktop-workflow UI audit) — for long office work, new + older users, classic desktop "hard UI" feel (P0=do first, P1=high, P2=medium, P3=polish)

A. eye-strain & readability
[x] [P0] index.css: raise text contrast — --text-muted #9ca3af -> #6b7280, --text-secondary #6b7280 -> #4b5563; keep gray-400 only for placeholder/disabled (A1)
[x] [P0] App.css: .data-table__td font-size var(--fs-xs) -> var(--fs-sm) (13px); 12px only in --dense mode (A2)
[x] [P1] App.css: .page-card__title 15px -> 16px semibold so current task is obvious (A3)

B. button & control sizing
[x] [P0] Button.jsx: fix hardcoded sizes — xs 15/sm 16/md 18/lg 20px -> xs 12/sm 13/md 14/lg 16px; align md height ~36-38px with inputs; drop iconSize 26-32 spinner scale (B4)
[x] [P1] make page-header action buttons (size="sm") visually match form-footer buttons (B5) — sm padding tuned to same height as md

C. desktop "hard UI" structure
[x] [P0] add persistent bottom status bar: company, currency, logged-in user, date (StatusBar component + taskbar sits above it) (C6)
[x] [P1] form section grouping: FormSection component (uppercase title + divider) applied to InvoiceForm & MrrForm (C7)
[P1] record-to-record workflow: Prev/Next record buttons + current-record indicator on forms; Ctrl+S save / F2 edit / Esc back-to-list (C8)
[x] [P1] tighten data-surface structure: page-card radius 16px -> 8px, radius scale flattened for desktop-crisp corners (C9)

D. data tools for heavy management
[x] [P1] sticky totals footer row in DataTable for numeric columns (D10) — showTotals prop, enabled on Invoice/MRR/Price lists
[x] [P1] font-variant-numeric: tabular-nums on all numeric/money columns (D11) — applied to table cells + totals
[P2] per-column filters + saved views beyond global search (D12)
[P2] row selection + bulk actions (delete/activate multiple rows) (D13)

E. feedback & focus
[P1] dirty-state feedback: "Unsaved changes" + enable Save only when form changed (E14)
[P1] consistent strong :focus-visible rings on ALL interactive elements; >=32px hit targets on row action icons (E15)

done already (leave alone): soft theme wash + module shades, 30px inputs, page template, sticky table headers, skeletons, empty states, glass topbar/taskbar, popup windows

phase 7: (UI/UX improvement backlog) — desktop-ERP polish ideas (P0=do first, P1=high, P2=medium, P3=polish)

carried over from phase 5 (still open):
[ ] [P1] record-to-record workflow: Prev/Next record buttons + current-record indicator on forms; Ctrl+S save / F2 edit / Esc back-to-list (C8)
[ ] [P2] per-column filters + saved views beyond global search (D12)
[ ] [P2] row selection + bulk actions (delete/activate multiple rows) (D13)
[ ] [P1] dirty-state feedback: "Unsaved changes" + enable Save only when form changed (E14)
[ ] [P1] consistent strong :focus-visible rings on ALL interactive elements; >=32px hit targets on row action icons (E15)

A. navigation & discovery
[ ] [P0] global command palette (Ctrl+K / F3): fuzzy-search any menu or open-record window
[ ] [P1] topbar global search: search menus + records, arrow-key navigation, Enter to open
[x] [P1] pin/star favorite menus (besides auto-recent) — shown at top of Modules page + taskbar (do it)
[x] [P3] keyboard navigation in tables: arrow keys move row focus, Enter opens record (do it)

B. data tools
[x] [P1] DataTable column reorder + pin + density toggle (comfortable/compact), persisted (do it)
[x] [P1] export list view to CSV/Excel with current filters & totals (do it)`
[ ] [P2] saved views per module (name + filters + column set) with quick-switcher dropdown
[ ] [P2] bulk import (CSV) for setup records (items, contacts, parties)
[x] [P2] pagination polish: persisted per-page size selector + jump-to-page input (do it)

C. forms & records
[ ] [P1] duplicate record button ("Copy as new") on list rows + forms
[ ] [P2] inline field validation with helper text under inputs + highlight on failed submit
[ ] [P2] autosave drafts of long forms to localStorage, restore on reopen
[ ] [P3] Ctrl+Enter to save the current record from any input

D. feedback & states
[ ] [P1] undo toast for destructive actions (delete/close) with short undo window
[ ] [P2] actionable empty states: "Create first invoice" CTA + shortcut hint
[ ] [P2] notification center: persisted read state, filter by type, group by day
[ ] [P3] per-page skeletons instead of full-screen loading blocker

E. popup-window polish
[ ] [P2] snap popup windows to screen edges + cascade new windows; persist position/size per user
[ ] [P2] taskbar window menu: right-click a window button → close/minimize/pin

F. system & accessibility
[ ] [P1] skip-to-content link + full aria audit (labels on icon-only buttons, live regions for toasts)
[ ] [P2] lazy-load routes + code-split big pages (current bundle ~1MB)
[x] [P2] dark theme support: map --theme tokens to a dark palette, auto/manual toggle (do it)
[x] [P3] print-friendly invoice/statement layout (A4) with company header (do it)
[ ] [P3] first-run onboarding tour for new users (3-4 highlight steps)


phase 8:
[x] Dropdown.jsx > optionGrid > when expanded and show horizontal columns in dropdown__grid unable to left right by clicking mouse/dragging the horizontal bar, when click on horizontal bar the dropdown closed
[x] src/pages/M03/mrr/PrintPage.jsx > want to print MrrPage.jsx when its edit mode or after saved to database top company name, address, bin is static text as demo, then use /*.jsx data in print preview, and then print/share/pdf button


general note: don't write extra css, unless required.