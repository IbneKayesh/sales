const dummyData = require("./dummyData");
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("./sqlManager");
const { v4: uuidv4 } = require("uuid");

const initData = async () => {
  try {
    const {
      sales_data,
      purchase_data,
      inventory_data,
      transfer_data,
      income_data,
      expenditure_data,
      expense_data,
      asset_data,
      vat_data,
      tax_data,
      hr_data,
    } = dummyData();

    const sql = `
      INSERT INTO tmtb_trhed
      (id, trhed_users, trhed_hednm, trhed_grpnm, trhed_grtyp, trhed_cntyp, trhed_crusr, trhed_upusr)
      VALUES (?, 'admin-id',?, ?, ?, ?, 'admin-id', 'admin-id')
    `;

    for (const line of sales_data) {
      const params = [
        line.id,
        line.trhed_hednm,
        line.trhed_grpnm,
        line.trhed_grtyp,
        line.trhed_cntyp,
      ];

      await dbRun(sql, params, `Insert account head ${line.id}`);
    }

    console.log("✅ Dummy account head data inserted successfully");
  } catch (error) {
    console.error("❌ initData error:", error);
  }
};

module.exports = { initData };
