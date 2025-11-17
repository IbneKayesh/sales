UPDATE po_master
SET is_paid = 1
WHERE is_paid = 0
AND total_amount = paid_amount


--purchase master > total_amount, after insert/update/delete po_child by po_master_id
UPDATE po_master
SET total_amount = (
    SELECT IFNULL(SUM(poc.item_rate * poc.item_qty) - poc.discount_amount, 0)
    FROM po_child poc
    WHERE poc.po_master_id = po_master.po_master_id
)
WHERE po_master_id = '98a51033-dc84-4f1e-9dc5-655501eea408';


--purchase receive > paid_amount, after insert/update/delete po_child by po_master_id when order_type = 'Purchase Receive'
UPDATE po_master
SET paid_amount = total_amount
WHERE ref_no <> 'No Ref'
AND order_type = 'Purchase Receive'
AND po_master_id = '98a51033-dc84-4f1e-9dc5-655501eea408';


--purchase booking > receive qty 
WITH a AS (
    SELECT 
        pom.ref_no,
        poc.item_id,
        SUM(poc.item_qty) AS item_qty
    FROM po_child poc
    JOIN po_master pom 
      ON poc.po_master_id = pom.po_master_id
    WHERE pom.ref_no = 'PB-171125-00001'
    GROUP BY pom.ref_no, poc.item_id
)
UPDATE po_child
SET received_qty = (
    SELECT a.item_qty
    FROM a
	JOIN po_master pom ON a.ref_no = pom.order_no AND pom.po_master_id = po_child.po_master_id
    WHERE a.item_id = po_child.item_id
)
WHERE EXISTS (
    SELECT 1
    FROM a
	JOIN po_master pom ON a.ref_no = pom.order_no AND pom.po_master_id = po_child.po_master_id
    WHERE a.item_id = po_child.item_id
);

--purchase receive > recevied qty
UPDATE po_child
SET received_qty = item_qty
WHERE EXISTS (
    SELECT 1
    FROM po_master pom
    WHERE po_child.po_master_id = pom.po_master_id
      AND pom.order_type = 'Purchase Receive'
      AND pom.po_master_id = ''
);


--purchase booking > full paid then show another flag until complete receive