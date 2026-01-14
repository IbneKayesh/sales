const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { users_users } = req.body;

    // Validate input
    if (!users_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmsb_crgrn tbl
      WHERE tbl.crgrn_users = ?
      ORDER BY tbl.crgrn_isdat DESC`;
    const params = [users_users];

    const rows = await dbGetAll(sql, params, `Get grain for ${users_users}`);
    res.json({
      success: true,
      message: "Grain fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

// generate
router.post("/generate", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    const todayDate ='2026-01-13';
    const tommorrowDate ='2026-01-14';

    const fromDate = `${todayDate} 00:00:00`;
    const toDate = `${tommorrowDate} 00:00:00`;

    //database action
    const sql_find_grains = `SELECT bsins_users, count(id) as crgrn_dbgrn, 'tmab_bsins' as crgrn_tblnm, 'Business' as crgrn_tbltx
    FROM tmab_bsins WHERE bsins_updat >= '${fromDate}' AND bsins_updat < '${toDate}'
    GROUP BY bsins_users
    UNION ALL
    SELECT users_users, count(id) as crgrn_dbgrn, 'tmab_users' as crgrn_tblnm, 'User' as crgrn_tbltx
    FROM tmab_users WHERE users_updat >= '${fromDate}' AND users_updat < '${toDate}'
    GROUP BY users_users
    UNION ALL
    SELECT cntct_users, count(id) as crgrn_dbgrn, 'tmcb_cntct' as crgrn_tblnm, 'Contact' as crgrn_tbltx
    FROM tmcb_cntct WHERE cntct_updat >= '${fromDate}' AND cntct_updat < '${toDate}'
    GROUP BY cntct_users
    UNION ALL
    SELECT bitem_users, count(id) as crgrn_dbgrn, 'tmib_bitem' as crgrn_tblnm, 'Business Item' as crgrn_tbltx
    FROM tmib_bitem WHERE bitem_updat >= '${fromDate}' AND bitem_updat < '${toDate}'
    GROUP BY bitem_users
    UNION ALL
    SELECT ctgry_users, count(id) as crgrn_dbgrn, 'tmib_ctgry' as crgrn_tblnm, 'Item Category' as crgrn_tbltx
    FROM tmib_ctgry WHERE ctgry_updat >= '${fromDate}' AND ctgry_updat < '${toDate}'
    GROUP BY ctgry_users
    UNION ALL
    SELECT items_users, count(id) as crgrn_dbgrn, 'tmib_items' as crgrn_tblnm, 'Item List' as crgrn_tbltx
    FROM tmib_items WHERE items_updat >= '${fromDate}' AND items_updat < '${toDate}'
    GROUP BY items_users
    UNION ALL
    SELECT iuofm_users, count(id) as crgrn_dbgrn, 'tmib_iuofm' as crgrn_tblnm, 'Item Unit' as crgrn_tbltx
    FROM tmib_iuofm WHERE iuofm_updat >= '${fromDate}' AND iuofm_updat < '${toDate}'
    GROUP BY iuofm_users
    UNION ALL
    SELECT crgrn_users, count(id) as crgrn_dbgrn, 'tmsb_crgrn' as crgrn_tblnm, 'Grains' as crgrn_tbltx
    FROM tmsb_crgrn WHERE crgrn_updat >= '${fromDate}' AND crgrn_updat < '${toDate}'
    GROUP BY crgrn_users
    UNION ALL
    SELECT bacts_users, count(id) as crgrn_dbgrn, 'tmtb_bacts' as crgrn_tblnm, 'Business Accounts' as crgrn_tbltx
    FROM tmtb_bacts WHERE bacts_updat >= '${fromDate}' AND bacts_updat < '${toDate}'
    GROUP BY bacts_users
    UNION ALL
    SELECT ledgr_users, count(id) as crgrn_dbgrn, 'tmtb_ledgr' as crgrn_tblnm, 'Accounts Ledger' as crgrn_tbltx
    FROM tmtb_ledgr WHERE ledgr_updat >= '${fromDate}' AND ledgr_updat < '${toDate}'
    GROUP BY ledgr_users
    UNION ALL
    SELECT trhed_users, count(id) as crgrn_dbgrn, 'tmtb_trhed' as crgrn_tblnm, 'Accounts Heads' as crgrn_tbltx
    FROM tmtb_trhed WHERE trhed_updat >= '${fromDate}' AND trhed_updat < '${toDate}'
    GROUP BY trhed_users`;
    const rows = await dbGetAll(sql_find_grains, [], `Find grains`);
    //console.log("rows", rows);
    if (rows.length > 0) {
      rows.forEach(async (row) => {
        const sql = `INSERT tmsb_crgrn (id, crgrn_users, crgrn_bsins, crgrn_tblnm, crgrn_tbltx,
                   crgrn_dbgrn, crgrn_isdat, crgrn_xpdat, crgrn_crusr, crgrn_upusr)
                   VALUES (UUID(), ?, ?, ?, ?,
                   ?, ?, ?, 'sys', 'sys')`;
        const params = [
          row.bsins_users,
          todayDate,
          row.crgrn_tblnm,
          row.crgrn_tbltx,
          row.crgrn_dbgrn,
          fromDate,
          fromDate,
        ];

      const result = await dbRun(sql, params, `Generate grain`);
      //console.log("result", result);
      });
    }

    const sql_update = `UPDATE tmab_users u
    JOIN (
        SELECT
            crgrn_users,
            SUM(crgrn_crgrn) - SUM(crgrn_dbgrn) AS users_nofcr
        FROM tmsb_crgrn
        GROUP BY crgrn_users
    ) g
        ON u.id = g.crgrn_users
    SET u.users_nofcr = g.users_nofcr
    `;
    const result_update = await dbRun(sql_update, [], `Update grain for users`);
    res.json({
      success: true,
      message: "Grain generated successfully",
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

module.exports = router;
