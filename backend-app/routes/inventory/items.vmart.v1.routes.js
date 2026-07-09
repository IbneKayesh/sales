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
    const sql = `SELECT itm.id, itm.items_icode, itm.items_iname, itm.items_runit, itm.items_scatg, itm.items_image,
prc.id price_id, prc.price_mrrat, prc.price_dspct, prc.price_gdstk
FROM tmib_items itm
JOIN tmib_price prc ON itm.id = prc.price_items
AND itm.items_bsins = prc.price_bsins
WHERE itm.items_itype = 'FG'
AND itm.items_actve = TRUE
AND prc.price_actve = TRUE
AND itm.items_users = $1
AND itm.items_bsins = $2`;

    const params = [user_c, user_b];
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
      items_sgrup,
      items_scatg,
      items_itype,
      items_brand,
      items_tstck,
      items_sdvat,
      items_smrgn,
      items_fxcst,
      items_image,
      items_stpur,
      items_stsal,
      items_stnsf,
      price_mrrat,
      price_dspct,
      price_gdstk,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !items_iname ||
      !items_runit ||
      !items_scatg ||
      !price_mrrat ||
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
    //build scripts
    const scripts = [];

    const newCode = await GenNewCode(user_c, "tmib_items");
    const item_id = uuidv4();

    scripts.push({
      sql: `INSERT INTO tmib_items(id, items_users, items_bsins, items_ccode, items_icode, items_iname, items_brcod,
    items_hscod, items_notes, items_runit, items_pkqty, items_punit, items_sgrup,
    items_scatg, items_itype, items_brand, items_tstck, items_sdvat, items_smrgn,
    items_fxcst, items_image, items_stpur, items_stsal, items_stnsf, items_crusr, items_upusr)
	VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26)`,
      params: [
        item_id,
        user_c,
        user_b,
        newCode,
        items_icode,
        items_iname,
        items_brcod,
        items_hscod,
        items_notes,
        items_runit,
        items_pkqty || 1,
        items_punit,
        items_sgrup,
        items_scatg,
        items_itype || "FG",
        items_brand,
        items_tstck,
        items_sdvat,
        items_smrgn,
        items_fxcst,
        items_image,
        items_stpur || false,
        items_stsal || false,
        items_stnsf || false,
        user_s,
        user_s,
      ],
    });

    const newCode2 = await GenNewCode(user_c, "tmib_price");

    scripts.push({
      sql: `INSERT INTO tmib_price(id, price_users, price_bsins, price_ccode, price_items, 
      price_lprat, price_dprat, price_tprat, price_mrrat, price_dspct, 
      price_gdstk, price_bdstk, price_mnqty, price_mxqty, price_pbqty, 
      price_sbqty, price_notes, price_jnote, 
      price_crusr, price_upusr
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        newCode2,
        item_id,
        0,
        0,
        0,
        price_mrrat || 0,
        price_dspct || 0,
        price_gdstk || 0,
        0,
        0,
        0,
        0,
        0,
        "",
        "{}",
        user_s,
        user_s,
      ],
    });

    await dbRunAll(scripts);

    return res.json({
      success: true,
      message: "Item created successfully",
      data: {
        ...req.body,
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
      items_sgrup,
      items_scatg,
      items_itype,
      items_brand,
      items_tstck,
      items_sdvat,
      items_smrgn,
      items_fxcst,
      items_image,
      items_stpur,
      items_stsal,
      items_stnsf,
      price_id,
      price_mrrat,
      price_dspct,
      price_gdstk,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !items_iname ||
      !items_runit ||
      !items_scatg ||
      !price_id ||
      !price_mrrat ||
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
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `UPDATE tmib_items
    SET items_iname = $1,
    items_runit = $2,
    items_scatg = $3,
    items_upusr = $4,
    items_updat = CURRENT_TIMESTAMP,
    items_rvnmr = items_rvnmr + 1
    WHERE id = $5`,
      params: [items_iname, items_runit, items_scatg, user_s, id],
    });
    scripts.push({
      sql: `UPDATE tmib_price
    SET price_mrrat = $1,
    price_dspct = $2,
    price_gdstk = $3,
    price_upusr = $4,
    price_updat = CURRENT_TIMESTAMP,
    price_rvnmr = price_rvnmr + 1
    WHERE id = $5`,
      params: [price_mrrat, price_dspct, price_gdstk, user_s, price_id],
    });

    await dbRunAll(scripts);

    return res.json({
      success: true,
      message: "Item updated successfully",
      data: {
        ...req.body,
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

// get-all-business-items
router.post("/get-all-business-items", async (req, res) => {
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
    const sql = `SELECT itm.id, itm.items_icode, itm.items_iname, itm.items_runit, itm.items_scatg, itm.items_image,
prc.id price_id, prc.price_mrrat, prc.price_dspct, prc.price_gdstk,
bsn.id as bsins_id, bsn.bsins_cname
FROM tmib_items itm
left JOIN tmib_price prc ON itm.id = prc.price_items
AND itm.items_bsins = prc.price_bsins
left JOIN tmsb_bsins bsn ON itm.items_bsins = bsn.id
WHERE itm.items_itype = 'FG'
AND itm.items_actve = TRUE
AND prc.price_actve = TRUE
    ORDER BY itm.items_iname ASC`;

    const params = [];
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

// get-new-mrr-items
router.post("/get-new-mrr-items", async (req, res) => {
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
    prc.id AS price_id,
    prc.price_lprat, prc.price_dprat, prc.price_tprat, prc.price_mrrat, prc.price_dspct,
    prc.price_gdstk, prc.price_bdstk, prc.price_mnqty, prc.price_mxqty, prc.price_pbqty,
    prc.price_sbqty,
    runit.units_uname as runit_uname,
    punit.units_uname as punit_uname,
    sgrup.sgrup_sname as sgrup_sname,
    scatg.scatg_sname as scatg_sname,
    brand.brand_bname as brand_bname,
    pty.id AS party_id, pty.party_pname, pty.party_chtac
    FROM tmib_items itm
    JOIN tmib_price prc ON itm.id = prc.price_items    
    JOIN tmib_units runit ON itm.items_runit = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    LEFT JOIN tmtb_party pty ON sgrup.id = pty.party_vndor
    WHERE itm.items_stpur = false
    AND prc.price_apusr = $1
    AND prc.price_bsins = $2
    ORDER BY itm.items_iname ASC`;

    const params = [user_c, user_b];
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

module.exports = router;
