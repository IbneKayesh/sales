const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode, GenNewTrn } = require("../../db/genHelper");

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
    const sql = `SELECT inv.*, dpt.dpart_cname, cnt.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_invcm inv
    JOIN tmsb_dpart dpt ON inv.invcm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON inv.invcm_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON inv.invcm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON inv.invcm_upusr = usr.id
    WHERE inv.invcm_users = $1
    ORDER BY inv.invcm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Invoice- ${user_c}`);
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

// get-all-active
router.post("/get-all-active", async (req, res) => {
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
    const sql = `SELECT inv.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_invcm inv
    LEFT JOIN tmhb_emply csr ON inv.invcm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON inv.invcm_upusr = usr.id
    WHERE inv.invcm_users = $1
    AND inv.invcm_actve = TRUE
    ORDER BY inv.invcm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get invoice- ${user_c}`);
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

const create = async (req, res) => {
  try {
    const {
      id,
      invcm_users,
      invcm_bsins,
      invcm_dpart,
      invcm_crncy,
      invcm_cntct,
      invcm_ttype,
      invcm_trnno,
      invcm_trdat,
      invcm_refno,
      invcm_notes,
      invcm_tramt,
      invcm_itmds,
      invcm_dspct,
      invcm_invds,
      invcm_lylds,
      invcm_vtamt,
      invcm_icamt,
      invcm_ecamt,
      invcm_pyamt,
      invcm_pdamt,
      invcm_duamt,
      invcm_exrat,
      invcm_ispst,
      invcm_ispad,
      invcm_isapp,
      tmob_invcc,
      tmob_invcs,
      tmob_invpy,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !invcm_dpart ||
      !invcm_crncy ||
      !invcm_cntct ||
      !invcm_ttype ||
      !invcm_exrat ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newId = uuidv4();
    //const newCode = await GenNewCode(user_c, "tmob_invcm");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmob_invcm",
      invcm_ttype, //"Material Receipt Report",
      invcm_dpart,
    );
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmob_invcm(id, invcm_users, invcm_bsins, invcm_dpart, invcm_crncy, invcm_cntct,
      invcm_ttype, invcm_trnno, invcm_trdat, invcm_refno, invcm_notes, invcm_tramt,
      invcm_itmds, invcm_dspct, invcm_invds, invcm_lylds, invcm_vtamt, invcm_icamt,
      invcm_ecamt, invcm_pyamt, invcm_pdamt, invcm_duamt, invcm_exrat, invcm_ispst,
      invcm_ispad, invcm_isapp, invcm_crusr, invcm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28)`,
      params: [
        newId,
        user_c,
        user_b,
        invcm_dpart,
        invcm_crncy,
        invcm_cntct,
        invcm_ttype,
        newTrnNo,
        invcm_trdat,
        invcm_refno,
        invcm_notes,
        invcm_tramt || 0,
        invcm_itmds || 0,
        invcm_dspct || 0,
        invcm_invds || 0,
        invcm_lylds || 0,
        invcm_vtamt || 0,
        invcm_icamt || 0,
        invcm_ecamt || 0,
        invcm_pyamt || 0,
        invcm_pdamt || 0,
        invcm_duamt || 0,
        invcm_exrat || 1,
        true,
        invcm_ispad,
        true,
        user_s,
        user_s,
      ],
      label: `Created MRR ${newTrnNo}`,
    });

    //Insert Sales details, Reduce Stock Details
    for (const det of tmob_invcc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_invcc(id, invcc_users, invcc_bsins, invcc_invcm, invcc_price, invcc_items,
        invcc_units, invcc_itrat, invcc_itqty, invcc_itamt, invcc_dspct, invcc_dsamt,
        invcc_edamt, invcc_vtpct, invcc_vtamt, invcc_icamt, invcc_ecamt, invcc_ntamt, 
        invcc_notes, invcc_csrat, invcc_nsrat, invcc_refid, invcc_stock, invcc_crusr,
        invcc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.invcc_price,
          det.invcc_items,
          det.invcc_units,
          det.invcc_itrat || 0,
          det.invcc_itqty || 0,
          det.invcc_itamt || 0,
          det.invcc_dspct || 0,
          det.invcc_dsamt || 0,
          det.invcc_edamt || 0,
          det.invcc_vtpct || 0,
          det.invcc_vtamt || 0,
          det.invcc_icamt || 0,
          det.invcc_ecamt || 0,
          det.invcc_ntamt || 0,
          det.invcc_notes || "",
          det.invcc_csrat || 0,
          det.invcc_nsrat || 0,
          det.invcc_refid || "",
          det.invcc_stock || "",
          user_s,
          user_s,
        ],
        label: `Created Sales detail ${newTrnNo}`,
      });

      //add condition if no tracking then off
      scripts.push({
        sql: `UPDATE tmib_stock
        SET stock_slqty = stock_slqty + $1,
            stock_ohqty = stock_ohqty - $2,
            stock_upusr = $3,
            stock_updat = CURRENT_TIMESTAMP,
            stock_rvnmr = stock_rvnmr + 1
        WHERE id = $4
        AND stock_users = $5
        AND stock_bsins = $6
        AND stock_dpart = $7`,
        params: [
          det.invcc_itqty || 0,
          det.invcc_itqty || 0,
          user_s,
          det.invcc_stock || "",
          user_c,
          user_b,
          invcm_dpart,
        ],
        label: `Update stock detail ${newTrnNo}`,
      });
      //update summary stock
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_gdstk = price_gdstk - $1,
                  price_upusr = $2,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $3
                  AND price_users = $4
                  AND price_items = $5`,
        params: [
          det.invcc_itqty || 0,
          user_s,
          det.invcc_price,
          user_c,
          det.invcc_items,
        ],
        label: `Update price stock detail ${newTrnNo}`,
      });
    }

    //Insert Costing details
    // for (const det of tmpb_mrrcs) {
    //   scripts.push({
    //     sql: `INSERT INTO tmpb_mrrcs(id, mrrcs_users, mrrcs_bsins, mrrcs_mrrdm, mrrcs_party, mrrcs_csmod, 
    //     mrrcs_clmod, mrrcs_value, mrrcs_notes, mrrcs_crusr, mrrcs_upusr)
    //     VALUES ($1, $2, $3, $4, $5, $6,
    //   $7, $8, $9, $10, $11)`,
    //     params: [
    //       uuidv4(),
    //       user_c,
    //       user_b,
    //       newId,
    //       det.mrrcs_party,
    //       det.mrrcs_csmod,
    //       det.mrrcs_clmod,
    //       det.mrrcs_value || 0,
    //       det.mrrcs_notes || "",
    //       user_s,
    //       user_s,
    //     ],
    //     label: `Created Costing detail ${newTrnNo}`,
    //   });
    // }

    //Insert Payment details
    // for (const det of tmpb_mrrpy) {
    //   scripts.push({
    //     sql: `INSERT INTO tmpb_mrrpy(id, mrrpy_users, mrrpy_bsins, mrrpy_mrrdm, mrrpy_party, mrrpy_pdamt,
    //     mrrpy_refno, mrrpy_notes, mrrpy_crusr, mrrpy_upusr)
    //     VALUES ($1, $2, $3, $4, $5, $6,
    //     $7, $8, $9, $10)`,
    //     params: [
    //       uuidv4(),
    //       user_c,
    //       user_b,
    //       newId,
    //       det.mrrpy_party,
    //       det.mrrpy_pdamt || 0,
    //       det.mrrpy_refno || "",
    //       det.mrrpy_notes || "",
    //       user_s,
    //       user_s,
    //     ],
    //     label: `Created Payment detail ${newTrnNo}`,
    //   });
    // }

    //Update supplier credit balance + increase
    scripts.push({
      sql: `UPDATE tmcb_cntct
      SET cntct_crbal = cntct_crbal + $1,      
    cntct_upusr = $2,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $3
      `,
      params: [invcm_duamt, user_s, invcm_cntct],
      label: `Update customer credit balance ${newTrnNo}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Sales Invoice created successfully",
      data: {
        ...req.body,
        invcm_trnno: newTrnNo,
      },
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

const update = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: `Update feature is unavailable.`,
      data: {},
    });
    const {
      id,
      dpart_users,
      dpart_bsins,
      dpart_ccode,
      dpart_cname,
      dpart_ofadr,
      dpart_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!dpart_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }
    //database action
    const sql = `UPDATE tmsb_dpart
    SET dpart_cname = $1,
    dpart_ofadr = $2,
    dpart_emcap = $3,
    dpart_upusr = $4,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $5`;
    const params = [dpart_cname, dpart_ofadr, dpart_emcap, user_s, id];

    await dbRun(sql, params, `update Department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_cname} - Updated successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// upsert — dispatches to create or update based on presence of id
router.post("/upsert", async (req, res) => {
  const { id } = req.body;
  if (id) {
    return update(req, res);
  } else {
    return create(req, res);
  }
});

// create
router.post("/create", create);

// update
router.post("/update", update);

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, dpart_cname, dpart_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !dpart_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmsb_dpart
    SET dpart_actve = NOT dpart_actve,
    dpart_upusr = $1,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_cname} - ${dpart_actve ? "Deactivate" : "Activate"} successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

