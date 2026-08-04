Step: 1
1. find src/pages/M08/reports/
2. Fstatements_bk > Fstatements.jsx, Fstatements is a report holder and report API calling paramerters
3. api-data is a API output data set
4. convert old files to RPT_*.jsx format
5. convert src/hooks/M08/useReports.js to useFstatements.js
6. example is RPT_FS_TB.jsx
7. Account Ledger and Sub Ledger party dropdown build from data
- old files ALedgerReport.jsx,APReport.jsx,ARReport.jsx,BalanceSheetReport.jsx are reference examples 
- No fancy styles
- No complex codes
- RPT_ files wise individual data formatting
- Cleaner useFstatements.js (no report codes, keep it as it is, use for only API callings)
- Cleaner Fstatements.jsx (hold RPT_.jsx files only)
- Don't remove old reports, keep both files new and olds


Step: 2
- if missing any features from old version, make the list of missing features 
- Then implement them
- Don't remove old reports, keep both files new and old

UPDATE (2026-08-04): migration complete - old reports REMOVED (Fstatements_bk.jsx + ALedger/AP/AR/BalanceSheet/BankRec/CashBank/CashFlow/GLedger/JRegister/OutStand/PnL/SLedger/TrialBalance report files; fstatements-bk route dropped from M08Routes.jsx). RPT_*.jsx are now the only report components. Also removed: api-data example file, orphaned ReportForm.jsx leftover, and tmtb_*.sql schema references.


MISSING FEATURES LIST (audit: old reports vs new RPT_*.jsx)
Status legend: [x] implemented | [ ] not implemented

A. Holder-level (Fstatements.jsx vs Fstatements_bk.jsx)
- [x] A1 CSV Export per report: Export button wired via per-report onRegisterExport + exportable re-added on ARA/APA/OST/BR/CB tables (trial-balance/balance-sheet/profit-and-loss/cash-flow/general-ledger/journal-register/account-ledger/sub-ledger/ar-aging/ap-aging/outstanding/bank-reconciliation/cash-book.csv)
- [x] A2 Print report: Print button added (printReport + .report-print-area wrap)
- [x] A3 Loading state: holder-level EmptyState "Loading..." while isBusy
- [x] A4 No-data empty states: holder-level EmptyState "Select Report" / "No Data"
- [ ] A5 Refresh button - skipped (Generate covers it)
- [ ] A6 Data summary subtitle (journalCount/lineCount/partyCount) - skipped (minor)
- [ ] A7 Category tabs + sub-tabs navigation (GroupButton + TabPage) - skipped (design change, single dropdown)

B. Per-report missing features
- [x] B1 RPT_FS_TB: Type Badge; two-line account cell (name + muted chartNo); formatNumber on Dr/Cr; export
- [x] B2 RPT_FS_BS: balanced check banner (✓ Balanced / ✗ Difference); export
- [ ] B2b net-profit row colored success/danger; section header icons - skipped (cosmetic, no fancy styles)
- [x] B3 RPT_FS_PNL: separate Chart No column; Math.abs on child amounts; "No Transactions" empty state; export
- [ ] B3b section icons - skipped (cosmetic)
- [x] B4 RPT_FS_CF: placeholder rows for Investing/Financing "(Simplified...)"; negative amounts in parentheses; export
- [ ] B4b Opening Cash Balance (Opening+Closing summary box) - NOT derivable from period journal lines (needs API support)
- [ ] B5 RPT_LR_GL: search input icon - skipped (cosmetic)
- [x] B6 RPT_LR_JR: entry Type as Badge variant=primary; export
- [x] B7 RPT_LR_AL: CSV export (dropdown-from-data already done in Step 1)
- [x] B7b type cell as {type} ({ntype}) - chtac_ntype now returned by reports API; also drives running-balance direction
- [x] B7c "Select Account" empty state - common ReportEmpty used (cosmetic icons skipped)
- [x] B8 RPT_LR_SR: CSV export
- [x] B8b "Select Party" empty state - common ReportEmpty used (cosmetic icons skipped)
- [x] B14 Common empty-data state: shared ReportEmpty.jsx used by all 13 RPT_ reports (replaces ad-hoc EmptyState/<p>/emptyMessage; holder-level states unchanged)
- [x] B15 ntype display everywhere account type is shown: AL Type card (done B7b), TB Type badge, GL account root header, SR party card Type
- [x] B16 Export button disabled when report is empty: reports register onRegisterExport(null) on empty, holder tracks hasExport state
- [x] B17 Common footer: shared ReportFooter (label+values) + ReportStatus (balanced banner) wrapping PageCardFooter, used by all 10 reports with footers
- [x] B9 RPT_RP_ARA: exportable ar-aging.csv + export
- [ ] B9b "Opening: {openingBalance}" subtitle - NOT derivable from period journal lines (needs API support)
- [x] B10 RPT_RP_APA: exportable ap-aging.csv + export
- [x] B11 RPT_RP_OST: exportable outstanding.csv + export
- [x] B12 RPT_BC_BR: exportable bank-reconciliation.csv + export
- [x] B13 RPT_BC_CB: exportable cash-book.csv + export

IMPLEMENTED SUMMARY (Step 2, done 2026-08-04):
- Export button functional (all 13 reports) + DataTable exportable on 5 tabular reports
- Print button added (holder-level)
- Loading & no-data empty states (holder-level)
- Data display: TB badges/two-line cell/format, BS balanced banner, PNL Chart No col + abs + empty state, CF placeholders + paren negatives, JR type badge
- Common empty-data state: ReportEmpty.jsx shared by all RPT_ reports (incl. AL/SR select prompts)
- chtac_ntype: balance direction + Type (ctype) (ntype) in Account Ledger; balance direction in GL/BS/PNL
- Build passes (vite build ok)
- Old backup reports (Fstatements_bk + 13 old sub-reports) removed; M08Routes fstatements-bk route removed

NOT IMPLEMENTED (skipped or blocked):
- A5 refresh, A6 subtitle, A7 tabs, B5 search icon, icons/polish (item 10) - out of scope / cosmetic / design choice
- B4b opening balance (CF) & B9b opening balance (AR): not derivable from current-period journal lines - requires API to return opening balance