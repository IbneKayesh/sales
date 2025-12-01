//example as units.js
const express = require("express");
const router = express.Router();

const {
    runScriptsSequentially,
    dbRun,
    dbGet,
    dbAll,
} = require("../../db/asyncScriptsRunner");

//get all purchase orders
router.get("/", async (req, res) => {
  const { poType, filter } = req.query;
  try {
    let whereClause = "";
    if (poType) {
      whereClause = "WHERE pom.order_type = '" + poType + "' ";
    }
    switch (filter) {
      case "7days":
        whereClause += " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-7 days')";
        break;
      case "30days":
        whereClause += " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-30 days')";
        break;
      case "90days":
        whereClause += " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-90 days')";
        break;
      case "alldays":
        whereClause += " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1";
        break;
      case "default":
      default:
        whereClause += " AND pom.is_paid != 'Paid' OR pom.is_posted = 0 OR pom.is_completed = 0";
        break;
    }
    const sql = `SELECT pom.*, c.contact_name, is_posted as isedit,0 as ismodified
                    FROM po_master pom
                    LEFT JOIN contacts c ON pom.contact_id = c.contact_id
                    ${whereClause}`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
