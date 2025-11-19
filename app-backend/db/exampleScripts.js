// exampleScripts.js
const { runScriptsSequentially } = require("./asyncScriptsRunner");

// Example: processing an order
async function processOrder(orderId) {
  const scripts = [
    {
      label: "Calculate child totals",
      sql: "UPDATE order_child SET total = qty * price WHERE order_id = ?",
      params: [orderId]
    },
    {
      label: "Update child rows",
      sql: "UPDATE order_child SET updated_at = CURRENT_TIMESTAMP WHERE order_id = ?",
      params: [orderId]
    },
    {
      label: "Update master order from child totals",
      sql: "UPDATE order_master SET total = (SELECT SUM(total) FROM order_child WHERE order_id = ?) WHERE id = ?",
      params: [orderId, orderId]
    },
    {
      label: "Update customer balance using master order",
      sql: "UPDATE customer SET balance = balance + (SELECT total FROM order_master WHERE id = ?) WHERE id = (SELECT customer_id FROM order_master WHERE id = ?)",
      params: [orderId, orderId]
    },
    {
      label: "Insert audit log",
      sql: "INSERT INTO audit_log (order_id, message) VALUES (?, ?)",
      params: [orderId, "Order processing script completed"]
    }
  ];

  const results = await runScriptsSequentially(scripts);

  console.log("\n📦 FINAL RESULT TABLE:");
  console.table(results);
}

//processOrder(101);