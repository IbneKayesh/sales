# TODO: Update SQL CREATE TABLE Statements in app-backend/db/init.js

- [ ] Add ON DELETE RESTRICT to bank_accounts foreign key (bank_id)
- [ ] Add ON DELETE RESTRICT to items foreign keys (category_id, small_unit_id, big_unit_id)
- [ ] Add ON DELETE RESTRICT to bank_transactions foreign key (bank_account_id)
- [ ] Add ON DELETE RESTRICT to po_master foreign key (contacts_id)
- [ ] Add ON DELETE RESTRICT to po_child foreign keys (po_master_id, item_id)
- [ ] Add ON DELETE RESTRICT to so_master foreign key (contacts_id)
- [ ] Add ON DELETE RESTRICT to so_child foreign keys (so_master_id, item_id)
