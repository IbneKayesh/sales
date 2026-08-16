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

don't write extra css, unless required.