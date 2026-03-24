SELECT 'Sales' as OrderType,
CASE WHEN som.is_posted = 1 THEN 'Posted' ELSE 'Unposted' END as Posting,
sum(som.order_amount)as order_amount, sum(som.discount_amount)as discount_amount, sum(som.vat_amount) as vat_amount, 
sum(som.order_cost) as order_cost, sum(som.total_amount) as total_amount, sum(som.payable_amount) as payable_amount, 
sum(som.paid_amount) as paid_amount, sum(som.due_amount) as due_amount, sum(som.other_cost) as other_cost
FROM so_master som
GROUP by som.is_posted
UNION ALL
SELECT 'Purchase' as OrderType,
CASE WHEN pom.is_posted = 1 THEN 'Posted' ELSE 'Unposted' END as Posting,
sum(pom.order_amount)as order_amount, sum(pom.discount_amount)as discount_amount, sum(pom.vat_amount) as vat_amount, 
sum(pom.order_cost) as order_cost, sum(pom.total_amount) as total_amount, sum(pom.payable_amount) as payable_amount, 
sum(pom.paid_amount) as paid_amount, sum(pom.due_amount) as due_amount, sum(pom.other_cost) as other_cost
FROM po_master pom
GROUP by pom.is_posted