const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { route_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    let sql = `SELECT crt.*, rut.route_rname, rut.route_dname, osr.emply_cname,
    cnt.cntct_cname, cnt.cntct_cntps, cnt.cntct_cntno,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmcb_rtcnt crt
    LEFT JOIN tmcb_route rut ON crt.rtcnt_route = rut.id
    LEFT JOIN tmhb_emply osr ON crt.rtcnt_emply = osr.id
    LEFT JOIN tmcb_cntct cnt ON crt.rtcnt_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON crt.rtcnt_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON crt.rtcnt_upusr = usr.id
    WHERE crt.rtcnt_users = $1`;
    const params = [user_c];

    // Optional district zone filter
    if (route_id) {
      sql += ` AND crt.rtcnt_route = $2`;
      params.push(route_id);
    }
    sql += ` ORDER BY crt.route_srial ASC`;
    const rows = await dbGetAll(sql, params, `get rtcnt- ${user_c}`);
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
    const sql = `SELECT crt.*, 0 as edit_stop
    FROM tmcb_rtcnt crt
    WHERE crt.rtcnt_users = $1
    AND crt.rtcnt_actve = TRUE
    ORDER BY crt.rtcnt_srial ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get rtcnt- ${user_c}`);
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
      rtcnt_users,
      rtcnt_bsins,
      rtcnt_ccode,
      rtcnt_route,
      rtcnt_cntct,
      rtcnt_emply,
      rtcnt_srial,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !rtcnt_route ||
      !rtcnt_cntct ||
      !rtcnt_emply ||
      !rtcnt_srial ||
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
    const newCode = await GenNewCode(user_c, "tmcb_rtcnt");

    const sql = `INSERT INTO tmcb_rtcnt(id, rtcnt_users, rtcnt_bsins, rtcnt_ccode, rtcnt_route, rtcnt_cntct,
                              rtcnt_emply, rtcnt_srial, rtcnt_crusr, rtcnt_upusr)
                      VALUES ($1, $2, $3, $4, $5, $6,
                            $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      rtcnt_route,
      rtcnt_cntct,
      rtcnt_emply,
      rtcnt_srial,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create rtcnt- ${user_c}`);
    res.json({
      success: true,
      message: `${rtcnt_srial} - Created successfully.`,
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
      rtcnt_users,
      rtcnt_bsins,
      rtcnt_ccode,
      rtcnt_route,
      rtcnt_cntct,
      rtcnt_emply,
      rtcnt_srial,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !rtcnt_route ||
      !rtcnt_cntct ||
      !rtcnt_emply ||
      !rtcnt_srial ||
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
    const sql = `UPDATE tmcb_rtcnt
    SET rtcnt_cntct = $1,
    rtcnt_emply = $2,
    rtcnt_srial = $3,
    rtcnt_upusr = $4,
    rtcnt_updat = CURRENT_TIMESTAMP,
    rtcnt_rvnmr = rtcnt_rvnmr + 1
    WHERE id = $5`;
    const params = [rtcnt_cntct, rtcnt_emply, rtcnt_srial, user_s, id];

    await dbRun(sql, params, `update rtcnt- ${user_c}`);
    res.json({
      success: true,
      message: `${rtcnt_srial} - Updated successfully.`,
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
    const { id, rtcnt_rname, rtcnt_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !rtcnt_rname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_rtcnt
    SET rtcnt_actve = NOT rtcnt_actve,
    rtcnt_upusr = $1,
    rtcnt_updat = CURRENT_TIMESTAMP,
    rtcnt_rvnmr = rtcnt_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete dzone- ${user_c}`);
    res.json({
      success: true,
      message: `${rtcnt_rname} - ${rtcnt_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get by territory
router.post("/get-by-territory", async (req, res) => {
  try {
    const { rtcnt_trtry, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!rtcnt_rtcnt_trtrytrtry || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT crt.*, 0 as edit_stop
    FROM tmcb_rtcnt crt
    WHERE crt.rtcnt_users = $1
    AND crt.rtcnt_trtry = $2
    AND crt.rtcnt_actve = TRUE
    ORDER BY crt.rtcnt_rname ASC`;

    const params = [user_c, rtcnt_trtry];
    const rows = await dbGetAll(sql, params, `get rtcnt- ${user_c}`);
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
