app.get("/api/sales", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const offset = (page - 1) * limit;

  const result = await pool.query(`
    SELECT
      s.id,
      s.invoice_no,
      s.sale_date,
      s.customer_id,
      s.total_amount,
      s.status
    FROM sales_master s
    ORDER BY s.sale_date DESC, s.id DESC
    LIMIT $1
    OFFSET $2
  `, [limit, offset]);

  res.json(result.rows);
});
