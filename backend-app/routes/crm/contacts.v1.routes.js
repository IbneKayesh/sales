const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genTableCode");

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
    const sql = `SELECT cnt.*,
    try.trtry_wname, tar.tarea_tname, dzn.dzone_dname, ctr.shtbl_dtext AS cntry_cname, crn.shtbl_dtext AS crncy_cname,
    prc.price_mname, csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmcb_cntct cnt
    LEFT JOIN tmcb_trtry try ON cnt.cntct_trtry = try.id
    LEFT JOIN tmcb_tarea tar ON cnt.cntct_tarea = tar.id
    LEFT JOIN tmcb_dzone dzn ON cnt.cntct_dzone = dzn.id
    JOIN tmnb_shtbl ctr ON cnt.cntct_cntry = ctr.shtbl_value AND ctr.shtbl_gname = 'Country'
    JOIN tmnb_shtbl crn ON cnt.cntct_crncy = crn.shtbl_value AND crn.shtbl_gname = 'Currency'
    LEFT JOIN tmib_price prc ON cnt.cntct_price = prc.id
    LEFT JOIN tmnb_users csr ON cnt.cntct_crusr = csr.id
    LEFT JOIN tmnb_users usr ON cnt.cntct_upusr = usr.id
    WHERE cnt.cntct_apusr = $1
    ORDER BY cnt.cntct_cntnm ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact- ${user_c}`);
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
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_apusr = $1
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cntnm ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact- ${user_c}`);
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
      cntct_apusr,
      cntct_bsins,
      cntct_ctype,
      cntct_sorce,
      cntct_ccode,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_trtry,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_crncy,
      cntct_price,
      cntct_dspct,
      cntct_crlmt,
      cntct_crbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !cntct_ctype ||
      !cntct_sorce ||
      !cntct_cntnm ||
      !cntct_cntps ||
      !cntct_cntno ||
      !cntct_cntry ||
      !cntct_crncy ||
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
    const newCode = await GenNewCode(user_c, "tmcb_cntct");

    const sql = `INSERT INTO tmcb_cntct(id, cntct_apusr, cntct_bsins, cntct_ctype, cntct_sorce, cntct_ccode,
        cntct_cntnm, cntct_cntps, cntct_cntno, cntct_email, cntct_tinno, cntct_trade,
        cntct_ofadr, cntct_fcadr, cntct_trtry, cntct_tarea, cntct_dzone, cntct_cntry,
        cntct_cntad, cntct_crncy, cntct_price, cntct_dspct, cntct_crlmt, cntct_crbal, cntct_crusr, cntct_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      cntct_ctype,
      cntct_sorce,
      newCode,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_trtry,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_crncy,
      cntct_price,
      cntct_dspct || 0,
      cntct_crlmt || 0,
      0, //cntct_crbal
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create contact- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cntnm} - Created successfully.`,
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
      cntct_apusr,
      cntct_bsins,
      cntct_ctype,
      cntct_sorce,
      cntct_ccode,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_trtry,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_crncy,
      cntct_price,
      cntct_dspct,
      cntct_crlmt,
      cntct_crbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !id ||
      !cntct_ctype ||
      !cntct_sorce ||
      !cntct_cntnm ||
      !cntct_cntps ||
      !cntct_cntno ||
      !cntct_cntry ||
      !cntct_crncy ||
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
    const sql = `UPDATE tmcb_cntct
    SET cntct_ctype = $1,
    cntct_sorce = $2,
    cntct_cntnm = $3,
    cntct_cntps = $4,
    cntct_cntno = $5,
    cntct_email = $6,
    cntct_tinno = $7,
    cntct_trade = $8,
    cntct_ofadr = $9,
    cntct_fcadr = $10,
    cntct_trtry = $11,
    cntct_tarea = $12,
    cntct_dzone = $13,
    cntct_cntry = $14,
    cntct_cntad = $15,
    cntct_crncy = $16,
    cntct_price = $17,
    cntct_dspct = $18,
    cntct_crlmt = $19,
    cntct_upusr = $20,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $21`;
    const params = [
      cntct_ctype,
      cntct_sorce,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_trtry,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_crncy,
      cntct_price,
      cntct_dspct,
      cntct_crlmt,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update contact- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cntnm} - Updated successfully.`,
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
    const { id, cntct_cntnm, dzone_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !cntct_cntnm || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntct
    SET cntct_actve = NOT cntct_actve,
    cntct_upusr = $1,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete contact- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cntnm} - ${dzone_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-address
router.post("/get-address", async (req, res) => {
  try {
    const { cntad_cntct, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!cntad_cntct || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT tad.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmcb_cntad tad
    LEFT JOIN tmnb_users csr ON tad.cntad_crusr = csr.id
    LEFT JOIN tmnb_users usr ON tad.cntad_upusr = usr.id
    WHERE tad.cntad_apusr = $1
    AND tad.cntad_cntct = $2
    ORDER BY tad.cntad_ofadr ASC`;

    const params = [user_c, cntad_cntct];
    const rows = await dbGetAll(sql, params, `get address- ${user_c}`);
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

router.post("/upsert-address", async (req, res) => {
  try {
    const {
      id,
      cntad_cntct,
      cntad_cntps,
      cntad_cntno,
      cntad_email,
      cntad_ofadr,
      cntad_notes,
      cntad_gmaps,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (id) {
      // Validate input
      if (
        !cntad_cntct ||
        !cntad_cntps ||
        !cntad_cntno ||
        !cntad_email ||
        !cntad_ofadr ||
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

      const sql = `UPDATE tmcb_cntad
      SET cntad_cntps = $1,
      cntad_cntno = $2,
      cntad_email = $3,
      cntad_ofadr = $4,
      cntad_notes = $5,
      cntad_gmaps = $6,
      cntad_upusr = $7,
      cntad_updat = CURRENT_TIMESTAMP,
      cntad_rvnmr = cntad_rvnmr + 1
      WHERE id = $8`;
      const params = [
        cntad_cntps,
        cntad_cntno,
        cntad_email,
        cntad_ofadr,
        cntad_notes,
        cntad_gmaps,
        user_s,
        id,
      ];

      await dbRun(sql, params, `update address- ${user_c}`);
      res.json({
        success: true,
        message: `${cntad_ofadr} - Updated successfully.`,
        data: {},
      });
    } else {
      // Validate input
      if (
        !cntad_cntct ||
        !cntad_cntps ||
        !cntad_cntno ||
        !cntad_email ||
        !cntad_ofadr ||
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
      const sql = `INSERT INTO tmcb_cntad(id, cntad_apusr, cntad_bsins, cntad_cntct, cntad_cntps, cntad_cntno,
      cntad_email, cntad_ofadr, cntad_notes, cntad_gmaps, cntad_crusr, cntad_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12)`;
      const params = [
        uuidv4(),
        user_c,
        user_b,
        cntad_cntct,
        cntad_cntps,
        cntad_cntno,
        cntad_email,
        cntad_ofadr,
        cntad_notes,
        cntad_gmaps,
        user_s,
        user_s,
      ];

      await dbRun(sql, params, `create address- ${user_c}`);
      res.json({
        success: true,
        message: `${cntad_ofadr} - Created successfully.`,
        data: {},
      });
    }
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

// delete-address
router.post("/delete-address", async (req, res) => {
  try {
    const { id, cntad_ofadr, cntad_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !cntad_ofadr || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntad
    SET cntad_actve = NOT cntad_actve,
    cntad_upusr = $1,
    cntad_updat = CURRENT_TIMESTAMP,
    cntad_rvnmr = cntad_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete contact address- ${user_c}`);
    res.json({
      success: true,
      message: `${cntad_ofadr} - ${cntad_actve ? "Deactivate" : "Activate"} successfully.`,
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

module.exports = router;
