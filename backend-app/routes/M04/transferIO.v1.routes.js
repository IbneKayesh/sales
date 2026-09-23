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
const { buildJournalScripts } = require("../../db/journalService");

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
    const sql = `SELECT trm.*, dpt.dpart_cname, dpz.dpart_cname cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_trndm trm
    JOIN tmsb_dpart dpt ON trm.trndm_dpart = dpt.id
    JOIN tmsb_dpart dpz ON trm.trndm_dparz = dpz.id
    LEFT JOIN tmhb_emply csr ON trm.trndm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON trm.trndm_upusr = usr.id
    WHERE trm.trndm_users = $1
    ORDER BY trm.trndm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get trm- ${user_c}`);
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
    const sql = `SELECT trm.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_trndm trm
    LEFT JOIN tmhb_emply csr ON trm.trndm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON trm.trndm_upusr = usr.id
    WHERE trm.trndm_users = $1
    AND trm.trndm_actve = TRUE
    ORDER BY trm.trndm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get trm- ${user_c}`);
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
      trndm_users,
      trndm_bsins,
      trndm_dpart,
      trndm_dparz,
      trndm_ttype,
      trndm_trnno,
      trndm_trdat,
      trndm_refno,
      trndm_notes,
      trndm_tramt,
      trndm_ecamt,
      trndm_stamt,
      trndm_csamt,
      trndm_vehid,
      trndm_ispst,
      tmib_trndc,
      tmib_trncs,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !trndm_dpart ||
      !trndm_dparz ||
      !trndm_ttype ||
      !tmib_trndc ||
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
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmib_trndm",
      trndm_ttype, //"Transfer IO",
      trndm_dpart,
    );

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmib_trndm(id, trndm_users, trndm_bsins, trndm_dpart, trndm_dparz, trndm_ttype,
                        trndm_trnno, trndm_trdat, trndm_refno, trndm_notes, trndm_tramt, trndm_ecamt,
                        trndm_stamt, trndm_csamt, trndm_vehid, trndm_ispst, trndm_crusr, trndm_upusr)
                VALUES ($1, $2, $3, $4, $5, $6,
                  $7, $8, $9, $10, $11, $12,
                  $13, $14, $15, $16, $17, $18)`,
      params: [
        newId,
        user_c,
        user_b,
        trndm_dpart,
        trndm_dparz,
        trndm_ttype,
        newTrnNo,
        trndm_trdat || new Date(),
        trndm_refno,
        trndm_notes,
        trndm_tramt || 0,
        trndm_ecamt || 0,
        trndm_stamt || 0,
        trndm_csamt || 0,
        trndm_vehid,
        true,
        user_s,
        user_s,
      ],
      label: `Created trm ${newTrnNo}`,
    });

    //Insert trm details, Stock Details
    for (const det of tmib_trndc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmib_trndc(id, trndc_users, trndc_bsins, trndc_trndm, trndc_price, trndc_items,
                          trndc_units, trndc_itrat, trndc_itqty, trndc_itamt, trndc_ecamt, trndc_stamt,
                          trndc_notes, trndc_csrat, trndc_refid, trndc_crusr, trndc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.trndc_price,
          det.trndc_items,
          det.trndc_units,
          det.trndc_itrat || 0,
          det.trndc_itqty || 0,
          det.trndc_itamt || 0,
          det.trndc_ecamt || 0,
          det.trndc_stamt || 0,
          det.trndc_notes || "",
          det.trndc_csrat || 0,
          det.trndc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created trm detail ${newTrnNo}`,
      });

      //insert into to store
      //add condition if no tracking then off
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
          trndm_dparz,
          trndm_ttype,
          newTrnNo,
          lineId,
          det.trndc_items,
          det.trndc_price,
          det.stock_brcod, //
          det.stock_batch, //
          det.stock_srial, //
          det.stock_wrdat || null,
          det.stock_fgdat || null, //
          det.stock_exdat || null, //
          det.trndc_itqty || 0,
          det.trndc_itqty || 0,
          det.trndc_csrat || 0,
          det.trndc_itrat || 0,
          det.trndc_notes || "",
          user_s,
          user_s,
        ],
        label: `Created trm stock detail ${newTrnNo}`,
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
                  AND price_items = $6`,
        params: [
          det.trndc_itrat,
          det.trndc_itqty || 0,
          user_s,
          det.trndc_price,
          user_c,
          det.trndc_items,
        ],
        label: `Update price stock detail ${newTrnNo}`,
      });

      //reduce from store stock
      scripts.push({
        sql: `UPDATE tmib_stock
        SET stock_isqty = stock_isqty + $1,
            stock_ohqty = stock_ohqty - $2,
            stock_upusr = $3,
            stock_updat = CURRENT_TIMESTAMP,
            stock_rvnmr = stock_rvnmr + 1
        WHERE id = $4
        AND stock_users = $5
        AND stock_bsins = $6
        AND stock_dpart = $7`,
        params: [
          det.trndc_itqty || 0,
          det.trndc_itqty || 0,
          user_s,
          det.trndc_refid || "",
          user_c,
          user_b,
          trndm_dpart,
        ],
        label: `Update reduce stock detail ${newTrnNo}`,
      });
    }

    const newGroupedProducts = Object.values(
      tmib_trndc.reduce((groups, det) => {
        const key = `${det.chtac_id}_${det.party_id}`;

        if (!groups[key]) {
          groups[key] = {
            chtac_id: det.chtac_id,
            party_id: det.party_id,
            item_amount: 0,
          };
        }

        groups[key].item_amount +=
          Number(det.trndc_itqty || 0) * Number(det.trndc_csrat || 0);

        return groups;
      }, {}),
    );

    //Insert Costing details
    for (const det of tmib_trncs) {
      const costId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmib_trncs(id, trncs_users, trncs_bsins, trncs_trndm, trncs_party, trncs_csmod, 
        trncs_clmod, trncs_value, trncs_notes, trncs_crusr, trncs_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
        params: [
          costId,
          user_c,
          user_b,
          newId,
          det.trncs_party, //party name
          det.trncs_csmod, //costing mode
          det.trncs_clmod, //calculation mode
          det.trncs_value || 0,
          det.trncs_notes || "",
          det.trncs_csmod === "Exclude"
            ? "SYS_FOR_PAYMENT"
            : "SYS_NOT_FOR_PAYMENT",
          user_s,
          user_s,
        ],
        label: `Created Costing detail ${newTrnNo}`,
      });
    }

    //50101014	Inter-Department Product COGS
    const CrAmount = newGroupedProducts.reduce(
      (sum, item) => sum + Number(item.item_amount || 0),
      0,
    );

    // Inter-Department Product COGS
    const sql_inout = `SELECT pty.id party_id, cht.id chtac_id, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_TRANSFER'
      AND crt.chtrt_pegid IN ('SYS_TRANSFER_IN_OUT')
      AND crt.chtrt_grpid IN ('SYS_EXP_INT_DEPT_COGS')
      AND crt.chtrt_route IN ('SYS_EMPTY')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      AND cht.chtac_bsins = $2
      LIMIT 1`;

    const rows_inout = await dbGetAll(sql_inout, [user_c, user_b]);
    if (!rows_inout.length === 1) {
      return res.json({
        success: false,
        message: `No default Inventory Transfer In/Out configured`,
        data: {},
      });
    }

    // ─── NEW: Collect journal details and use centralized helper ───
    const jrnlDetails = [];

    // From Store 1
    // Inventory / Products (CR)
    for (const det of newGroupedProducts) {
      jrnlDetails.push({
        chtac: det.chtac_id,
        party: det.party_id,
        drval: 0,
        crval: det.item_amount,
        descr: "From Asset / Inventory / Products",
        sorce: trndm_ttype,
        refid: newId,
      });
    }

    // Inventory COGS (DR)
    jrnlDetails.push({
      chtac: rows_inout[0].chtac_id,
      party: rows_inout[0].party_id,
      drval: CrAmount || 0,
      crval: 0,
      descr:
        "To Expenses / Cost of Goods Sold / Direct Costs / Inter-Department Product COGS",
      sorce: trndm_ttype,
      refid: newId,
    });

    // Costing exclude (CR)
    for (const det of tmib_trncs) {
      if (det.trncs_csmod === "Exclude") {
        jrnlDetails.push({
          chtac: det.chtac_id,
          party: det.party_id,
          drval: 0,
          crval: det.trncs_value || 0,
          descr: "From Liability / Local Vendor Payable",
          sorce: trndm_ttype,
          refid: newId,
        });
      }
    }

    // Build journal scripts via centralized helper
    const {
      scripts: jrnlScripts,
      masterId: newId_JV,
      trnNo: newTrnNo_JV,
    } = await buildJournalScripts({
      user_c,
      user_b,
      user_s,
      dpart: trndm_dpart,
      trtyp: "Inter Transfer",
      trdat: trndm_trdat || new Date(),
      refno: newTrnNo,
      narrt: trndm_ttype,
      drval: 0,
      crval: 0,
      details: jrnlDetails,
    });
    scripts.push(...jrnlScripts);

    //---------------------------------TO---------------------------------
    //To Store 2
    //const newId_JVTo = "";
    //const newTrnNo_JVTo = "";
    const jrnlDetailsTo = [];

    // From Store 1
    // Inventory / Products (CR)
    for (const det of newGroupedProducts) {
      jrnlDetailsTo.push({
        chtac: det.chtac_id,
        party: det.party_id,
        drval: det.item_amount,
        crval: 0,
        descr: "To Asset / Inventory / Products",
        sorce: trndm_ttype,
        refid: newId,
      });
    }

    // Inventory COGS (DR)
    jrnlDetailsTo.push({
      chtac: rows_inout[0].chtac_id,
      party: rows_inout[0].party_id,
      drval: 0,
      crval: CrAmount || 0,
      descr:
        "From Expenses / Cost of Goods Sold / Direct Costs / Inter-Department Product COGS",
      sorce: trndm_ttype,
      refid: newId,
    });

    // Build journal scripts via centralized helper
    const {
      scripts: jrnlScriptsTo,
      masterId: newId_JVTo,
      trnNo: newTrnNo_JVTo,
    } = await buildJournalScripts({
      user_c,
      user_b,
      user_s,
      dpart: trndm_dparz,
      trtyp: "Inter Transfer",
      trdat: trndm_trdat || new Date(),
      refno: newTrnNo,
      narrt: trndm_ttype,
      drval: 0,
      crval: 0,
      details: jrnlDetailsTo,
    });
    scripts.push(...jrnlScriptsTo);

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Inter Transfer IO created successfully",
      data: {
        ...req.body,
        trndm_trnno: newTrnNo,
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
    const { trndc_trndm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!trndc_trndm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrd.*,
    itm.items_iname, itm.items_szqty, unt.units_cname AS runit_uname, sunit.units_cname as sunit_cname,
     0 as edit_stop
    FROM tmib_trndc mrd
    LEFT JOIN tmib_items itm ON mrd.trndc_items = itm.id
    LEFT JOIN tmib_units unt ON mrd.trndc_units = unt.id
    LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    WHERE mrd.trndc_users = $1
    AND mrd.trndc_trndm = $2
    ORDER BY mrd.trndc_items ASC`;

    const params = [user_c, trndc_trndm];
    const rows = await dbGetAll(sql, params, `get trm Details- ${user_c}`);
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
    const { trncs_trndm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!trncs_trndm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrc.*, pty.party_cname
        FROM tmib_trncs mrc
        JOIN tmtb_party pty ON mrc.trncs_party = pty.id
        WHERE mrc.trncs_users = $1
        AND mrc.trncs_trndm = $2`;

    const params = [user_c, trncs_trndm];
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

// get-all-non-recive
router.post("/get-all-due-trm", async (req, res) => {
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
    const sql = `SELECT trm.*,
    dprt.dpart_cname, cntct.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_trndm trm
    JOIN tmsb_dpart dprt ON trm.trndm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON trm.trndm_dparz = cntct.id
    LEFT JOIN tmhb_emply csr ON trm.trndm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON trm.trndm_upusr = usr.id
    WHERE trm.trndm_users = $1
    AND trm.trndm_actve = TRUE
    AND (trm.trndm_pyamt - trm.trndm_pdamt) > 0
    ORDER BY trm.trndm_trdat DESC`;

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