// get-details-by-master
router.post("/get-details-by-master", async (req, res) => {
  try {
    const { invcc_invcm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!invcc_invcm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT ivc.*,
    itm.items_iname, itm.items_szqty, unt.units_cname AS runit_uname, sunit.units_cname as sunit_cname,
     0 as edit_stop
    FROM tmob_invcc ivc
    LEFT JOIN tmib_items itm ON ivc.invcc_items = itm.id
    LEFT JOIN tmib_units unt ON ivc.invcc_units = unt.id
    LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    WHERE ivc.invcc_users = $1
    AND ivc.invcc_invcm = $2
    ORDER BY ivc.invcc_items ASC`;

    const params = [user_c, invcc_invcm];
    const rows = await dbGetAll(sql, params, `get Invoice Details- ${user_c}`);
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
// get-costs-by-master
router.post("/get-costs-by-master", async (req, res) => {
  try {
    const { mrrcs_mrrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrcs_mrrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrc.*, pty.party_cname
        FROM tmpb_mrrcs mrc
        JOIN tmtb_party pty ON mrc.mrrcs_party = pty.id
        WHERE mrc.mrrcs_users = $1
        AND mrc.mrrcs_mrrdm = $2`;

    const params = [user_c, mrrcs_mrrdm];
    const rows = await dbGetAll(sql, params, `get Cost Details- ${user_c}`);
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
// get-payments-by-master
router.post("/get-payments-by-master", async (req, res) => {
  try {
    const { mrrpy_mrrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrpy_mrrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mpy.*, pty.party_cname
        FROM tmpb_mrrpy mpy
        JOIN tmtb_party pty ON mpy.mrrpy_party = pty.id
        WHERE mpy.mrrpy_users = $1
        AND mpy.mrrpy_mrrdm = $2`;

    const params = [user_c, mrrpy_mrrdm];
    const rows = await dbGetAll(sql, params, `get Payment Details- ${user_c}`);
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

// get-expenses-payments-heads
router.post("/get-expenses-payments-heads", async (req, res) => {
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
    const sql = `SELECT pty.*, ptn.prtyn_ctype
      FROM tmtb_party pty
      JOIN tmtb_prtyn ptn ON pty.id = ptn.prtyn_party
      WHERE ptn.prtyn_cname = 'SYS_SALES_INVOICE'
      AND pty.party_users = ptn.prtyn_users
      AND pty.party_users = $1
      AND pty.party_actve = TRUE
      AND ptn.prtyn_actve = TRUE
      ORDER BY pty.party_ptype`;

    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get expenses payments heads- ${user_c}`,
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

// get-all-due-mrr
router.post("/get-all-due-mrr", async (req, res) => {
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
    const sql = `SELECT mrr.*,
    dprt.dpart_cname, cntct.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmpb_mrrdm mrr
    JOIN tmsb_dpart dprt ON mrr.mrrdm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON mrr.mrrdm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON mrr.mrrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.mrrdm_upusr = usr.id
    WHERE mrr.mrrdm_users = $1
    AND mrr.mrrdm_actve = TRUE
    AND (mrr.mrrdm_pyamt - mrr.mrrdm_pdamt) > 0
    ORDER BY mrr.mrrdm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Department- ${user_c}`);
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
