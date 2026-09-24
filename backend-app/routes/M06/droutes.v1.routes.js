const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { trtry_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    let sql = `SELECT rut.*, trt.trtry_cname, 
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmcb_route rut
    LEFT JOIN tmcb_trtry trt ON rut.route_trtry = trt.id
    LEFT JOIN tmhb_emply csr ON rut.route_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON rut.route_upusr = usr.id
    WHERE rut.route_users = $1`;
    const params = [user_c];

    // Optional district zone filter
    if (trtry_id) {
      sql += ` AND rut.route_trtry = $2`;
      params.push(trtry_id);
    }
    sql += ` ORDER BY rut.route_srial ASC`;
    const rows = await dbGetAll(sql, params, `get route- ${user_c}`);
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
    const sql = `SELECT rut.*, 0 as edit_stop
    FROM tmcb_route rut
    WHERE rut.route_users = $1
    AND rut.route_actve = TRUE
    ORDER BY rut.route_srial ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get route- ${user_c}`);
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
      route_users,
      route_bsins,
      route_ccode,
      route_rname,
      route_dname,
      route_trtry,
      route_srial,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !route_rname ||
      !route_dname ||
      !route_trtry ||
      !route_srial ||
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
    const newCode = await GenNewCode(user_c, "tmcb_route");

    const sql = `INSERT INTO tmcb_route(id, route_users, route_bsins, route_ccode, route_rname, route_dname,
                              route_trtry, route_srial, route_crusr, route_upusr)
                      VALUES ($1, $2, $3, $4, $5, $6,
                            $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      route_rname,
      route_dname,
      route_trtry,
      route_srial,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create route- ${user_c}`);
    res.json({
      success: true,
      message: `${route_rname} - Created successfully.`,
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
      route_users,
      route_bsins,
      route_ccode,
      route_rname,
      route_dname,
      route_trtry,
      route_srial,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !route_rname ||
      !route_dname ||
      !route_trtry ||
      !route_srial ||
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
    const sql = `UPDATE tmcb_route
    SET route_rname = $1,
    route_dname = $2,
    route_srial = $3,
    route_upusr = $4,
    route_updat = CURRENT_TIMESTAMP,
    route_rvnmr = route_rvnmr + 1
    WHERE id = $5`;
    const params = [route_rname, route_dname, route_srial, user_s, id];

    await dbRun(sql, params, `update route- ${user_c}`);
    res.json({
      success: true,
      message: `${route_rname} - Updated successfully.`,
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
    const { id, route_rname, route_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !route_rname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_route
    SET route_actve = NOT route_actve,
    route_upusr = $1,
    route_updat = CURRENT_TIMESTAMP,
    route_rvnmr = route_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete dzone- ${user_c}`);
    res.json({
      success: true,
      message: `${route_rname} - ${route_actve ? "Deactivate" : "Activate"} successfully.`,
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
    const { route_trtry, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!route_trtry || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT rut.*, 0 as edit_stop
    FROM tmcb_route rut
    WHERE rut.route_users = $1
    AND rut.route_trtry = $2
    AND rut.route_actve = TRUE
    ORDER BY rut.route_rname ASC`;

    const params = [user_c, route_trtry];
    const rows = await dbGetAll(sql, params, `get route- ${user_c}`);
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
