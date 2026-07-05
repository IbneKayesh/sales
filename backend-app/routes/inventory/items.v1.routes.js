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
    runit.units_uname as runit_uname,
    punit.units_uname as punit_uname,
    sgrup.sgrup_sname as sgrup_sname,
    scatg.scatg_sname as scatg_sname,
    brand.brand_bname as brand_bname,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
FROM tmib_items itm
JOIN tmib_units runit ON itm.items_runit = runit.id
JOIN tmib_units punit ON itm.items_punit = punit.id
JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
JOIN tmib_brand brand ON itm.items_brand = brand.id
LEFT JOIN tmnb_users csr ON itm.items_crusr = csr.id
LEFT JOIN tmnb_users usr ON itm.items_upusr = usr.id
WHERE itm.items_apusr = $1
ORDER BY itm.items_iname`;

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
    WHERE itm.items_apusr = $1
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
      items_apusr,
      items_bsins,
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
    const newCode = await GenNewCode(user_c, "tmib_items");

    const sql = `INSERT INTO tmib_items(id, items_apusr, items_bsins, items_icode, items_iname, items_brcod,
    items_hscod, items_notes, items_runit, items_pkqty, items_punit, items_sgrup,
    items_scatg, items_itype, items_brand, items_tstck, items_sdvat, items_smrgn,
    items_fxcst, items_image, items_stpur, items_stsal, items_stnsf, items_crusr, items_upusr)
	VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      items_icode || newCode,
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
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create item- ${user_c}`);
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
      items_apusr,
      items_bsins,
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
    const sql = `UPDATE tmib_items
    SET items_iname = $1,
    items_brcod = $2,
    items_hscod = $3,
    items_notes = $4,
    items_runit = $5,
    items_pkqty = $6,
    items_punit = $7,
    items_sgrup = $8,
    items_scatg = $9,
    items_itype = $10,
    items_brand = $11,
    items_tstck = $12,
    items_sdvat = $13,
    items_smrgn = $14,
    items_fxcst = $15,
    items_image = $16,
    items_stpur = $17,
    items_stsal = $18,
    items_stnsf = $19,
    items_upusr = $20,
    items_updat = CURRENT_TIMESTAMP,
    items_rvnmr = items_rvnmr + 1
    WHERE id = $21`;
    const params = [
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
      user_s,
      id,
    ];

    await dbRun(sql, params, `update item- ${user_c}`);
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
    WHERE itm.items_apusr = $1
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


//------------------------vmart----------------------
// get all
router.post("/vmart", async (req, res) => {
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
    runit.units_uname as runit_uname,
    punit.units_uname as punit_uname,
    sgrup.sgrup_sname as sgrup_sname,
    scatg.scatg_sname as scatg_sname,
    brand.brand_bname as brand_bname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
FROM tmib_items itm
LEFT JOIN tmib_units runit ON itm.items_runit = runit.id
LEFT JOIN tmib_units punit ON itm.items_punit = punit.id
LEFT JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
LEFT JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
LEFT JOIN tmib_brand brand ON itm.items_brand = brand.id
LEFT JOIN tmhb_emply csr ON itm.items_crusr = csr.id
LEFT JOIN tmhb_emply usr ON itm.items_upusr = usr.id
WHERE itm.items_users = $1
ORDER BY itm.items_iname`;

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

const create_vmart = async (req, res) => {
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
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !items_iname ||
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
    const newCode = await GenNewCode(user_c, "tmib_items");

    const sql = `INSERT INTO tmib_items(id, items_apusr, items_bsins, items_icode, items_iname, items_brcod,
    items_hscod, items_notes, items_runit, items_pkqty, items_punit, items_sgrup,
    items_scatg, items_itype, items_brand, items_tstck, items_sdvat, items_smrgn,
    items_fxcst, items_image, items_stpur, items_stsal, items_stnsf, items_crusr, items_upusr)
	VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      items_icode || newCode,
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
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create item- ${user_c}`);
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

const update_vmart = async (req, res) => {
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
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !items_iname ||
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
    const sql = `UPDATE tmib_items
    SET items_iname = $1,
    items_brcod = $2,
    items_hscod = $3,
    items_notes = $4,
    items_runit = $5,
    items_pkqty = $6,
    items_punit = $7,
    items_sgrup = $8,
    items_scatg = $9,
    items_itype = $10,
    items_brand = $11,
    items_tstck = $12,
    items_sdvat = $13,
    items_smrgn = $14,
    items_fxcst = $15,
    items_image = $16,
    items_stpur = $17,
    items_stsal = $18,
    items_stnsf = $19,
    items_upusr = $20,
    items_updat = CURRENT_TIMESTAMP,
    items_rvnmr = items_rvnmr + 1
    WHERE id = $21`;
    const params = [
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
      user_s,
      id,
    ];

    await dbRun(sql, params, `update item- ${user_c}`);
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


router.post("/vmart/upsert", async (req, res) => {
  const { id } = req.body;
  if (id) {
    return update_vmart(req, res);
  } else {
    return create_vmart(req, res);
  }
});

module.exports = router;
