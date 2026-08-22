const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT ptr.*, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno, cht.chtac_ntype,
    pty.party_cname, csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_prtyr ptr
    JOIN tmtb_chtac cht ON ptr.prtyr_chtno = cht.chtac_chtno
    LEFT JOIN tmtb_party pty ON ptr.prtyr_party = pty.id AND cht.id = pty.party_chtac
    LEFT JOIN tmhb_emply csr ON ptr.prtyr_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON ptr.prtyr_upusr = usr.id
    WHERE ptr.prtyr_users = $1
    ORDER BY ptr.prtyr_mgrup, ptr.prtyr_sgrup ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party network- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// sales-invoice
router.post("/sales-invoice", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    //AND ptr.prtyn_ctype = 'PAYMENTS'
    const sql = `SELECT pty.id, pty.party_cname, pty.party_chtac, pty.party_crbal, ptr.prtyr_sgrup, cht.chtac_chtno
                FROM tmtb_party pty
                JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
                          AND cht.chtac_jvpst = 'MULTIPLE'
                          AND cht.chtac_actve = TRUE
                JOIN tmtb_prtyr ptr ON cht.chtac_chtno = ptr.prtyr_chtno
                WHERE ptr.prtyr_mgrup = 'SYS_SALES_INVOICE'
                AND pty.party_actve = TRUE
                AND ptr.prtyr_actve = TRUE
                AND ptr.prtyr_users = $1                
                ORDER BY cht.chtac_chtno, pty.party_cname, ptr.prtyr_sgrup`;

    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get party network sales invoice- ${user_c}`,
    );
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// mrr-direct
router.post("/mrr-direct", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT pty.id, pty.party_cname, pty.party_chtac, pty.party_crbal, ptr.prtyr_sgrup, cht.chtac_chtno
                FROM tmtb_party pty
                JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
                          AND cht.chtac_jvpst = 'MULTIPLE'
                          AND cht.chtac_actve = TRUE
                JOIN tmtb_prtyr ptr ON cht.chtac_chtno = ptr.prtyr_chtno
                WHERE ptr.prtyr_mgrup = 'SYS_MRR_DIRECT'
                AND pty.party_actve = TRUE
                AND ptr.prtyr_actve = TRUE
                AND ptr.prtyr_users = $1                
                ORDER BY cht.chtac_chtno, pty.party_cname, ptr.prtyr_sgrup`;
    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get party network mrr direct - ${user_c}`,
    );
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

module.exports = router;
