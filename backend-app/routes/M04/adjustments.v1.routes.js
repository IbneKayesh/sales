const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate,
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
    const rows = await dbGetAll(
      sql,
      params,
      `get Inventory Adjustments- ${user_c}`,
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

    //SYS_ADJUSTMENT.SYS_ADJUSTMENT_IN
    //SYS_ADJUSTMENT.SYS_ADJUSTMENT_OUT
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
        adjsm_ttype, //"Adjustment In / Adjustment Out",
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

    //Insert Adjustment In/Out details, Stock +/- Details
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

      //Adjustment In (+ stock)
      if (adjsm_ttype === "Adjustment In") {
        scripts.push({
          sql: `INSERT INTO tmib_stock(id, stock_users, stock_bsins, stock_dpart, stock_sorce, stock_trnno,
        stock_refid, stock_items, stock_price, stock_brcod, stock_batch, stock_srial,
        stock_wrdat, stock_fgdat, stock_exdat, stock_trqty, stock_ohqty, stock_cprat,
        stock_lprat, stock_notes, stock_crusr, stock_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22)`,
          params: [
            uuidv4(),
            user_c,
            user_b,
            adjsm_dpart,
            adjsm_ttype,
            newTrnNo,
            lineId,
            det.adjsc_items,
            det.adjsc_price,
            "", //det.stock_brcod,
            "", //det.stock_batch,
            "", //det.stock_srial,
            null, //det.stock_wrdat,
            null, //det.stock_fgdat,
            null, //det.stock_exdat,
            det.adjsc_itqty || 0,
            det.adjsc_itqty || 0,
            det.adjsc_itrat || 0,
            det.adjsc_itrat || 0,
            det.adjsc_notes || "",
            user_s,
            user_s,
          ],
          label: `Created Adjustment In stock detail ${newTrnNo}`,
        });

        //update summary stock, last price
        scripts.push({
          sql: `UPDATE tmib_price
              SET price_lprat = $1,
                  price_gdstk = price_gdstk + $2,
                  price_upusr = $3,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $4
                  AND price_users = $5
                  AND price_items = $6
                  AND price_dpart = $7`,
          params: [
            det.adjsc_itrat,
            det.adjsc_itqty || 0,
            user_s,
            det.adjsc_price,
            user_c,
            det.adjsc_items,
            adjsm_dpart,
          ],
          label: `Update price stock detail ${newTrnNo}`,
        });
      }

      //Adjustment Out (- stock)

      if (adjsm_ttype === "Adjustment Out") {
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
      }
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

    //SYS_ADJUSTMENT.SYS_ADJUSTMENT_IN.SYS_AST_INVENTORY
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
          adjsm_ttype === "Adjustment Out" ? 0 : det.item_amount,
          adjsm_ttype === "Adjustment Out" ? det.item_amount : 0,
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

    //SYS_ADJUSTMENT.SYS_ADJUSTMENT_IN.SYS_EXP_INV_ADJ_GAIN
    //SYS_ADJUSTMENT.SYS_ADJUSTMENT_OUT.SYS_EXP_INV_ADJ_LOSS
    const sql_inout = `SELECT pty.id party_id, cht.id chtac_id, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_ADJUSTMENT'
      AND crt.chtrt_pegid IN ('SYS_ADJUSTMENT_IN','SYS_ADJUSTMENT_OUT')
      AND crt.chtrt_grpid IN ('SYS_EXP_INV_ADJ_GAIN','SYS_EXP_INV_ADJ_LOSS')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      AND cht.chtac_bsins = $2
      LIMIT 2`;
    //console.log(user_c, user_b, dept_id);
    const rows_inout = await dbGetAll(sql_inout, [user_c, user_b]);
    //console.log("rows_inout",rows_inout);
    if (!rows_inout.length === 2) {
      return res.json({
        success: false,
        message: `No default Inventory Adjustment In/Out configured`,
        data: {},
      });
    }

    if (adjsm_ttype === "Adjustment In") {
      const prtyn_gain = rows_inout.find(
        (row) => row.chtrt_grpid === "SYS_EXP_INV_ADJ_GAIN",
      );
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
          prtyn_gain.chtac_id,
          prtyn_gain.party_id,
          0,
          adjsm_tramt || 0,
          "Gain on Inventory Adjustment",
          adjsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Inventory Adjustment ${newTrnNo_JV}`,
      });
    }

    if (adjsm_ttype === "Adjustment Out") {
      const prtyn_loss = rows_inout.find(
        (row) => row.chtrt_grpid === "SYS_EXP_INV_ADJ_LOSS",
      );

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
          "Loss on Inventory Adjustment",
          adjsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Inventory Adjustment ${newTrnNo_JV}`,
      });
    }
    line++;

    //console.log(scripts);
    //return;
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo} - Adjustment created successfully`,
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
    itm.items_iname, itm.items_pkqty, itm.items_szqty,
    prc.price_cname,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
    0 stock_ohqty, 0 as edit_stop
    FROM tmib_adjsc ajc
    JOIN tmib_items itm ON ajc.adjsc_items = itm.id
    JOIN tmib_price prc ON ajc.adjsc_price = prc.id
                            AND itm.id = prc.price_items
    JOIN tmib_units runit ON ajc.adjsc_units = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    WHERE ajc.adjsc_users = $1
    AND ajc.adjsc_adjsm = $2
    ORDER BY ajc.adjsc_items ASC`;

    const params = [user_c, adjsc_adjsm];
    const rows = await dbGetAll(
      sql,
      params,
      `get Adjustment Details- ${user_c}`,
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
