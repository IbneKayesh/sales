# Supplier Balance Management Context

- Suppliers are stored in `t_contacts.json` (contact_type: "Supplier" or "Both").
- Purchase bookings and receives are managed in `t_po_master.json` (order_type: "Purchase Booking" or "Purchase Receive").
- When a Purchase Booking is made, it increases the supplier's current balance (as an advance payment for products).
- When a Purchase Receive occurs, it reduces the supplier's balance (as the advance is offset by delivered products).
- Example: Purchase Booking of 1000 increases balance to 1000. Purchase Receive of 600 reduces balance to 400 (assuming partial delivery).
- Need to create bank transactions to record these financial movements (e.g., outgoing for booking, incoming for receive adjustments).
- Integration point: In `ClosingProcessPage.jsx`, on save (handleUpdateBankTransaction), handle balance updates and bank transaction creation based on order_type.

## Implementation Steps

- [ ] Modify `app-backend/routes/contacts.js` to allow updating `current_balance` in the update route.
- [ ] Modify `app-backend/routes/closingProcess.js` in the `update-bank-transaction` route to add logic for supplier balance updates and bank transaction creation.
- [ ] Test the implementation by running the closing process and verifying supplier balances and bank transactions.
