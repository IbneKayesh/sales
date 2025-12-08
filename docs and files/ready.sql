SELECT con.contact_type, sum(acl.debit_amount)as debit_amount, sum(acl.credit_amount) as credit_amount, sum(acl.debit_amount) - sum(acl.credit_amount) as balance_amount
FROM accounts_ledger acl
LEFT JOIN contacts con on acl.contact_id = con.contact_id
GROUP by con.contact_type
UNION ALL
SELECT 'Inventory' as contact_type, 0 as debit_amount, 0 as credit_amount, sum(pod.cost_price * pod.stock_qty ) inventory_amount
FROM po_details pod
WHERE pod.stock_qty > 0