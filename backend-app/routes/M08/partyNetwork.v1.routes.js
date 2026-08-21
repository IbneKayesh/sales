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
    const sql = `SELECT ptn.*, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno, cht.chtac_ntype,
    pty.party_cname, csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_prtyn ptn
    JOIN tmtb_chtac cht ON ptn.prtyn_chtno = cht.chtac_chtno
    LEFT JOIN tmtb_party pty ON ptn.prtyn_party = pty.id AND cht.id = pty.party_chtac
    LEFT JOIN tmhb_emply csr ON ptn.prtyn_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON ptn.prtyn_upusr = usr.id
    WHERE ptn.prtyn_users = $1
    ORDER BY ptn.prtyn_cname, ptn.prtyn_ctype ASC`;

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
    //AND ptn.prtyn_ctype = 'PAYMENTS'
    const sql1 = `SELECT pty.id, pty.party_cname, ptn.prtyn_ctype
        FROM tmtb_prtyn ptn
        JOIN tmtb_party pty ON ptn.prtyn_party = pty.id
        WHERE ptn.prtyn_cname = 'SYS_SALES_INVOICE'
        AND ptn.prtyn_users = $1
        ORDER BY ptn.prtyn_cname, ptn.prtyn_ctype ASC`;


    const sql = `SELECT pty.id, pty.party_cname, pty.party_chtac, ptn.prtyn_ctype, ptn.prtyn_chtno
              FROM tmtb_party pty
              JOIN tmtb_prtyn ptn ON pty.id = ptn.prtyn_party
                        AND pty.party_users = ptn.prtyn_users
                        AND pty.party_bsins = ptn.prtyn_bsins
                        AND pty.party_chtac = ptn.prtyn_chtac
              WHERE pty.party_actve = TRUE
              AND ptn.prtyn_cname = 'SYS_SALES_INVOICE'
              AND ptn.prtyn_ccode = 'MULTIPLE'
              AND ptn.prtyn_users = $1
              ORDER BY ptn.prtyn_ctype, ptn.prtyn_party`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party network sales invoice- ${user_c}`);
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
    //AND ptn.prtyn_ctype = 'PAYMENTS'
    const sql1 = `SELECT pty.id, pty.party_cname, ptn.prtyn_ctype
        FROM tmtb_prtyn ptn
        JOIN tmtb_party pty ON ptn.prtyn_party = pty.id
        WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
        AND ptn.prtyn_users = $1
        ORDER BY ptn.prtyn_cname, ptn.prtyn_ctype ASC`;

    const sql = `SELECT pty.id, pty.party_cname, pty.party_chtac, ptn.prtyn_ctype, ptn.prtyn_chtno
              FROM tmtb_party pty
              JOIN tmtb_prtyn ptn ON pty.id = ptn.prtyn_party
                        AND pty.party_users = ptn.prtyn_users
                        AND pty.party_bsins = ptn.prtyn_bsins
                        AND pty.party_chtac = ptn.prtyn_chtac
              WHERE pty.party_actve = TRUE
              AND ptn.prtyn_cname = 'SYS_MRR_DIRECT'
              AND ptn.prtyn_ccode = 'MULTIPLE'
              AND ptn.prtyn_users = $1
              ORDER BY ptn.prtyn_ctype, ptn.prtyn_party`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party network mrr direct - ${user_c}`);
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
