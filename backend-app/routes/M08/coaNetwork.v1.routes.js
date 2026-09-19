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
    const sql = `SELECT *
    FROM tmtb_chtrt crt
    WHERE crt.chtrt_users = $1
    ORDER BY crt.chtrt_trnid, crt.chtrt_pegid, crt.chtrt_grpid,crt.chtrt_chtno,crt.chtrt_route`;
    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account coa- ${user_c}`);
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

// get-by-trn-page-id
router.post("/get-by-trn-page-id", async (req, res) => {
  try {
    const { chtrt_trnid, chtrt_pegid, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!chtrt_trnid || !chtrt_pegid || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cht.*, crt.chtrt_trnid, crt.chtrt_pegid, crt.chtrt_grpid, crt.chtrt_route, crt.chtrt_notes,
    COALESCE(pty.party_id,0) party_count
          FROM tmtb_chtac cht
          JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
          LEFT JOIN (
            SELECT count(id) as party_id, pty.party_chtac
            FROM tmtb_party pty
            WHERE pty.party_users = $1
            GROUP BY pty.party_chtac
          ) pty ON cht.id = pty.party_chtac
          WHERE cht.chtac_users = $1
          AND crt.chtrt_trnid = $2
          AND crt.chtrt_pegid = $3
          AND cht.chtac_ispst = TRUE
          UNION ALL
          SELECT cht.*, 'SYS_EMPTY' chtrt_trnid, 'SYS_EMPTY' chtrt_pegid, 'SYS_EMPTY' chtrt_grpid, 'SYS_EMPTY' chtrt_route, '-' chtrt_notes,
          0 party_count
          FROM tmtb_chtac cht
          WHERE cht.chtac_users = $1
          AND cht.chtac_ispst = FALSE
          ORDER BY party_count`;

    const params = [user_c, chtrt_trnid, chtrt_pegid];
    const rows = await dbGetAll(sql, params, `get coa network- ${user_c}`);
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

// get-por-exp-paym
router.post("/get-por-exp-paym", async (req, res) => {
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
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_PO'
      AND crt.chtrt_pegid = 'SYS_PURCHASE_ORDER'
      AND crt.chtrt_grpid IN ('SYS_AST_PAYMENT','SYS_LIB_LOCAL_VENDOR','SYS_NONE')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      ORDER BY cht.chtac_chtno, pty.party_cname`;
    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get party network purchase order - ${user_c}`,
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

// get-mrr-direct-exp-paym
router.post("/get-mrr-direct-exp-paym", async (req, res) => {
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
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_MRR'
      AND crt.chtrt_pegid = 'SYS_MRR_DIRECT'
      AND crt.chtrt_grpid IN ('SYS_AST_PAYMENT','SYS_LIB_LOCAL_VENDOR')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      AND cht.chtac_bsins = $2
      ORDER BY cht.chtac_chtno, pty.party_cname`;
    const params = [user_c, user_b];
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

// get-mrr-direct-exp-paym-po
router.post("/get-mrr-direct-exp-paym-po", async (req, res) => {
  try {
    const { cntct_id, dpart_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action   
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_MRR'
      AND crt.chtrt_pegid = 'SYS_MRR_DIRECT'
      AND crt.chtrt_grpid IN ('SYS_NONE','SYS_LIB_LOCAL_VENDOR')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      AND cht.chtac_bsins = $2
      UNION ALL
      SELECT pty.id, pty.party_cname, pty.party_crbal party_crbal, pty.party_chtac, cht.chtac_chtno, 'SYS_AST_SUPPLIER' chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      WHERE pty.party_users = $1
      AND pty.party_bsins = $2
      AND pty.party_vndor = $3
      ORDER BY chtac_chtno, party_cname`;
    const params = [user_c, user_b, cntct_id];
    const rows = await dbGetAll(
      sql,
      params,
      `get party network mrr direct po - ${user_c}`,
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

// get-local-paym
router.post("/get-local-paym", async (req, res) => {
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
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_PAYMENT'
      AND crt.chtrt_pegid = 'SYS_PAYMENT_LOCAL'
      AND crt.chtrt_grpid IN ('SYS_AST_PAYMENT')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      ORDER BY cht.chtac_chtno, pty.party_cname`;
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

// get-sales-invoice-exp-paym
router.post("/get-sales-invoice-exp-paym", async (req, res) => {
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
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_SALES'
      AND crt.chtrt_pegid = 'SYS_SALES_INVOICE'
      AND crt.chtrt_grpid IN ('SYS_AST_PAYMENT','SYS_LIB_LOCAL_VENDOR')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      ORDER BY cht.chtac_chtno, pty.party_cname`;
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


// get-sales-invoice-delivery-trip
router.post("/get-sales-invoice-delivery-trip", async (req, res) => {
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
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_DELIVERY_TRIP'
      AND crt.chtrt_pegid = 'SYS_SALES_ORDER'
      AND crt.chtrt_grpid IN ('SYS_EXP_DELIVERY_COST','SYS_NONE')
      AND crt.chtrt_route IN ('OWN','SYS_NONE')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      ORDER BY cht.chtac_chtno, pty.party_cname`;
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



// get-sales-order-posted-by
router.post("/get-sales-order-posted-by", async (req, res) => {
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
    const sql = `SELECT pty.id, pty.party_cname, pty.party_crbal, pty.party_chtac, cht.chtac_chtno, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_SALES'
      AND crt.chtrt_pegid = 'SYS_SALES_ORDER'
      AND crt.chtrt_grpid IN ('SYS_AST_EMPLOYEE_FF','SYS_NONE')
      AND crt.chtrt_route IN ('Field Force','SYS_NONE')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      ORDER BY cht.chtac_chtno, pty.party_cname`;
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
