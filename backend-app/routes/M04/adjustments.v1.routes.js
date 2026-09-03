const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate,
  getCoaAssetInputVat,
} = require("../../db/genHelper");

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
    const sql = `SELECT ajm.*, dpt.dpart_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_adjsm ajm
    JOIN tmsb_dpart dpt ON ajm.adjsm_dpart = dpt.id
    LEFT JOIN tmhb_emply csr ON ajm.adjsm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON ajm.adjsm_upusr = usr.id
    WHERE ajm.adjsm_users = $1
    ORDER BY ajm.adjsm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Inventory Adjustments- ${user_c}`);
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
    const sql = `SELECT mrr.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmpb_mrrdm mrr
    LEFT JOIN tmhb_emply csr ON mrr.mrrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.mrrdm_upusr = usr.id
    WHERE mrr.mrrdm_users = $1
    AND mrr.mrrdm_actve = TRUE
    ORDER BY mrr.mrrdm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get MRR- ${user_c}`);
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
      adjsm_users,
      adjsm_bsins,
      adjsm_dpart,
      adjsm_ttype,
      adjsm_trnno,
      adjsm_trdat,
      adjsm_refno,
      adjsm_notes,
      adjsm_tramt,
      adjsm_ispst,
      adjsm_isapp,
      tmib_adjsc,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !adjsm_dpart ||
      !adjsm_ttype ||
      !adjsm_trdat ||
      !adjsm_notes ||
      !tmib_adjsc ||
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
    const acprd = await getCurrentPeriod(user_c, user_b, adjsm_dpart);
    if (!acprd) {
      return {
        success: false,
        message: "No active fiscal year or accounting period found",
        data: {},
      };
    }
    if (acprd.length > 1) {
      return {
        success: false,
        message: "Multiple active accounting periods found. Please select one.",
        data: {},
      };
    }
    const { acprd_id, fsyar_id } = acprd[0];
    const newId_JV = uuidv4();
    const newTrnNo_JV = await GenNewTrn(
      user_c,
      user_b,
      "tmtb_jrnlm",
      adjsm_ttype, //"Purchase Invoice",
      adjsm_dpart,
    );

    //active currency rate
    const crncy = await getCurrencyRate(user_c, user_b);
    if (!crncy) {
      return {
        success: false,
        message: "No active currency rate found",
        data: {},
      };
    }
    if (crncy.length > 1) {
      return {
        success: false,
        message: "Multiple active currency rate found. Please select one.",
        data: {},
      };
    }

    const newId = uuidv4();
    //const newCode = await GenNewCode(user_c, "tmib_adjsm");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmib_adjsm",
      adjsm_ttype, //"Adjustment In", "Adjustment Out"
      adjsm_dpart,
    );

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmib_adjsm(id, adjsm_users, adjsm_bsins, adjsm_dpart, adjsm_ttype, adjsm_trnno,
      adjsm_trdat, adjsm_refno, adjsm_notes, adjsm_tramt, adjsm_ispst, adjsm_isapp,
      adjsm_crusr, adjsm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14)`,
      params: [
        newId,
        user_c,
        user_b,
        adjsm_dpart,
        adjsm_ttype,
        newTrnNo,
        adjsm_trdat,
        adjsm_refno,
        adjsm_notes,
        adjsm_tramt || 0,
        true,
        adjsm_isapp,
        user_s,
        user_s,
      ],
      label: `Created inventory adjustment ${newTrnNo}`,
    });

    //SYS_INVENTORY_ADJUSTMENT
    scripts.push({
      sql: `INSERT INTO tmtb_jrnlm(id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
    jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
    jrnlm_drval, jrnlm_crval, jrnlm_exrat, jrnlm_stats, jrnlm_crusr, jrnlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17, $18)`,
      params: [
        newId_JV,
        user_c,
        user_b,
        adjsm_dpart,
        fsyar_id,
        acprd_id,
        crncy.crncy_tcrnc,
        adjsm_ttype, //"Purchase Invoice",
        newTrnNo_JV,
        adjsm_trdat,
        newTrnNo,
        adjsm_ttype,
        0,
        0,
        crncy.crncy_exrat,
        "Posted",
        user_s,
        user_s,
      ],
      label: `create journal master- ${newTrnNo_JV}`,
    });

    //Insert MRR details, Stock Details
    let line = 1;
    for (const det of tmib_adjsc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmib_adjsc(id, adjsc_users, adjsc_bsins, adjsc_adjsm, adjsc_price, adjsc_items,
                          adjsc_units, adjsc_itrat, adjsc_itqty, adjsc_itamt, adjsc_notes, adjsc_refid,
                          adjsc_crusr, adjsc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.adjsc_price,
          det.adjsc_items,
          det.adjsc_units,
          det.adjsc_itrat || 0,
          det.adjsc_itqty || 0,
          det.adjsc_itamt || 0,
          det.adjsc_notes || "",
          det.adjsc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created inventory adjustment detail ${newTrnNo}`,
      });

      //add condition if no tracking then off
      scripts.push({
        sql: `UPDATE tmib_stock
        SET stock_aoqty = stock_aoqty + $1,
            stock_ohqty = stock_ohqty - $2,
            stock_upusr = $3,
            stock_updat = CURRENT_TIMESTAMP,
            stock_rvnmr = stock_rvnmr + 1
        WHERE id = $4
        AND stock_users = $5
        AND stock_bsins = $6
        AND stock_dpart = $7`,
        params: [
          det.adjsc_itqty || 0,
          det.adjsc_itqty || 0,
          user_s,
          det.adjsc_refid || "",
          user_c,
          user_b,
          adjsm_dpart,
        ],
        label: `Update reduce stock detail ${newTrnNo}`,
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
                  AND price_items = $5
                  AND price_dpart = $6`,
        params: [
          det.adjsc_itqty || 0,
          user_s,
          det.adjsc_price,
          user_c,
          det.adjsc_items,
          adjsm_dpart,
        ],
        label: `Update reduce price stock detail ${newTrnNo}`,
      });

      // scripts.push({
      //   sql: `INSERT INTO tmib_stock(id, stock_users, stock_bsins, stock_dpart, stock_sorce, stock_trnno,
      //   stock_refid, stock_items, stock_price, stock_brcod, stock_batch, stock_srial,
      //   stock_wrdat, stock_fgdat, stock_exdat, stock_trqty, stock_ohqty, stock_cprat,
      //   stock_lprat, stock_notes, stock_crusr, stock_upusr)
      //   VALUES ($1, $2, $3, $4, $5, $6,
      // $7, $8, $9, $10, $11, $12,
      // $13, $14, $15, $16, $17, $18,
      // $19, $20, $21, $22)`,
      //   params: [
      //     uuidv4(),
      //     user_c,
      //     user_b,
      //     mrrdm_dpart,
      //     mrrdm_ttype,
      //     newTrnNo,
      //     lineId,
      //     det.mrrdc_items,
      //     det.mrrdc_price,
      //     det.stock_brcod, //
      //     det.stock_batch, //
      //     det.stock_srial, //
      //     det.stock_wrdat, //
      //     det.stock_fgdat, //
      //     det.stock_exdat, //
      //     det.mrrdc_itqty || 0,
      //     det.mrrdc_itqty || 0,
      //     det.mrrdc_csrat || 0,
      //     det.mrrdc_itrat || 0,
      //     det.stock_notes || "",
      //     user_s,
      //     user_s,
      //   ],
      //   label: `Created MRR stock detail ${newTrnNo}`,
      // });

      //update summary stock, last price
      // scripts.push({
      //   sql: `UPDATE tmib_price
      //         SET price_lprat = $1,
      //             price_gdstk = price_gdstk + $2,
      //             price_upusr = $3,
      //             price_updat = CURRENT_TIMESTAMP,
      //             price_rvnmr = price_rvnmr + 1
      //             WHERE id = $4
      //             AND price_users = $5
      //             AND price_items = $6
      //             AND price_dpart = $7`,
      //   params: [
      //     det.mrrdc_itrat,
      //     det.mrrdc_itqty || 0,
      //     user_s,
      //     det.mrrdc_price,
      //     user_c,
      //     det.mrrdc_items,
      //     mrrdm_dpart,
      //   ],
      //   label: `Update price stock detail ${newTrnNo}`,
      // });

      //SYS_MRR_DIRECT.SYS_AST_INVENTORY > Asset / Inventory Products - 10101212 (DR)
      // let thisLineAmount =
      //   Number(det.mrrdc_itqty || 0) * Number(det.mrrdc_csrat || 0);
      // scripts.push({
      //   sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
      //   jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
      //   jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
      //   VALUES ($1, $2, $3, $4, $5, $6,
      //   $7, $8, $9, $10, $11, $12,
      //   $13, $14, $15, $16)`,
      //   params: [
      //     uuidv4(),
      //     user_c,
      //     user_b,
      //     mrrdm_dpart,
      //     newId_JV,
      //     det.chtac_id,
      //     det.party_id,
      //     thisLineAmount,
      //     0,
      //     "To Asset / Inventory / Products",
      //     mrrdm_ttype,
      //     newId,
      //     "MASTER",
      //     line,
      //     user_s,
      //     user_s,
      //   ],
      //   label: `Create Asset / Inventory / Products ${newTrnNo_JV}`,
      // });
      // line++;
    }

    const newGroupedProducts = Object.values(
      tmib_adjsc.reduce((groups, det) => {
        const key = `${det.chtac_id}_${det.party_id}`;

        if (!groups[key]) {
          groups[key] = {
            chtac_id: det.chtac_id,
            party_id: det.party_id,
            item_amount: 0,
          };
        }

        groups[key].item_amount +=
          Number(det.adjsc_itqty || 0) * Number(det.adjsc_itrat || 0);

        return groups;
      }, {}),
    );

    //SYS_INVENTORY_ADJUSTMENT.SYS_AST_INVENTORY > Asset / Inventory Products - 10101212 (CR)
    for (const det of newGroupedProducts) {
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          adjsm_dpart,
          newId_JV,
          det.chtac_id,
          det.party_id,
          0,
          det.item_amount,
          "From Assets / Current Assets / Inventory",
          adjsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Assets / Current Assets / Inventory ${newTrnNo_JV}`,
      });
      line++;
    }

    //SYS_INVENTORY_ADJUSTMENT.SYS_EXP_INV_ADJ_LOSS > Expenses / Operating Expenses / Other Expenses - 50111613 (DR)
    const sql_prtyr = `SELECT ptr.id party_id, ptr.party_chtac chtac_id, pty.prtyr_sgrup
                      FROM tmtb_party ptr
                      JOIN tmtb_chtac cht ON ptr.party_chtac = cht.id
                      JOIN tmtb_prtyr pty ON cht.chtac_chtno = pty.prtyr_chtno
                      WHERE pty.prtyr_mgrup = 'SYS_INVENTORY_ADJUSTMENT'
                      AND pty.prtyr_party = 'SYS_LINKED'
                      AND ptr.party_users = $1
                      AND ptr.party_bsins = $2
                      LIMIT 2`;
    //AND pty.prtyr_sgrup = 'SYS_EXP_INV_ADJ_LOSS'
    //console.log(user_c, user_b, dept_id);
    const rows_prtyr = await dbGetAll(sql_prtyr, [user_c, user_b]);
    //console.log("rows_prtyr",rows_prtyr);
    if (!rows_prtyr.length === 2) {
      return res.json({
        success: false,
        message: `No default Inventory Adjustment In/Out configured`,
        data: {},
      });
    }

    const prtyn_loss = rows_prtyr.find(
      (row) => row.prtyr_sgrup === "SYS_EXP_INV_ADJ_LOSS",
    );

    //SYS_INVENTORY_ADJUSTMENT.SYS_EXP_INV_ADJ_GAIN > Expenses / Operating Expenses / Other Expenses - 50111612 (DR)
    scripts.push({
      sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        adjsm_dpart,
        newId_JV,
        prtyn_loss.chtac_id,
        prtyn_loss.party_id,
        adjsm_tramt || 0,
        0,
        "To Expenses / Operating Expenses / Other Expenses",
        adjsm_ttype,
        newId,
        "MASTER",
        line,
        user_s,
        user_s,
      ],
      label: `Create Inventory Adjustment ${newTrnNo_JV}`,
    });
    line++;

    //console.log(scripts);
    //return;
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Adjustment created successfully",
      data: {
        ...req.body,
        mrrdm_trnno: newTrnNo,
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
    const { adjsc_adjsm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!adjsc_adjsm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT ajc.*,
    itm.items_iname, itm.items_szqty, unt.units_cname AS runit_uname, sunit.units_cname as sunit_cname, prc.price_cname,
    0 stock_ohqty, 0 as edit_stop
    FROM tmib_adjsc ajc
    LEFT JOIN tmib_items itm ON ajc.adjsc_items = itm.id
    LEFT JOIN tmib_price prc ON ajc.adjsc_price = prc.id
                            AND itm.id = prc.price_items
    LEFT JOIN tmib_units unt ON ajc.adjsc_units = unt.id
    LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    WHERE ajc.adjsc_users = $1
    AND ajc.adjsc_adjsm = $2
    ORDER BY ajc.adjsc_items ASC`;

    const params = [user_c, adjsc_adjsm];
    const rows = await dbGetAll(sql, params, `get Adjustment Details- ${user_c}`);
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
