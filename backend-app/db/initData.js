const dummyData = require('./dummyData');
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("./sqlManager");
const { v4: uuidv4 } = require("uuid");

const initData = async () => {
  try {
    const { account_heads_data } = dummyData();

    const sql = `
      INSERT INTO tmtb_trhed
      (id, trhed_users, trhed_hednm, trhed_grpnm, trhed_grtyp, trhed_cntyp, trhed_crusr, trhed_upusr)
      VALUES (?, 'admin-id',?, ?, ?, ?, 'admin-id', 'admin-id')
    `;

    for (const head of account_heads_data) {
      const params = [
        head.id,
        head.trhed_hednm,
        head.trhed_grpnm,
        head.trhed_grtyp,
        head.trhed_cntyp,
      ];

      await dbRun(sql, params, `Insert account head ${head.id}`);
    }

    console.log('✅ Dummy account head data inserted successfully');
  } catch (error) {
    console.error('❌ initData error:', error);
  }
};

module.exports = { initData };
