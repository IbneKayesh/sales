const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode, GenNewTrn } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { mrrmt_dpart, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrm.*,
    cnt.cntct_cntnm,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_mrrmt mrm
    JOIN tmcb_cntct cnt ON mrm.mrrmt_cntct = cnt.id
    LEFT JOIN tmnb_users csr ON mrm.mrrmt_crusr = csr.id
    LEFT JOIN tmnb_users usr ON mrm.mrrmt_upusr = usr.id
    WHERE mrm.mrrmt_apusr = $1
    AND mrm.mrrmt_bsins = $2
    AND mrm.mrrmt_dpart = $3
    ORDER BY mrm.mrrmt_trdat DESC`;

    const params = [user_c, user_b, mrrmt_dpart];
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
      mrrmt_apusr,
      mrrmt_bsins,
      mrrmt_dpart,
      mrrmt_cntct,
      mrrmt_trnno,
      mrrmt_trdat,
      mrrmt_refno,
      mrrmt_notes,
      mrrmt_tramt,
      mrrmt_itmds,
      mrrmt_invds,
      mrrmt_vtamt,
      mrrmt_txamt,
      mrrmt_icamt,
      mrrmt_ecamt,
      mrrmt_pyamt,
      mrrmt_pdamt,
      mrrmt_duamt,
      mrrmt_ipost,
      mrrmt_ipaid,
      mrrmt_isqcp,
      tmib_mrrdt,
      user_s,
      user_c,
      user_b,
    } = req.body;

    console.log("req", req);

    // Validate input
    if (
      !mrrmt_dpart ||
      !mrrmt_cntct ||
      !mrrmt_trdat ||
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

    const newTrn = await GenNewTrn(
      user_c,
      user_b,
      "tmib_mrrmt",
      "Material Receive",
      mrrmt_dpart,
    );

    //build scripts
    const masterId = uuidv4();
    const scripts = [];

    //const newCode = await GenNewCode(user_c, "tmib_mrrmt");

    scripts.push({
      sql: `INSERT INTO tmib_mrrmt(id, mrrmt_apusr, mrrmt_bsins, mrrmt_dpart, mrrmt_cntct, mrrmt_trnno,
        mrrmt_trdat, mrrmt_refno, mrrmt_notes, mrrmt_tramt, mrrmt_itmds, mrrmt_invds,
        mrrmt_vtamt, mrrmt_txamt, mrrmt_icamt, mrrmt_ecamt, mrrmt_pyamt, mrrmt_pdamt,
        mrrmt_duamt, mrrmt_ipost, mrrmt_ipaid, mrrmt_isqcp, mrrmt_crusr, mrrmt_upusr)
          VALUES ($1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24)`,
      params: [
        masterId,
        user_c,
        user_b,
        mrrmt_dpart,
        mrrmt_cntct,
        newTrn,
        mrrmt_trdat,
        mrrmt_refno,
        mrrmt_notes,
        mrrmt_tramt,
        mrrmt_itmds,
        mrrmt_invds,
        mrrmt_vtamt,
        mrrmt_txamt,
        mrrmt_icamt,
        mrrmt_ecamt,
        mrrmt_pyamt,
        mrrmt_pdamt,
        mrrmt_duamt,
        mrrmt_ipost,
        mrrmt_ipaid,
        mrrmt_isqcp,
        user_s,
        user_s,
      ],
      label: `create MRR- ${newTrn}`,
    });

    for (const det of tmib_mrrdt) {
      scripts.push({
        sql: `INSERT INTO tmib_mrrdt(id, mrrdt_apusr, mrrdt_bsins, mrrdt_mrrmt, mrrdt_price, mrrdt_items,
        mrrdt_trate, mrrdt_trqty, mrrdt_tramt, mrrdt_dspct, mrrdt_dsamt, mrrdt_sdvat,
        mrrdt_txpct, mrrdt_fxcst, mrrdt_otcst, mrrdt_ntamt, mrrdt_notes, mrrdt_csrat,
        mrrdt_crusr, mrrdt_upusr)
          VALUES ($1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          masterId,
          det.mrrdt_price,
          det.mrrdt_items,
          det.mrrdt_trate,
          det.mrrdt_trqty,
          det.mrrdt_tramt,
          det.mrrdt_dspct,
          det.mrrdt_dsamt,
          det.mrrdt_sdvat,
          det.mrrdt_txpct,
          det.mrrdt_fxcst,
          det.mrrdt_otcst,
          det.mrrdt_ntamt,
          det.mrrdt_notes,
          det.mrrdt_csrat,
          user_s,
          user_s,
        ],
        label: `Created MRR detail ${newTrn}`,
      });
    }

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${newTrn} - Created successfully.`,
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



// get-mrr-items
router.post("/get-mrr-items", async (req, res) => {
  try {
    const { mrrdt_mrrmt, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrd.*,
    itm.items_icode, itm.items_iname, itm.items_pkqty, 
    runit.units_uname as runit_uname,
    punit.units_uname as punit_uname,
    sgrup.sgrup_sname as sgrup_sname
    FROM tmib_mrrdt mrd
    JOIN tmib_items itm ON mrd.mrrdt_items = itm.id   
    JOIN tmib_units runit ON itm.items_runit = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    WHERE mrrdt_mrrmt = $1`;

    //const params = [user_c, user_b];
    const params = [mrrdt_mrrmt];
    const rows = await dbGetAll(sql, params, `get mrr items- ${user_c}`);
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
