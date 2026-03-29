const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { muser_id } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop,
      puofm.iuofm_untnm as puofm_untnm,
      suofm.iuofm_untnm as suofm_untnm,
      ctgry.ctgry_ctgnm,
      brand.brand_brnam
      FROM tmib_items tbl
      LEFT JOIN tmib_iuofm puofm ON tbl.items_puofm = puofm.id
      LEFT JOIN tmib_iuofm suofm ON tbl.items_suofm = suofm.id
      LEFT JOIN tmib_ctgry ctgry ON tbl.items_ctgry = ctgry.id
      LEFT JOIN tmib_brand brand ON tbl.items_brand = brand.id
      WHERE tbl.items_users = $1
      ORDER BY tbl.items_icode`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get products for ${muser_id}`);
    res.json({
      success: true,
      message: "Products fetched successfully",
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
      items_users,
      items_icode,
      items_bcode,
      items_hscod,
      items_iname,
      items_idesc,
      items_puofm,
      items_dfqty,
      items_suofm,
      items_ctgry,
      items_brand,
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      items_alpur,
      items_alsal,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !items_iname ||
      !items_puofm ||
      !items_suofm ||
      !items_ctgry ||
      !items_brand ||
      !items_itype
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmib_items
    (id, items_users, items_icode, items_bcode, items_hscod, items_iname, items_idesc, items_puofm, 
    items_dfqty, items_suofm, items_ctgry, items_brand, items_itype, items_trcks, items_sdvat, 
    items_costp, items_alpur, items_alsal, items_crusr, items_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 
    $9, $10, $11, $12, $13, $14, $15,
    $16, $17, $18, $19, $20)`;
    const params = [
      id,
      muser_id,
      items_icode,
      items_bcode,
      items_hscod,
      items_iname,
      items_idesc,
      items_puofm,
      items_dfqty,
      items_suofm,
      items_ctgry,
      items_brand,
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      items_alpur,
      items_alsal,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create product for ${items_iname}`);
    res.json({
      success: true,
      message: "Product created successfully",
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

// update
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      muser_id,
      items_icode,
      items_bcode,
      items_hscod,
      items_iname,
      items_idesc,
      items_puofm,
      items_dfqty,
      items_suofm,
      items_ctgry,
      items_brand,
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      items_alpur,
      items_alsal,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !muser_id ||
      !items_iname ||
      !items_puofm ||
      !items_suofm ||
      !items_ctgry ||
      !items_brand ||
      !items_itype
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_items
    SET items_icode = $1,
    items_bcode = $2,
    items_hscod = $3,
    items_iname = $4,
    items_idesc = $5,
    items_puofm = $6,
    items_dfqty = $7,
    items_suofm = $8,
    items_ctgry = $9,
    items_brand = $10,
    items_itype = $11,
    items_trcks = $12,
    items_sdvat = $13,
    items_costp = $14,
    items_alpur = $15,
    items_alsal = $16,
    items_upusr = $17
    WHERE id = $18`;
    const params = [
      items_icode,
      items_bcode,
      items_hscod,
      items_iname,
      items_idesc,
      items_puofm,
      items_dfqty,
      items_suofm,
      items_ctgry,
      items_brand,
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      items_alpur,
      items_alsal,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update product for ${items_iname}`);
    res.json({
      success: true,
      message: "Product updated successfully",
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
    const { id, muser_id, items_iname, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Product ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_items
    SET items_actve = NOT items_actve,
    items_upusr = $1,
    items_updat = CURRENT_TIMESTAMP,
    items_rvnmr = items_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete product for ${items_iname}`);
    res.json({
      success: true,
      message: "Product deleted successfully",
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

router.post("/get-by-code", async (req, res) => {
  try {
    const { items_icode, items_users } = req.body;

    // Validate input
    if (!items_icode || !items_users) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `select itm.*,unt.iuofm_untnm
    from tmib_items itm
    JOIN tmib_iuofm unt ON itm.items_puofm = unt.id
    WHERE itm.items_icode = $1
    AND itm.items_users = $2
    AND itm.items_actve = TRUE`;
    const params = [items_icode, items_users];

    const row = await dbGet(sql, params, `Get Item for ${items_icode}`);

    res.json({
      success: true,
      message: "Item fetched successfully",
      //data: row || req.body, //don't return req.body
      data: row,
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

//BItem

// get BItem
router.post("/get-bitem", async (req, res) => {
  try {
    const { bitem_items, bitem_bsins } = req.body;

    // Validate input
    if (!bitem_items || !bitem_bsins) {
      return res.json({
        success: false,
        message: "BItem ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT btm.id, btm.bitem_users, btm.bitem_items, btm.bitem_bsins, btm.bitem_lprat,
    btm.bitem_dprat, btm.bitem_mcmrp, btm.bitem_sddsp, btm.bitem_snote,
    btm.bitem_gstkq, btm.bitem_bstkq, btm.bitem_mnqty, btm.bitem_mxqty,
    btm.bitem_pbqty, btm.bitem_sbqty, btm.bitem_mpric, btm.bitem_jnote,
    btm.bitem_actve
    FROM tmib_bitem btm
    WHERE btm.bitem_items = $1
    AND btm.bitem_bsins = $2`;
    const params = [bitem_items, bitem_bsins];

    const row = await dbGet(sql, params, `Get BItem for ${bitem_items}`);

    res.json({
      success: true,
      message: "BItem fetched successfully",
      //data: row || req.body, //don't return req.body
      data: row,
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
router.post("/create-bitem", async (req, res) => {
  try {
    const {
      id,
      bitem_users,
      bitem_items,
      bitem_bsins,
      bitem_lprat,
      bitem_dprat,
      bitem_mcmrp,
      bitem_sddsp,
      bitem_snote,
      bitem_gstkq,
      bitem_bstkq,
      bitem_mnqty,
      bitem_mxqty,
      bitem_pbqty,
      bitem_sbqty,
      bitem_mpric,
      bitem_actve,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !bitem_users ||
      !bitem_items ||
      !bitem_bsins ||
      !bitem_mcmrp ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmib_bitem(id, bitem_users, bitem_items, bitem_bsins, bitem_lprat, bitem_dprat, 
    bitem_mcmrp, bitem_sddsp, bitem_snote, bitem_gstkq, bitem_bstkq, bitem_mnqty, bitem_mxqty, bitem_pbqty, 
    bitem_sbqty, bitem_mpric, bitem_actve, bitem_crusr, bitem_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, 
    $7, $8, $9, $10, $11, $12, $13, $14, 
    $15, $16, $17, $18, $19)`;
    const params = [
      id,
      bitem_users,
      bitem_items,
      bitem_bsins,
      bitem_lprat,
      bitem_dprat,
      bitem_mcmrp,
      bitem_sddsp,
      bitem_snote,
      bitem_gstkq,
      bitem_bstkq,
      bitem_mnqty,
      bitem_mxqty,
      bitem_pbqty,
      bitem_sbqty,
      bitem_mpric,
      bitem_actve,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create Business product for ${bitem_items}`);
    res.json({
      success: true,
      message: "Product Business created successfully",
      data: null,
    });
    //update business taggin count
    updateTagg(bitem_items);
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
router.post("/update-bitem", async (req, res) => {
  try {
    const {
      id,
      bitem_users,
      bitem_items,
      bitem_bsins,
      bitem_lprat,
      bitem_dprat,
      bitem_mcmrp,
      bitem_sddsp,
      bitem_snote,
      bitem_gstkq,
      bitem_bstkq,
      bitem_mnqty,
      bitem_mxqty,
      bitem_pbqty,
      bitem_sbqty,
      bitem_mpric,
      bitem_actve,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !bitem_users ||
      !bitem_items ||
      !bitem_bsins ||
      !bitem_mcmrp ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_bitem
    SET bitem_lprat = $1,
    bitem_dprat = $2,
    bitem_mcmrp = $3,
    bitem_sddsp = $4,
    bitem_snote = $5,
    bitem_mnqty = $6,
    bitem_mxqty = $7,
    bitem_mpric = $8,
    bitem_actve = $9,
    bitem_upusr = $10
    WHERE id = $11`;
    const params = [
      bitem_lprat,
      bitem_dprat,
      bitem_mcmrp,
      bitem_sddsp,
      bitem_snote,
      bitem_mnqty,
      bitem_mxqty,
      bitem_mpric,
      bitem_actve,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update Business product for ${bitem_items}`);
    res.json({
      success: true,
      message: "Product Business updated successfully",
      data: null,
    });

    //update business taggin count
    updateTagg(bitem_items);
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

//update count of business items
const updateTagg = async (id) => {
  const sql = `UPDATE tmib_items itm
  SET items_nofbi = (
      SELECT COUNT(*)
      FROM tmib_bitem b
      WHERE b.bitem_items = itm.id
  )
  WHERE itm.id = $1`;
  const params = [id];

  await dbRun(sql, params, `Update product tag for ${id}`);
};

const updateTagg_mysql = async (id) => {
  const sql = `UPDATE tmib_items itm
  JOIN (
      SELECT itm.bitem_items, count(id) as items_nofbi
      FROM tmib_bitem itm
      WHERE itm.bitem_items = $1
      GROUP BY itm.bitem_items      
  ) bitm
      ON itm.id = bitm.bitem_items
  SET itm.items_nofbi = bitm.items_nofbi`;
  const params = [id];

  await dbRun(sql, params, `Update product tag for ${id}`);
};

// get business items
router.post("/get-business-items", async (req, res) => {
  try {
    const { muser_id, bitem_bsins } = req.body;

    // Validate input
    if (!bitem_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT bitm.id, bitm.bitem_users, bitm.bitem_items, bitm.bitem_bsins, bitm.bitem_lprat,
    bitm.bitem_dprat, bitm.bitem_mcmrp, bitm.bitem_sddsp, bitm.bitem_snote,
    bitm.bitem_gstkq, bitm.bitem_bstkq, bitm.bitem_istkq, bitm.bitem_mnqty, bitm.bitem_mxqty, bitm.bitem_pbqty, 
    bitm.bitem_sbqty, bitm.bitem_mpric, bitm.bitem_actve,
    itm.items_icode, itm.items_iname, itm.items_idesc, itm.items_dfqty,
    puofm.iuofm_untnm as puofm_untnm,
    suofm.iuofm_untnm as suofm_untnm,    
    EXISTS (
      SELECT 1 
      FROM tmib_frmla frl 
      WHERE frl.frmla_mitem = bitm.bitem_items
    ) AS bitem_frmla
    FROM tmib_bitem bitm
    LEFT JOIN tmib_items itm on bitm.bitem_items = itm.id
    JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE bitm.bitem_bsins = $1
    AND bitm.bitem_users = $2
    ORDER BY bitm.bitem_gstkq DESC, bitm.bitem_istkq DESC`;
    const params = [bitem_bsins, muser_id];

    const rows = await dbGetAll(sql, params, `Get BItem for ${bitem_bsins}`);

    res.json({
      success: true,
      message: "BItem fetched successfully",
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

// get-purchase-invoice-items
router.post("/get-purchase-invoice-items", async (req, res) => {
  try {
    const { muser_id, bsins_id } = req.body;

    // Validate input
    if (!muser_id || !bsins_id) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    //1,2 Tracking Stock, Bulk Stock
    const sql = `SELECT itm.items_icode, itm.items_bcode, itm.items_hscod, itm.items_iname, itm.items_idesc,
    itm.items_puofm, itm.items_dfqty, itm.items_suofm, itm.items_ctgry, itm.items_brand,
    itm.items_itype, itm.items_sdvat, itm.items_costp, itm.items_image,
    btm.bitem_lprat, btm.bitem_dprat, btm.bitem_mcmrp, btm.bitem_sddsp, btm.bitem_gstkq,
    btm.bitem_bstkq, btm.bitem_istkq, btm.bitem_pbqty, btm.bitem_sbqty, btm.bitem_jnote,
    puofm.iuofm_untnm AS puofm_untnm, suofm.iuofm_untnm AS suofm_untnm,
    itm.id AS items_id, btm.id AS bitem_id, (btm.bitem_gstkq + btm.bitem_istkq) AS bitem_ohqty
    FROM tmib_items itm
    JOIN tmib_bitem btm ON itm.id = btm.bitem_items AND btm.bitem_users = itm.items_users
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE itm.items_trcks IN (1,2)
    AND itm.items_actve = TRUE
    AND itm.items_users = $1
    AND btm.bitem_bsins = $2
    AND btm.bitem_actve = TRUE
    AND itm.items_alpur = TRUE
    ORDER BY itm.items_iname`;
    const params = [muser_id, bsins_id];

    const rows = await dbGetAll(sql, params, `Get PI Item for ${muser_id}`);

    res.json({
      success: true,
      message: "PI Item fetched successfully",
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

// get-sales-invoice-items
router.post("/get-sales-invoice-items", async (req, res) => {
  try {
    const { muser_id, bsins_id } = req.body;

    // Validate input
    if (!muser_id || !bsins_id) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    //1,2 Tracking Stock, Bulk Stock, with stock
    const sql = `SELECT invt.*,
    puofm.iuofm_untnm AS puofm_untnm, suofm.iuofm_untnm AS suofm_untnm
    FROM (
    SELECT itm.items_icode, itm.items_bcode, itm.items_hscod, itm.items_iname, itm.items_idesc,
    itm.items_puofm, itm.items_dfqty, itm.items_suofm, itm.items_ctgry, itm.items_brand,
    itm.items_itype, itm.items_sdvat, itm.items_costp, itm.items_image,
    btm.bitem_lprat, btm.bitem_dprat, btm.bitem_mcmrp, btm.bitem_sddsp, btm.bitem_gstkq,
    btm.bitem_bstkq, btm.bitem_istkq, btm.bitem_pbqty, btm.bitem_sbqty, btm.bitem_jnote,
    itm.id AS items_id, btm.id AS bitem_id,
    'Inventory Stock' AS bitem_trnno, '{}' AS bitem_attrb, 'Inventory Stock' AS bitem_srcnm,
    btm.id AS bitem_refid, btm.bitem_gstkq AS bitem_ohqty
    FROM tmib_items itm
    JOIN tmib_bitem btm ON itm.id = btm.bitem_items AND btm.bitem_users = itm.items_users
    WHERE itm.items_trcks IN (2)
    AND itm.items_actve = TRUE
    AND itm.items_users = $1
    AND btm.bitem_bsins = $2
    AND btm.bitem_actve = TRUE
    AND btm.bitem_gstkq > 0
    AND itm.items_alsal = TRUE
    UNION ALL
    SELECT itm.items_icode, itm.items_bcode, itm.items_hscod, itm.items_iname, itm.items_idesc,
    itm.items_puofm, itm.items_dfqty, itm.items_suofm, itm.items_ctgry, itm.items_brand,
    itm.items_itype, itm.items_sdvat, itm.items_costp, itm.items_image,
    cinv.cinvc_itrat AS bitem_lprat, cinv.cinvc_dprat AS bitem_dprat, cinv.cinvc_mcmrp AS bitem_mcmrp, btm.bitem_sddsp, btm.bitem_gstkq,
    btm.bitem_bstkq, btm.bitem_istkq, btm.bitem_pbqty, btm.bitem_sbqty, btm.bitem_jnote,
    itm.id AS items_id, btm.id AS bitem_id,
    minv.minvc_trnno AS bitem_trnno, cinv.cinvc_attrb AS bitem_attrb, 'Purchase Invoice' AS bitem_srcnm,
    cinv.id AS bitem_refid, cinv.cinvc_ohqty AS bitem_ohqty
    FROM tmpb_cinvc cinv
    JOIN tmpb_minvc minv ON cinv.cinvc_minvc = minv.id
    JOIN tmib_items itm ON cinv.cinvc_items = itm.id AND itm.items_trcks = 1 AND itm.items_actve = TRUE AND itm.items_alsal = TRUE
    JOIN tmib_bitem btm ON itm.id = btm.bitem_items AND btm.bitem_users = itm.items_users
    WHERE minv.minvc_users = $1
    AND minv.minvc_bsins = $2
    AND cinv.cinvc_ohqty > 0
    )invt
    LEFT JOIN tmib_iuofm puofm ON invt.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON invt.items_suofm = suofm.id
    ORDER BY items_iname`;
    const params = [muser_id, bsins_id];

    const rows = await dbGetAll(sql, params, `Get SI Item for ${muser_id}`);

    res.json({
      success: true,
      message: "SI Item fetched successfully",
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

//get-booking-items
router.post("/get-purchase-booking-items", async (req, res) => {
  try {
    const { muser_id, bsins_id } = req.body;

    // Validate input
    if (!muser_id || !bsins_id) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT itm.items_icode, itm.items_bcode, itm.items_hscod, itm.items_iname, itm.items_idesc,
    itm.items_puofm, itm.items_dfqty, itm.items_suofm, itm.items_ctgry, itm.items_brand,
    itm.items_itype, itm.items_sdvat, itm.items_costp, itm.items_image,
    btm.bitem_lprat, btm.bitem_dprat, btm.bitem_mcmrp, btm.bitem_sddsp, btm.bitem_gstkq,
    btm.bitem_bstkq, btm.bitem_istkq, btm.bitem_pbqty, btm.bitem_sbqty, btm.bitem_jnote,
    puofm.iuofm_untnm AS puofm_untnm, suofm.iuofm_untnm AS suofm_untnm,
    itm.id AS items_id, btm.id AS bitem_id
    FROM tmib_items itm
    JOIN tmib_bitem btm ON itm.id = btm.bitem_items AND btm.bitem_users = itm.items_users
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE itm.items_trcks IN (0,1,2)
    AND itm.items_actve = TRUE
    AND itm.items_users = $1
    AND btm.bitem_bsins = $2
    AND btm.bitem_actve = TRUE
    AND itm.items_alpur = TRUE
    ORDER BY itm.items_iname`;
    const params = [muser_id, bsins_id];

    const rows = await dbGetAll(sql, params, `Get BItem for ${muser_id}`);

    res.json({
      success: true,
      message: "BItem fetched successfully",
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

//get-transfer-items
router.post("/get-transfer-items", async (req, res) => {
  try {
    const { bitem_users, bitem_bsins } = req.body;

    // Validate input
    if (!bitem_users || !bitem_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT itm.items_icode, itm.items_iname,
    stk.cinvc_bitem AS ctrsf_bitem, stk.cinvc_items AS ctrsf_items,
stk.minvc_trnno AS ctrsf_trnno, stk.cinvc_itrat AS ctrsf_itrat, stk.cinvc_attrb AS ctrsf_attrb, stk.cinvc_ohqty AS ctrsf_ohqty,
stk.ctrsf_srcnm, stk.id AS ctrsf_refid,
puofm.iuofm_untnm as puofm_untnm,
itm.items_dfqty,
suofm.iuofm_untnm as suofm_untnm
FROM tmib_items itm
JOIN (
SELECT minv.minvc_trnno, cinv.cinvc_bitem, cinv.cinvc_items, cinv.cinvc_itrat, cinv.cinvc_attrb, cinv.cinvc_ohqty,
'Purchase Invoice' AS ctrsf_srcnm, cinv.id
FROM tmpb_cinvc cinv
JOIN tmpb_minvc minv ON cinv.cinvc_minvc = minv.id
JOIN tmib_items itm ON cinv.cinvc_items = itm.id AND itm.items_trcks = 1
WHERE minv.minvc_users = ?
AND minv.minvc_bsins = ?
AND cinv.cinvc_ohqty > 0
UNION ALL
SELECT mrpt.mrcpt_trnno, crpt.crcpt_bitem, crpt.crcpt_items, crpt.crcpt_itrat, crpt.crcpt_attrb, crpt.crcpt_ohqty,
'Purchase Receipt' AS ctrsf_srcnm, crpt.id
FROM tmpb_crcpt crpt
JOIN tmpb_mrcpt mrpt ON crpt.crcpt_mrcpt = mrpt.id
JOIN tmib_items itm ON crpt.crcpt_items = itm.id AND itm.items_trcks = 1
WHERE mrpt.mrcpt_users = ?
AND mrpt.mrcpt_bsins = ?
AND crpt.crcpt_ohqty > 0
UNION ALL
SELECT 'Inventory Stock' AS bitem_trnno, bitm.id as bitem_bitem, bitm.bitem_items, bitm.bitem_lprat,
'{}' AS bitem_attrb, bitm.bitem_gstkq,'Inventory Stock' AS bitem_srcnm, bitm.id
FROM tmib_bitem bitm


JOIN tmib_items itm ON bitm.bitem_items = itm.id AND itm.items_trcks = 0
WHERE bitm.bitem_users = ?
AND bitm.bitem_bsins = ?
AND bitm.bitem_gstkq > 0
)stk ON itm.id = stk.cinvc_items
JOIN tmib_bitem bitm ON stk.cinvc_bitem = bitm.id
AND stk.cinvc_items = bitm.bitem_items AND itm.id = bitm.bitem_items
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE itm.items_users = ?
AND bitm.bitem_bsins = ?`;
    const params = [
      bitem_users,
      bitem_bsins,
      bitem_users,
      bitem_bsins,
      bitem_users,
      bitem_bsins,
      bitem_users,
      bitem_bsins,
    ];

    const rows = await dbGetAll(
      sql,
      params,
      `Get transfer items for ${bitem_bsins}`,
    );

    res.json({
      success: true,
      message: "Transfer items fetched successfully",
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

//get-sales-items
router.post("/get-sales-items", async (req, res) => {
  try {
    const { bitem_users, bitem_bsins } = req.body;

    // Validate input
    if (!bitem_users || !bitem_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT itm.items_icode, itm.items_bcode, itm.items_iname, itm.items_sdvat,
    bitm.id, bitm.bitem_items, bitm.bitem_lprat, bitm.bitem_dprat, bitm.bitem_mcmrp,
    bitm.bitem_sddsp, bitm.bitem_gstkq, bitm.bitem_istkq,
    stk.cinvc_csrat AS bitem_csrat, stk.cinvc_attrb AS bitem_attrb, stk.cinvc_srcnm AS bitem_srcnm,
    stk.id AS bitem_refid, stk.minvc_trnno AS bitem_refno, 
    stk.cinvc_ohqty AS bitem_ohqty,
puofm.iuofm_untnm as puofm_untnm,
itm.items_dfqty,
suofm.iuofm_untnm as suofm_untnm
FROM tmib_items itm
JOIN (
SELECT minv.minvc_trnno, cinv.cinvc_bitem, cinv.cinvc_items, cinv.cinvc_csrat, cinv.cinvc_attrb, cinv.cinvc_ohqty,
'Purchase Invoice' AS cinvc_srcnm, cinv.id
FROM tmpb_cinvc cinv
JOIN tmpb_minvc minv ON cinv.cinvc_minvc = minv.id
JOIN tmib_items itm ON cinv.cinvc_items = itm.id AND itm.items_trcks = 1
WHERE minv.minvc_users = ?
AND minv.minvc_bsins = ?
AND cinv.cinvc_ohqty > 0
UNION ALL
SELECT mrpt.mrcpt_trnno, crpt.crcpt_bitem, crpt.crcpt_items, crpt.crcpt_csrat, crpt.crcpt_attrb, crpt.crcpt_ohqty,
'Purchase Receipt' AS ctrsf_srcnm, crpt.id
FROM tmpb_crcpt crpt
JOIN tmpb_mrcpt mrpt ON crpt.crcpt_mrcpt = mrpt.id
JOIN tmib_items itm ON crpt.crcpt_items = itm.id AND itm.items_trcks = 1
WHERE mrpt.mrcpt_users = ?
AND mrpt.mrcpt_bsins = ?
AND crpt.crcpt_ohqty > 0
UNION ALL
SELECT 'Inventory Stock' AS bitem_trnno, bitm.id as bitem_bitem, bitm.bitem_items, bitm.bitem_lprat, '{}' AS bitem_attrb, bitm.bitem_gstkq,
'Inventory Stock' AS bitem_srcnm, bitm.id
FROM tmib_bitem bitm
JOIN tmib_items itm ON bitm.bitem_items = itm.id AND itm.items_trcks = 0
WHERE bitm.bitem_users = ?
AND bitm.bitem_bsins = ?
AND bitm.bitem_gstkq > 0
)stk ON itm.id = stk.cinvc_items
JOIN tmib_bitem bitm ON stk.cinvc_bitem = bitm.id
AND stk.cinvc_items = bitm.bitem_items AND itm.id = bitm.bitem_items
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE itm.items_users = ?
AND bitm.bitem_bsins = ?`;
    const params = [
      bitem_users,
      bitem_bsins,
      bitem_users,
      bitem_bsins,
      bitem_users,
      bitem_bsins,
      bitem_users,
      bitem_bsins,
    ];

    const rows = await dbGetAll(
      sql,
      params,
      `Get sales items for ${bitem_bsins}`,
    );

    res.json({
      success: true,
      message: "Sales items fetched successfully",
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

//get-sales-booking-items
router.post("/get-sales-booking-items", async (req, res) => {
  try {
    const { bitem_users, bitem_bsins } = req.body;

    // Validate input
    if (!bitem_users || !bitem_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT itm.items_icode, itm.items_bcode, itm.items_iname, itm.items_sdvat,
    bitm.id, bitm.bitem_items, bitm.bitem_lprat, bitm.bitem_dprat, bitm.bitem_mcmrp,
    bitm.bitem_sddsp, bitm.bitem_gstkq, bitm.bitem_istkq,
    bitm.bitem_lprat bitem_csrat, '{}' AS bitem_attrb, '-' AS bitem_srcnm,
    '-' AS bitem_refid, 'Inventory Stock' AS bitem_refno, 
    0 bitem_ohqty,
puofm.iuofm_untnm as puofm_untnm,
itm.items_dfqty,
suofm.iuofm_untnm as suofm_untnm
FROM tmib_items itm
JOIN tmib_bitem bitm ON itm.id = bitm.bitem_items
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE itm.items_users = ?
AND bitm.bitem_bsins = ?`;
    const params = [bitem_users, bitem_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get sales items for ${bitem_bsins}`,
    );

    res.json({
      success: true,
      message: "Sales items fetched successfully",
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
