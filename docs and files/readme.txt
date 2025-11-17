need to organize all process in central


WITH summed_po AS (
    SELECT 
        pc.item_id,
        SUM(pc.item_qty) AS total_qty
    FROM po_child pc
    JOIN po_master pm ON pm.po_master_id = pc.po_master_id
    WHERE pm.order_type = 'Purchase Receive'
      AND pm.ref_no = (SELECT order_no FROM po_master WHERE po_master_id = '8f3299ba-5a6f-400a-ab63-58d7e42c0b0f')
    GROUP BY pc.item_id
)
UPDATE po_child
SET order_qty = (
    SELECT total_qty
    FROM summed_po
    WHERE summed_po.item_id = po_child.item_id
)
WHERE po_master_id = '8f3299ba-5a6f-400a-ab63-58d7e42c0b0f';


-- START TRANSACTION ensures all updates are atomic
BEGIN TRANSACTION;

-- 1️⃣ Set the PB po_master_id you want to recalculate
-- Replace 1 with your PB po_master_id
WITH 
pb_info AS (
    SELECT order_no
    FROM po_master
    WHERE po_master_id = 1
),
-- 2️⃣ Sum all item_qty from all POs referencing this PB
summed_po AS (
    SELECT pc.item_id,
           SUM(pc.item_qty) AS total_qty
    FROM po_child pc
    JOIN po_master pm ON pm.po_master_id = pc.po_master_id
    WHERE pm.order_type = 'PO'
      AND pm.ref_no = (SELECT order_no FROM pb_info)
    GROUP BY pc.item_id
)
-- 3️⃣ Update PB child rows
UPDATE po_child
SET order_qty = (
    SELECT total_qty
    FROM summed_po
    WHERE summed_po.item_id = po_child.item_id
)
WHERE po_master_id = 1
  AND item_id IN (SELECT item_id FROM summed_po);

-- COMMIT the transaction
COMMIT;




PrequestFormComponent.jsx > 
 const { contacts } = useContacts();
 filter only supplier