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
