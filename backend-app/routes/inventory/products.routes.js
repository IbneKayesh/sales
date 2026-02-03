const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { items_users } = req.body;

    // Validate input
    if (!items_users) {
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
      ctgry.ctgry_ctgnm
      FROM tmib_items tbl
      LEFT JOIN tmib_iuofm puofm ON tbl.items_puofm = puofm.id
      LEFT JOIN tmib_iuofm suofm ON tbl.items_suofm = suofm.id
      LEFT JOIN tmib_ctgry ctgry ON tbl.items_ctgry = ctgry.id
      WHERE tbl.items_users = ?
      ORDER BY tbl.items_icode`;
    const params = [items_users];

    const rows = await dbGetAll(sql, params, `Get products for ${items_users}`);
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
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !items_users ||
      !items_iname ||
      !items_puofm ||
      !items_suofm ||
      !items_ctgry ||
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
    items_dfqty, items_suofm, items_ctgry, items_itype, items_trcks, items_sdvat, 
    items_costp, items_crusr, items_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
    ?, ?, ?, ?, ?, ?, ?, 
    ?, ?, ?)`;
    const params = [
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
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      user_id,
      user_id,
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
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !items_users ||
      !items_iname ||
      !items_puofm ||
      !items_suofm ||
      !items_ctgry ||
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
    SET items_icode = ?,
    items_bcode = ?,
    items_hscod = ?,
    items_iname = ?,
    items_idesc = ?,
    items_puofm = ?,
    items_dfqty = ?,
    items_suofm = ?,
    items_ctgry = ?,
    items_itype = ?,
    items_trcks = ?,
    items_sdvat = ?,
    items_costp = ?,
    items_upusr = ?
    WHERE id = ?`;
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
      items_itype,
      items_trcks,
      items_sdvat,
      items_costp,
      user_id,
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
    const { id, items_iname } = req.body;

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
    SET items_actve = 1 - items_actve
    WHERE id = ?`;
    const params = [id];

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
    const sql = `SELECT id, bitem_users, bitem_items, bitem_bsins, bitem_lprat, bitem_dprat, bitem_mcmrp, bitem_sddsp, bitem_snote,
    bitem_gstkq, bitem_bstkq, bitem_mnqty, bitem_mxqty, bitem_pbqty, bitem_sbqty, bitem_mpric, bitem_actve
    FROM tmib_bitem
    WHERE bitem_items = ?
    AND bitem_bsins = ?`;
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
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !bitem_users ||
      !bitem_items ||
      !bitem_bsins ||
      !bitem_mcmrp ||
      !user_id
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
    VALUES (?, ?, ?, ?, ?, ?, 
    ?, ?, ?, ?, ?, ?, ?, ?, 
    ?, ?, ?, ?, ?)`;
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
      user_id,
      user_id,
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
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !bitem_users ||
      !bitem_items ||
      !bitem_bsins ||
      !bitem_mcmrp ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_bitem
    SET bitem_lprat = ?,
    bitem_dprat = ?,
    bitem_mcmrp = ?,
    bitem_sddsp = ?,
    bitem_snote = ?,
    bitem_mnqty = ?,
    bitem_mxqty = ?,
    bitem_mpric = ?,
    bitem_actve = ?,
    bitem_upusr = ?
    WHERE id = ?`;
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
      user_id,
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
  JOIN (
      SELECT itm.bitem_items, count(id) as items_nofbi
      FROM tmib_bitem itm
      WHERE itm.bitem_items = ?
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
    const { bitem_bsins } = req.body;

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
    itm.items_iname, itm.items_idesc
    FROM tmib_bitem bitm
    LEFT JOIN tmib_items itm on bitm.bitem_items = itm.id
    WHERE bitm.bitem_bsins = ?`;
    const params = [bitem_bsins];

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


//get-booking-items
router.post("/get-booking-items", async (req, res) => {
  try {
    const { bitem_bsins } = req.body;

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
    bitm.bitem_gstkq, bitm.bitem_bstkq, bitm.bitem_istkq, bitm.bitem_mnqty, bitm.bitem_mxqty, 
    bitm.bitem_pbqty, bitm.bitem_sbqty, bitm.bitem_mpric, bitm.bitem_actve,
    itm.items_icode, itm.items_iname, itm.items_idesc, itm.items_sdvat,
    puofm.iuofm_untnm as puofm_untnm,
    itm.items_dfqty,
    suofm.iuofm_untnm as suofm_untnm
    FROM tmib_bitem bitm
    LEFT JOIN tmib_items itm on bitm.bitem_items = itm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE bitm.bitem_bsins = ?
    AND bitm.bitem_actve = 1`;
    const params = [bitem_bsins];

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
    const params = [bitem_users, bitem_bsins, bitem_users, bitem_bsins, bitem_users, bitem_bsins, bitem_users, bitem_bsins];

    const rows = await dbGetAll(sql, params, `Get transfer items for ${bitem_bsins}`);

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
    const params = [bitem_users, bitem_bsins, bitem_users, bitem_bsins, bitem_users, bitem_bsins, bitem_users, bitem_bsins];

    const rows = await dbGetAll(sql, params, `Get sales items for ${bitem_bsins}`);

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
