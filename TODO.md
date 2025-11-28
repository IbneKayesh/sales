# TODO: Update closingProcess.js Routes

- [x] Add import for `runScriptsSequentially` from `../db/asyncScriptsRunner.js` in `closingProcess.js`
- [x] Remove the `/process-all` route from `closingProcess.js`
- [x] Add a new `/update-purchase` route in `closingProcess.js` with logic from `processInvoiceData` (define scripts array and call `runScriptsSequentially`)
- [ ] Test the new `/update-purchase` route to ensure it executes SQL updates correctly
- [ ] Verify that the `/update-item` route still works as expected
- [ ] Optionally, remove `processInvoiceData` from `dbproc.js` if no longer needed (confirm first)
