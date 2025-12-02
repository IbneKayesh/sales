// Delete purchase order master
router.post("/delete", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const sql_master =
    "SELECT order_no FROM po_master WHERE is_posted = 1 AND is_completed = 1 AND po_master_id = ?";
  const masterRow = await dbGet(sql_master, [id]);

  if (!masterRow) {
    return res.status(404).json({ error: "Master not found" });
  }

  const order_no = masterRow.order_no;
  console.log("order_no " + order_no);

  const scripts = [];

  scripts.push({
    label: "Delete Childs",
    sql: "DELETE FROM po_child WHERE po_master_id = ?",
    params: [id],
  });

  scripts.push({
    label: "Delete Payments",
    sql: "DELETE FROM payments WHERE ref_no = ?",
    params: [order_no],
  });

  scripts.push({
    label: "Delete Master",
    sql: "DELETE FROM po_master WHERE po_master_id = ?",
    params: [id],
  });

  const results = await runScriptsSequentially(scripts, {
    useTransaction: true,
  });

  // check master delete success
  const masterResult = results[2];
  if (!masterResult.success || masterResult.changes === 0) {
    return res
      .status(400)
      .json({ error: "Master delete failed or record not found" });
  }

  return res.json({
    message: "Purchase Order deleted successfully!",
    po_master_id: id,
  });
});

module.exports = router;
