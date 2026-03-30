const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      ledgr_users,
      ledgr_bsins,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_trdat,
      ledgr_refno,
      search_option,
    } = req.body;

    // Validate input
    if (!ledgr_users || !ledgr_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    let sql = `SELECT dgr.*,bsns.bsins_bname, thed.trhed_hednm,
    cntc.cntct_cntnm, acts.bacts_bankn,
     dgr.ledgr_actve as edit_stop
      FROM tmtb_ledgr dgr
      LEFT JOIN tmsb_bsins bsns ON dgr.ledgr_bsins = bsns.id
      LEFT JOIN tmtb_trhed thed ON dgr.ledgr_trhed = thed.id
      LEFT JOIN tmcb_cntct cntc ON dgr.ledgr_cntct = cntc.id
      LEFT JOIN tmtb_bacts acts ON dgr.ledgr_bacts = acts.id
      WHERE dgr.ledgr_users = $1
      AND dgr.ledgr_bsins = $2`;
    let params = [ledgr_users, ledgr_bsins];

    // Optional filters
    if (ledgr_cntct) {
      params.push(`%${ledgr_cntct}%`);
      sql += ` AND cntc.cntct_cntnm ILIKE $${params.length}`;
    }

    if (ledgr_bacts) {
      params.push(`%${ledgr_bacts}%`);
      sql += ` AND acts.bacts_bankn ILIKE $${params.length}`;
    }

    if (ledgr_trdat) {
      const dateObj = new Date(ledgr_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      params.push(formattedDate);
      sql += ` AND DATE(dgr.ledgr_trdat) = $${params.length}`;
    }

    if (ledgr_refno) {
      params.push(`%${ledgr_refno}%`);
      sql += ` AND dgr.ledgr_refno LIKE $${params.length}`;
    }

    if (search_option) {
      switch (search_option) {
        case "last_3_days":
          sql += ` AND dgr.ledgr_trdat >= CURRENT_DATE - INTERVAL '3 days'`;
          break;
        case "last_7_days":
          sql += ` AND dgr.ledgr_trdat >= CURRENT_DATE - INTERVAL '7 days'`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    } else if (!search_option && params.length === 2) {
      //default 3 days
      sql += ` AND dgr.ledgr_trdat >= CURRENT_DATE - INTERVAL '3 days'`;
    }

    sql += ` ORDER BY dgr.ledgr_crdat DESC`;

    const rows = await dbGetAll(sql, params, `Get ledgers for ${ledgr_users}`);
    res.json({
      success: true,
      message: "Ledgers fetched successfully",
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

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_trhed ||
      !ledgr_cntct ||
      !ledgr_bacts ||
      !ledgr_pymod ||
      !ledgr_trdat ||
      !ledgr_refno ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql_head = "SELECT * FROM tmtb_trhed WHERE id = $1";
    const params_head = [ledgr_trhed];
    const head = await dbGet(sql_head, params_head);

    if (!head) {
      return res.json({
        success: false,
        message: "Source Name is not found",
        data: null,
      });
    }

    let in_value = 0;
    let out_value = 0;

    if (head.trhed_grtyp === "In") {
      in_value = ledgr_dbamt;
    } else {
      out_value = ledgr_dbamt;
    }
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
     $7, $8, $9, $10, $11,
     $12, $13, $14)`,
      params: [
        id,
        ledgr_users,
        ledgr_bsins,
        ledgr_trhed,
        ledgr_cntct,
        ledgr_bacts,
        ledgr_pymod,
        ledgr_trdat,
        ledgr_refno,
        ledgr_notes,
        out_value,
        in_value,
        suser_id,
        suser_id,
      ],
      label: `Created ledger ${ledgr_refno}`,
    });

    scripts.push({
      sql: `UPDATE tmtb_bacts
      SET bacts_crbln = bacts_crbln ${head.trhed_grtyp === "In" ? "+" : "-"} $1,
      bacts_upusr = $2,
      bacts_updat = CURRENT_TIMESTAMP,
      bacts_rvnmr = bacts_rvnmr + 1
      WHERE id = $3`,
      params: [ledgr_dbamt, suser_id, ledgr_bacts],

      label: `Updated balance for ${ledgr_users}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Ledger created successfully",
      data: {
        ...req.body,
      },
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

// update
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
    } = req.body;

    //console.log("create ledger", req.body);

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_trhed ||
      !ledgr_cntct ||
      !ledgr_bacts ||
      !ledgr_pymod ||
      !ledgr_trdat ||
      !ledgr_refno ||
      // !ledgr_dbamt ||
      // !ledgr_cramt ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_ledgr
    SET ledgr_bsins = ?,
    ledgr_trhed = ?,
    ledgr_cntct = ?,
    ledgr_bacts = ?,
    ledgr_pymod = ?,
    ledgr_trdat = ?,
    ledgr_refno = ?,
    ledgr_notes = ?,
    ledgr_dbamt = ?,
    ledgr_cramt = ?,
    ledgr_upusr = ?,
    ledgr_rvnmr = ledgr_rvnmr + 1
    WHERE id = ?`;
    const params = [
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update ledger for ${ledgr_refno}`);
    res.json({
      success: true,
      message: "Ledger updated successfully",
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

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, ledgr_refno } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Ledger ID is required",
        data: null,
      });
    }

    //database action
    const sql = `DELETE FROM tmtb_ledgr
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete ledger for ${ledgr_refno}`);
    res.json({
      success: true,
      message: "Ledger deleted successfully",
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

// create-transfer
router.post("/create-transfer", async (req, res) => {
  try {
    const {
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_bacts_from,
      ledgr_bacts_to,
      ledgr_cntct_from,
      ledgr_cntct_to,
      ledgr_pymod_from,
      ledgr_pymod_to,
      ledgr_trdat,
      ledgr_refno_from,
      ledgr_refno_to,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      suser_id,
    } = req.body;

    //console.log("create transfer", req.body);

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_bacts_from ||
      !ledgr_bacts_to ||
      !ledgr_cntct_from ||
      !ledgr_cntct_to ||
      !ledgr_pymod_from ||
      !ledgr_pymod_to ||
      !ledgr_trdat ||
      !ledgr_refno_from ||
      !ledgr_refno_to ||
      !ledgr_dbamt ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    const dbId = uuidv4();
    const crId = uuidv4();

    //database action
    const sql_head_out = `SELECT *
      FROM tmtb_trhed hed
      WHERE hed.trhed_users = $1
      AND hed.trhed_hednm = 'Balance Transfer Out'`;
    const params_head_out = [ledgr_users];
    const head_out = await dbGet(sql_head_out, params_head_out);

    if (!head_out) {
      return res.json({
        success: false,
        message: "Balance Transfer Out head is not found",
        data: null,
      });
    }

    const sql_head_in = `SELECT *
      FROM tmtb_trhed hed
      WHERE hed.trhed_users = $1
      AND hed.trhed_hednm = 'Balance Transfer In'`;
    const params_head_in = [ledgr_users];
    const head_in = await dbGet(sql_head_in, params_head_in);

    if (!head_in) {
      return res.json({
        success: false,
        message: "Balance Transfer In head is not found",
        data: null,
      });
    }

    const scripts = [];

    //debit amount
    scripts.push({
      sql: `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
     $7, $8, $9, $10, $11, 
     $12, $13, $14)`,
      params: [
        dbId,
        ledgr_users,
        ledgr_bsins,
        head_out.id,
        ledgr_cntct_from,
        ledgr_bacts_from,
        ledgr_pymod_from,
        ledgr_trdat,
        ledgr_refno_from,
        ledgr_notes,
        ledgr_dbamt,
        0,
        suser_id,
        suser_id,
      ],
      label: `Created debit ${ledgr_refno_from}`,
    });

    //credit amount
    scripts.push({
      sql: `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
     $7, $8, $9, $10, $11, 
     $12, $13, $14)`,
      params: [
        crId,
        ledgr_users,
        ledgr_bsins,
        head_in.id,
        ledgr_cntct_to,
        ledgr_bacts_to,
        ledgr_pymod_to,
        ledgr_trdat,
        ledgr_refno_to,
        ledgr_notes,
        0,
        ledgr_dbamt,
        suser_id,
        suser_id,
      ],
      label: `Created credit ${ledgr_refno_to}`,
    });

    //update debit balance
    scripts.push({
      sql: `UPDATE tmtb_bacts
      SET bacts_crbln = bacts_crbln - $1,
      bacts_upusr = $2,
      bacts_updat = CURRENT_TIMESTAMP,
      bacts_rvnmr = bacts_rvnmr + 1
      WHERE id = $3`,
      params: [ledgr_dbamt, suser_id, ledgr_bacts_from],

      label: `Updated debit balance for ${ledgr_bacts_from}`,
    });

    //update credit balance
    scripts.push({
      sql: `UPDATE tmtb_bacts
      SET bacts_crbln = bacts_crbln + $1,
      bacts_upusr = $2,
      bacts_updat = CURRENT_TIMESTAMP,
      bacts_rvnmr = bacts_rvnmr + 1
      WHERE id = $3`,
      params: [ledgr_dbamt, suser_id, ledgr_bacts_to],

      label: `Updated credit balance for ${ledgr_bacts_to}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Ledger transfer created successfully",
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

// get all payment advice
router.post("/payment-advice", async (req, res) => {
  try {
    const { payad_users, payad_bsins, payad_srcnm } = req.body;

    // Validate input
    if (!payad_srcnm) {
      return res.json({
        success: false,
        message: "Source ID is required",
        data: null,
      });
    }

    //console.log("req.body", req.body);

    //const sql_head = "SELECT * FROM tmtb_trhed WHERE id = $1";
    const sql_head = `SELECT hed.id, hed.trhed_hednm, COALESCE(ctg.id, 'none') AS exctg_trhed
          FROM tmtb_trhed hed
          LEFT JOIN tmtb_exctg ctg ON ctg.exctg_trhed = hed.id
          WHERE hed.id = $1`;
    const params_head = [payad_srcnm];
    const head = await dbGet(sql_head, params_head);

    if (!head) {
      return res.json({
        success: false,
        message: "Source Name is not found",
        data: null,
      });
    }

    //console.log("head", head);
    //return;

    //database action

    let sql = "";
    if (head.trhed_hednm === "Purchase Invoice") {
      sql = `SELECT pbl.paybl_users AS payad_users, pbl.paybl_bsins AS payad_bsins,
      pbl.paybl_srcnm AS payad_srcnm, pbl.id AS payad_refid, 
      pbl.paybl_trdat AS payad_trdat, pbl.paybl_dbamt AS payad_rfamt,
      pbl.paybl_refno AS payad_refno, pbl.paybl_descr AS payad_descr,
	    pbl.paybl_cntct AS payad_cntct, cnt.cntct_cntnm
      FROM tmtb_paybl pbl
      JOIN tmcb_cntct cnt ON pbl.paybl_cntct = cnt.id
      LEFT JOIN tmtb_payad adv ON pbl.paybl_users = adv.payad_users
      AND pbl.paybl_bsins = adv.payad_bsins
      AND pbl.paybl_srcnm = adv.payad_srcnm
      AND pbl.id = adv.payad_refid
      WHERE pbl.paybl_dbamt > 0
      AND adv.payad_refid IS NULL
      AND pbl.paybl_users = $1
      AND pbl.paybl_bsins = $2
      `;
    } else if (head.trhed_hednm === "Purchase Expenses") {
      sql = `SELECT xpn.expns_users AS payad_users, xpn.expns_bsins AS payad_bsins,
      xpn.expns_srcnm AS payad_srcnm, xpn.id AS payad_refid,
      xpn.expns_trdat AS payad_trdat, xpn.expns_xpamt AS payad_rfamt,
      xpn.expns_refno AS payad_refno, xpn.expns_notes AS payad_descr,
      xpn.expns_cntct AS payad_cntct, cnt.cntct_cntnm
      FROM tmpb_expns xpn
      JOIN tmcb_cntct cnt ON xpn.expns_cntct = cnt.id
      LEFT JOIN tmtb_payad adv ON xpn.expns_users = adv.payad_users
      AND xpn.expns_bsins = adv.payad_bsins
      AND xpn.expns_srcnm = adv.payad_srcnm
      AND xpn.id = adv.payad_refid
      WHERE xpn.expns_inexc = FALSE
      AND xpn.expns_xpamt > 0
      AND adv.payad_refid IS NULL
      AND xpn.expns_users = $1
      AND xpn.expns_bsins = $2`;
    } else if (head.trhed_hednm === "Sales Expenses") {
      sql = `SELECT xpn.expns_users AS payad_users, xpn.expns_bsins AS payad_bsins,
      xpn.expns_srcnm AS payad_srcnm, xpn.id AS payad_refid,
      xpn.expns_trdat AS payad_trdat, xpn.expns_xpamt AS payad_rfamt,
      xpn.expns_refno AS payad_refno, xpn.expns_notes AS payad_descr,
      xpn.expns_cntct AS payad_cntct, cnt.cntct_cntnm
      FROM tmeb_expns xpn
      JOIN tmcb_cntct cnt ON xpn.expns_cntct = cnt.id
      LEFT JOIN tmtb_payad adv ON xpn.expns_users = adv.payad_users
      AND xpn.expns_bsins = adv.payad_bsins
      AND xpn.expns_srcnm = adv.payad_srcnm
      AND xpn.id = adv.payad_refid
      WHERE xpn.expns_inexc = FALSE
      AND xpn.expns_xpamt > 0
      AND adv.payad_refid IS NULL
      AND xpn.expns_users = $1
      AND xpn.expns_bsins = $2`;
    } else if (head.trhed_hednm === "Sales Invoice") {
      sql = `SELECT pbl.rcvbl_users AS payad_users, pbl.rcvbl_bsins AS payad_bsins,
      pbl.rcvbl_srcnm AS payad_srcnm, pbl.id AS payad_refid, 
      pbl.rcvbl_trdat AS payad_trdat, pbl.rcvbl_dbamt AS payad_rfamt,
      pbl.rcvbl_refno AS payad_refno, pbl.rcvbl_descr AS payad_descr,
	    pbl.rcvbl_cntct AS payad_cntct, cnt.cntct_cntnm
      FROM tmtb_rcvbl pbl
      JOIN tmcb_cntct cnt ON pbl.rcvbl_cntct = cnt.id
      LEFT JOIN tmtb_payad adv ON pbl.rcvbl_users = adv.payad_users
      AND pbl.rcvbl_bsins = adv.payad_bsins
      AND pbl.rcvbl_srcnm = adv.payad_srcnm
      AND pbl.id = adv.payad_refid
      WHERE pbl.rcvbl_dbamt > 0
      AND adv.payad_refid IS NULL
      AND pbl.rcvbl_users = $1
      AND pbl.rcvbl_bsins = $2
      `;
    } else if (head.exctg_trhed !== "None") {
      sql = `SELECT pbl.exptr_users AS payad_users, pbl.exptr_bsins AS payad_bsins,
      '${head.trhed_hednm}' AS payad_srcnm, pbl.id AS payad_refid, 
      pbl.exptr_trdat AS payad_trdat, pbl.exptr_examt AS payad_rfamt,
      pbl.exptr_trnte AS payad_refno, ctg.exctg_cname AS payad_descr,
	  cnt.id AS payad_cntct, cnt.cntct_cntnm
      FROM tmtb_exptr pbl
      JOIN tmtb_exctg ctg ON pbl.exptr_exctg = ctg.id
      CROSS JOIN tmcb_cntct cnt	  
      LEFT JOIN tmtb_payad adv ON pbl.exptr_users = adv.payad_users
      AND pbl.exptr_bsins = adv.payad_bsins
      AND pbl.id = adv.payad_refid
      WHERE pbl.exptr_examt > 0
      AND adv.payad_refid IS NULL
	    AND cnt.cntct_ctype = 'Internal'
      AND pbl.exptr_users = $1
      AND pbl.exptr_bsins = $2
      `;
    } else {
      res.json({
        success: false,
        message: "Payment Advice not found",
        data: null,
      });
    }

    const params = [payad_users, payad_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get payment advice for ${payad_srcnm}`,
    );
    res.json({
      success: true,
      message: "Payment Advice fetched successfully",
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

// add-ledger-payment-advice
router.post("/add-ledger-payment-advice", async (req, res) => {
  try {
    const {
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_isref,
      ledgr_dbamt,
      ledgr_cramt,
      muser_id,
      suser_id,
      tmtb_payad,
    } = req.body;

    //console.log("req.body", req.body);

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_trhed ||
      !ledgr_cntct ||
      !ledgr_bacts ||
      !ledgr_pymod ||
      !ledgr_refno ||
      !ledgr_dbamt ||
      !muser_id ||
      !suser_id ||
      !tmtb_payad
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }
    //return;

    //database action
    const sql_head = "SELECT * FROM tmtb_trhed WHERE id = $1";
    const params_head = [ledgr_trhed];
    const head = await dbGet(sql_head, params_head);

    if (!head) {
      return res.json({
        success: false,
        message: "Source Name is not found",
        data: null,
      });
    }

    //console.log("head", head);
    let in_value = 0;
    let out_value = 0;

    if (head.trhed_grtyp === "In") {
      in_value = ledgr_dbamt;
    } else {
      out_value = ledgr_dbamt;
    }

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_isref, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
     $7, $8, $9, $10, $11, $12, 
     $13, $14, $15)`,
      params: [
        id,
        ledgr_users,
        ledgr_bsins,
        ledgr_trhed,
        ledgr_cntct,
        ledgr_bacts,
        ledgr_pymod,
        ledgr_trdat,
        ledgr_refno,
        ledgr_notes,
        ledgr_isref,
        out_value,
        in_value,
        suser_id,
        suser_id,
      ],
      label: `Created ledger ${ledgr_users}`,
    });

    //console.log("scripts",scripts)
    //return;

    //insert advice list
    for (const det of tmtb_payad) {
      scripts.push({
        sql: `INSERT INTO tmtb_payad
    (id, payad_users, payad_bsins, payad_ledgr, payad_srcnm, payad_refid, payad_trdat,
     payad_rfamt, payad_refno, payad_descr, payad_crusr, payad_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,  $7,
    $8, $9, $10, $11, $12)`,
        params: [
          uuidv4(),
          det.payad_users,
          det.payad_bsins,
          id,
          det.payad_srcnm,
          det.payad_refid,
          det.payad_trdat,
          det.payad_rfamt,
          det.payad_refno,
          det.payad_descr,
          suser_id,
          suser_id,
        ],

        label: `Created advice for ${det.payad_srcnm}`,
      });
    }

    scripts.push({
      sql: `UPDATE tmtb_bacts
      SET bacts_crbln = bacts_crbln ${head.trhed_grtyp === "In" ? "+" : "-"} $1,
      bacts_upusr = $2,
      bacts_updat = CURRENT_TIMESTAMP,
      bacts_rvnmr = bacts_rvnmr + 1
      WHERE id = $3`,
      params: [ledgr_dbamt, suser_id, ledgr_bacts],

      label: `Updated balance for ${ledgr_users}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Advice created successfully",
      data: {
        ...req.body,
      },
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

// get all ledger-payment-advice
router.post("/ledger-payment-advice", async (req, res) => {
  try {
    const { payad_ledgr } = req.body;

    // Validate input
    if (!payad_ledgr) {
      return res.json({
        success: false,
        message: "Ledger ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT *
    FROM tmtb_payad pay
    WHERE pay.payad_ledgr = $1`;
    const params = [payad_ledgr];

    const rows = await dbGetAll(sql, params, `Get ledgers for ${payad_ledgr}`);
    res.json({
      success: true,
      message: "Ledgers fetched successfully",
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

module.exports = router;
