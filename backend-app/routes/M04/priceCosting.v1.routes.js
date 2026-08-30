const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { pcost_mcatg, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!pcost_mcatg || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cst.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_pcost cst
    LEFT JOIN tmhb_emply csr ON cst.pcost_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON cst.pcost_upusr = usr.id
    WHERE cst.pcost_users = $1
    AND cst.pcost_mcatg = $2
    ORDER BY cst.pcost_csamt DESC`;

    const sql1 = `SELECT cst.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 AS edit_stop,
    ROUND(
        (cst.pcost_csamt / NULLIF(SUM(cst.pcost_csamt) OVER (), 0)) * 100,
        2
    ) AS pcost_ratio
FROM tmib_pcost cst
LEFT JOIN tmhb_emply csr ON cst.pcost_crusr = csr.id
LEFT JOIN tmhb_emply usr ON cst.pcost_upusr = usr.id
WHERE cst.pcost_users = $1
  AND cst.pcost_mcatg = $2
ORDER BY cst.pcost_csamt DESC
`;

    const params = [user_c, pcost_mcatg];
    const rows = await dbGetAll(sql, params, `get costing - ${user_c}`);
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
    const sql = `SELECT prc.*, itm.items_iname, dpt.dpart_cname, 0 as edit_stop
    FROM tmib_price prc
    LEFT JOIN tmib_items itm ON prc.pcost_party = itm.id
    LEFT JOIN tmsb_dpart dpt ON prc.pcost_mcatg = dpt.id
    WHERE prc.pcost_users = $1
    AND prc.pcost_actve = TRUE
    ORDER BY itm.items_iname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get price- ${user_c}`);
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
      pcost_users,
      pcost_bsins,
      pcost_ccode,
      pcost_mcatg,
      pcost_party,
      pcost_csamt,
      pcost_csrto,
      pcost_notes,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !pcost_mcatg ||
      !pcost_party ||
      !pcost_csamt ||
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
    const newCode = await GenNewCode(user_c, "tmib_pcost");

    const sql = `INSERT INTO tmib_pcost(id, pcost_users, pcost_bsins, pcost_ccode, pcost_mcatg, pcost_party,
                              pcost_csamt, pcost_csrto, pcost_notes, pcost_crusr, pcost_upusr)
                VALUES ($1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11)`;

    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      pcost_mcatg,
      pcost_party,
      pcost_csamt,
      pcost_csrto || 0,
      pcost_notes || "",
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create costing- ${user_c}`);
    res.json({
      success: true,
      message: `Costing - ${pcost_party} Created successfully.`,
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
      pcost_users,
      pcost_bsins,
      pcost_ccode,
      pcost_mcatg,
      pcost_party,
      pcost_csamt,
      pcost_csrto,
      pcost_notes,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !pcost_mcatg ||
      !pcost_party ||
      !pcost_csamt ||
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
    const sql = `UPDATE tmib_pcost
    SET pcost_party = $1,
    pcost_csamt = $2,
    pcost_csrto = $3,
    pcost_notes = $4,
    pcost_upusr = $5,
    pcost_updat = CURRENT_TIMESTAMP,
    pcost_rvnmr = pcost_rvnmr + 1
    WHERE id = $6`;

    const params = [
      pcost_party,
      pcost_csamt,
      pcost_csrto || 0,
      pcost_notes || "",
      user_s,
      id,
    ];

    await dbRun(sql, params, `update costing- ${user_c}`);
    res.json({
      success: true,
      message: `Costing - ${pcost_party} Updated successfully.`,
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
    const { id, pcost_party, pcost_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !pcost_party || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_pcost
    SET pcost_actve = NOT pcost_actve,
    pcost_upusr = $1,
    pcost_updat = CURRENT_TIMESTAMP,
    pcost_rvnmr = pcost_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete costing- ${user_c}`);
    res.json({
      success: true,
      message: `Costing - ${pcost_party ? "Deactivate" : "Activate"} successfully.`,
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

// get-price
router.post("/get-price", async (req, res) => {
  try {
    const { price_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!price_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
 const sql1 = `SELECT prc.id, prc.price_lprat, COALESCE(cst.pcost_csamt, price_lprat + price_lprat * 0.1 ) AS pcost_csamt
FROM tmib_price prc
JOIN tmib_items itm ON prc.price_items = itm.id
JOIN tmib_scatg sct ON itm.items_scatg = sct.id
LEFT JOIN tmib_pcost cst ON sct.scatg_mcatg = cst.pcost_mcatg
WHERE prc.price_users = $1
AND prc.id = $2`;

const sql2 = `SELECT prc.id, prc.price_lprat, COALESCE(cst.pcost_party,'Default') AS pcost_party, 
COALESCE(cst.pcost_csamt, price_lprat + price_lprat * 0.1 ) AS pcost_csamt
FROM tmib_price prc
JOIN tmib_items itm ON prc.price_items = itm.id
JOIN tmib_scatg sct ON itm.items_scatg = sct.id
LEFT JOIN tmib_pcost cst ON sct.scatg_mcatg = cst.pcost_mcatg
WHERE prc.price_users = $1
AND prc.id = $2`;

const sql = `SELECT prc.id, prc.price_lprat, cst.pcost_party,
CASE 
	WHEN COALESCE(cst.pcost_csamt,0) > 0 THEN cst.pcost_csamt
ELSE 
	(prc.price_lprat * cst.pcost_csrto / 100)
END as pcost_csamt,
cst.pcost_csrto
FROM tmib_price prc
JOIN tmib_items itm ON prc.price_items = itm.id
JOIN tmib_scatg sct ON itm.items_scatg = sct.id
LEFT JOIN tmib_pcost cst ON sct.scatg_mcatg = cst.pcost_mcatg
WHERE prc.price_users = $1
AND prc.id = $2
UNION ALL
SELECT prc.id, prc.price_lprat, 'Product Cost' pcost_party,
prc.price_lprat pcost_csamt, 0 pcost_csrto
FROM tmib_price prc
WHERE prc.price_users = $1
AND prc.id = $2`;

    const params = [user_c, price_id];
    const rows = await dbGetAll(sql, params, `get costing - ${user_c}`);
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
