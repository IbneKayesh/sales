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
    const sql = `SELECT itm.*,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
    COALESCE(prc.price_id, 0) as price_count,
    COALESCE(prc.price_gdstk, 0) as price_gdstk,
    COALESCE(prc.price_bdstk, 0) as price_bdstk,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
FROM tmib_items itm
LEFT JOIN tmib_units runit ON itm.items_runit = runit.id
LEFT JOIN tmib_units punit ON itm.items_punit = punit.id
LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
LEFT JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
LEFT JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
LEFT JOIN tmib_brand brand ON itm.items_brand = brand.id
LEFT JOIN (
      SELECT COUNT(id) as price_id, SUM(prc.price_gdstk) as price_gdstk, SUM(prc.price_bdstk) as price_bdstk,
      prc.price_items
      FROM tmib_price prc
      WHERE prc.price_users = $1
      GROUP BY prc.price_items
  )prc ON itm.id = prc.price_items
LEFT JOIN tmhb_emply csr ON itm.items_crusr = csr.id
LEFT JOIN tmhb_emply usr ON itm.items_upusr = usr.id
WHERE itm.items_users = $1
ORDER BY prc.price_gdstk DESC, prc.price_bdstk DESC, itm.items_iname`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get items- ${user_c}`);
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
    const sql = `SELECT itm.*, 0 as edit_stop
    FROM tmib_items itm
    WHERE itm.items_users = $1
    AND itm.items_actve = TRUE
    ORDER BY itm.items_iname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get items- ${user_c}`);
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
      items_users,
      items_bsins,
      items_ccode,
      items_icode,
      items_iname,
      items_brcod,
      items_hscod,
      items_notes,
      items_runit,
      items_pkqty,
      items_punit,
      items_szqty,
      items_sunit,
      items_sgrup,
      items_scatg,
      items_itype,
      items_brand,
      items_tstck,
      items_pivat,
      items_pdvat,
      items_sdvat,
      items_smrgn,
      items_fxcst,
      items_image,
      items_stpur,
      items_stsal,
      items_stnsf,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !items_iname ||
      !items_runit ||
      !items_pkqty ||
      !items_punit ||
      !items_szqty ||
      !items_sunit ||
      !items_sgrup ||
      !items_scatg ||
      !items_itype ||
      !items_brand ||
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
    const sql_chtac = `SELECT cht.id AS chtac_id
      FROM tmtb_prtyn ptn
      JOIN tmtb_chtac cht ON ptn.prtyn_chtno = cht.chtac_chtno
      WHERE ptn.prtyn_cname = 'SYS_ITEMS_TYPE'
      AND ptn.prtyn_users = $1
      AND ptn.prtyn_ctype = $2`;
    const row_chtac = await dbGetAll(
      sql_chtac,
      [user_c, items_itype],
      `get account coa- ${items_itype}`,
    );
    if (row_chtac.length === 0) {
      return res.json({
        success: false,
        message: `No account party setup for ${items_itype}`,
        data: {},
      });
    }

    const masterId = uuidv4();
    const scripts = [];

    const newCode = await GenNewCode(user_c, "tmib_items");
    scripts.push({
      sql: `INSERT INTO tmib_items(id, items_users, items_bsins, items_ccode, items_icode, items_iname,
      items_brcod, items_hscod, items_notes, items_runit, items_pkqty, items_punit,
      items_szqty, items_sunit, items_sgrup, items_scatg, items_itype, items_brand,
      items_tstck, items_pivat, items_pdvat, items_sdvat, items_smrgn, items_fxcst,
      items_image, items_stpur, items_stsal, items_stnsf, items_crusr, items_upusr)
	    VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29, $30)`,
      params: [
        masterId,
        user_c,
        user_b,
        newCode,
        items_icode || newCode,
        items_iname,
        items_brcod,
        items_hscod,
        items_notes,
        items_runit,
        items_pkqty,
        items_punit,
        items_szqty,
        items_sunit,
        items_sgrup,
        items_scatg,
        items_itype,
        items_brand,
        items_tstck,
        items_pivat,
        items_pdvat,
        items_sdvat,
        items_smrgn,
        items_fxcst,
        items_image,
        items_stpur,
        items_stsal,
        items_stnsf,
        user_s,
        user_s,
      ],
      label: `create item- ${user_c}`,
    });

    for (row of row_chtac) {
      const newCodeParty = await GenNewCode(user_c, "tmtb_party");
      scripts.push({
        sql: `INSERT INTO tmtb_party(id, party_users, party_bsins, party_ccode, party_ptype, party_chtac,
      party_vndor, party_cname, party_opbal, party_crusr, party_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newCodeParty,
          items_itype,
          row.chtac_id,
          masterId,
          items_iname,
          0,
          user_s,
          user_s,
        ],
        label: `create party accounts- ${user_c}`,
      });
    }
    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${items_iname} - Created successfully.`,
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

const update = async (req, res) => {
  try {
    const {
      id,
      items_users,
      items_bsins,
      items_ccode,
      items_icode,
      items_iname,
      items_brcod,
      items_hscod,
      items_notes,
      items_runit,
      items_pkqty,
      items_punit,
      items_szqty,
      items_sunit,
      items_sgrup,
      items_scatg,
      items_itype,
      items_brand,
      items_tstck,
      items_pivat,
      items_pdvat,
      items_sdvat,
      items_smrgn,
      items_fxcst,
      items_image,
      items_stpur,
      items_stsal,
      items_stnsf,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !items_iname ||
      !items_runit ||
      !items_pkqty ||
      !items_punit ||
      !items_szqty ||
      !items_sunit ||
      !items_sgrup ||
      !items_scatg ||
      !items_itype ||
      !items_brand ||
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
    const scripts = [];
    //items_itype :: accounts party created - don't update
    scripts.push({
      sql: `UPDATE tmib_items
    SET items_iname = $1,
    items_brcod = $2,
    items_hscod = $3,
    items_notes = $4,
    items_runit = $5,
    items_pkqty = $6,
    items_punit = $7,
    items_szqty = $8,
    items_sunit = $9,
    items_sgrup = $10,
    items_scatg = $11,    
    items_brand = $12,
    items_tstck = $13,
    items_pivat = $14,
    items_pdvat = $15,
    items_sdvat = $16,
    items_smrgn = $17,
    items_fxcst = $18,
    items_image = $19,
    items_stpur = $20,
    items_stsal = $21,
    items_stnsf = $22,
    items_upusr = $23,
    items_updat = CURRENT_TIMESTAMP,
    items_rvnmr = items_rvnmr + 1
    WHERE id = $24`,
      params: [
        items_iname,
        items_brcod,
        items_hscod,
        items_notes,
        items_runit,
        items_pkqty,
        items_punit,
        items_szqty,
        items_sunit,
        items_sgrup,
        items_scatg,
        items_brand,
        items_tstck,
        items_pivat,
        items_pdvat,
        items_sdvat,
        items_smrgn,
        items_fxcst,
        items_image,
        items_stpur,
        items_stsal,
        items_stnsf,
        user_s,
        id,
      ],
      label: `update item- ${user_c}`,
    });

    scripts.push({
      sql: `UPDATE tmtb_party
    SET party_cname = $1,
    party_upusr = $2,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE party_vndor = $3`,
      params: [items_iname, user_s, id],
      label: `update party accounts- ${user_c}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${items_iname} - Updated successfully.`,
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
    const { id, items_iname, items_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !items_iname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_items
    SET items_actve = NOT items_actve,
    items_upusr = $1,
    items_updat = CURRENT_TIMESTAMP,
    items_rvnmr = items_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete items- ${user_c}`);
    res.json({
      success: true,
      message: `${items_iname} - ${items_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-new-business-items
router.post("/get-new-business-items", async (req, res) => {
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
    const sql = `SELECT itm.*, 0 as edit_stop
    FROM tmib_items itm
    LEFT JOIN tmib_price prce ON itm.id = prce.price_items
    WHERE itm.items_users = $1
    AND itm.items_actve = TRUE
    AND prce.price_items IS NULL
    ORDER BY itm.items_iname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get items- ${user_c}`);
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

// get-mrr-items
router.post("/get-mrr-items", async (req, res) => {
  try {
    const { cntct_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!cntct_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT itm.*,
    prc.id AS price_id, prc.price_cname,
    prc.price_lprat, prc.price_dprat, prc.price_tprat, prc.price_mrrat, prc.price_dspct,
    prc.price_gdstk, prc.price_bdstk, prc.price_mnqty, prc.price_mxqty, prc.price_pbqty,
    prc.price_sbqty, prc.price_notes, prc.price_jnote,
    runit.units_cname as runit_uname,
    punit.units_cname as punit_uname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
    pty.id party_id, pty.party_chtac chtac_id
    FROM tmib_items itm
    JOIN tmib_price prc ON itm.id = prc.price_items    
    JOIN tmib_units runit ON itm.items_runit = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    JOIN tmtb_party pty ON itm.id = pty.party_vndor
    JOIN tmib_itmct itc ON itm.id = itc.itmct_items
    WHERE itm.items_stpur = false
    AND itm.items_itype IN ('RM', 'PM', 'FG')
    AND itm.items_actve = TRUE
    AND prc.price_actve = TRUE
    AND itc.itmct_cntct = $1
    AND prc.price_users = $2
    AND prc.price_bsins = $3
    ORDER BY itm.items_iname ASC`;

    const params = [cntct_id, user_c, user_b];
    const rows = await dbGetAll(sql, params, `get new mrr items- ${user_c}`);
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

// get-sales-invoice-items-by-dpart
router.post("/get-sales-invoice-items-by-dpart", async (req, res) => {
  try {
    const { dpart_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!dpart_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql_v1 = `SELECT itm.*,
    prc.id AS price_id, prc.price_cname,
    prc.price_lprat, prc.price_dprat, prc.price_tprat, prc.price_mrrat, prc.price_dspct,
    prc.price_gdstk, prc.price_bdstk, prc.price_mnqty, prc.price_mxqty, prc.price_pbqty,
    prc.price_sbqty, prc.price_notes, prc.price_jnote,
    runit.units_cname as runit_uname,
    punit.units_cname as punit_uname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
    stock.id stock_id, stock.stock_ohqty, stock.stock_cprat
    FROM tmib_items itm
    JOIN tmib_price prc ON itm.id = prc.price_items    
    JOIN tmib_units runit ON itm.items_runit = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    JOIN tmib_stock stock ON itm.id = stock.stock_items
                          AND prc.id = stock.stock_price
                          AND itm.items_users = stock.stock_users
                          AND itm.items_bsins = stock.stock_bsins
                          AND stock.stock_ohqty > 0
                          AND stock.stock_dpart = $1
    WHERE itm.items_stsal = false
    AND itm.items_itype IN ('SVC', 'FG')
    AND itm.items_actve = TRUE
    AND prc.price_actve = TRUE
    AND prc.price_users = $2
    AND prc.price_bsins = $3
    ORDER BY itm.items_iname ASC`;
    
    const sql = `SELECT stk.id stock_id, stk.stock_refid, stk.stock_brcod, stk.stock_batch, stk.stock_srial, stk.stock_wrdat, stk.stock_fgdat,
stk.stock_exdat, stk.stock_ohqty, stk.stock_cprat,
prc.id price_id, prc.price_cname, prc.price_lprat, prc.price_dprat, prc.price_tprat, prc.price_mrrat,
prc.price_dspct, prc.price_gdstk, prc.price_bdstk,
itm.id items_id, itm.items_icode, itm.items_brcod, itm.items_hscod, itm.items_runit, itm.items_pkqty, 
itm.items_sdvat, runit.units_cname as runit_uname, itm.items_pkqty, sunit.units_cname as sunit_cname,
itm.items_szqty, brand.brand_cname as brand_cname,
pty.id party_id, pty.party_chtac chtac_id
FROM tmib_stock stk
JOIN tmib_price prc ON stk.stock_price = prc.id
					AND stk.stock_users = prc.price_users
					AND stk.stock_bsins = prc.price_bsins
JOIN tmib_items itm ON stk.stock_items = itm.id
					AND stk.stock_users = itm.items_users
					AND stk.stock_bsins = itm.items_bsins
JOIN tmib_units runit ON itm.items_runit = runit.id
JOIN tmib_units sunit ON itm.items_sunit = sunit.id
JOIN tmib_brand brand ON itm.items_brand = brand.id
JOIN tmtb_party pty ON itm.id = pty.party_vndor
WHERE stk.stock_ohqty > 0
AND stk.stock_users = $1
AND stk.stock_bsins = $2
AND stk.stock_dpart = $3
AND itm.items_itype IN ('SVC', 'FG')
AND itm.items_stsal = FALSE
ORDER BY prc.price_cname, stk.stock_crdat`;

    const params = [user_c, user_b, dpart_id];
    const rows = await dbGetAll(sql, params, `get new invoice items- ${user_c}`);
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


// get-by-filter
router.post("/get-by-filter", async (req, res) => {
  try {
    const { items_mcatg, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT itm.*,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
    COALESCE(prc.price_id, 0) as price_count,
    COALESCE(prc.price_gdstk, 0) as price_gdstk,
    COALESCE(prc.price_bdstk, 0) as price_bdstk,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
FROM tmib_items itm
LEFT JOIN tmib_units runit ON itm.items_runit = runit.id
LEFT JOIN tmib_units punit ON itm.items_punit = punit.id
LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
LEFT JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
LEFT JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
LEFT JOIN tmib_brand brand ON itm.items_brand = brand.id
LEFT JOIN (
      SELECT COUNT(id) as price_id, SUM(prc.price_gdstk) as price_gdstk, SUM(prc.price_bdstk) as price_bdstk,
      prc.price_items
      FROM tmib_price prc
      WHERE prc.price_users = $1
      GROUP BY prc.price_items
  )prc ON itm.id = prc.price_items
LEFT JOIN tmhb_emply csr ON itm.items_crusr = csr.id
LEFT JOIN tmhb_emply usr ON itm.items_upusr = usr.id
WHERE itm.items_users = $1
AND scatg.scatg_mcatg = $2
ORDER BY prc.price_gdstk DESC, prc.price_bdstk DESC, itm.items_iname`;

    const params = [user_c, items_mcatg];
    const rows = await dbGetAll(sql, params, `get items- ${user_c}`);
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
