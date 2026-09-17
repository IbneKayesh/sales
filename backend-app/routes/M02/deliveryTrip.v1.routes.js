const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewTrn } = require("../../db/genHelper");
const { buildJournalScripts } = require("../../db/journalService");

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
    const sql = `SELECT tpm.*, dpt.dpart_cname, pty.party_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_tripm tpm
    JOIN tmsb_dpart dpt ON tpm.tripm_dpart = dpt.id
    JOIN tmtb_party pty ON tpm.tripm_party = pty.id
    LEFT JOIN tmhb_emply csr ON tpm.tripm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON tpm.tripm_upusr = usr.id
    WHERE tpm.tripm_users = $1
    ORDER BY tpm.tripm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Invoice- ${user_c}`);
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
    const sql = `SELECT inv.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_invcm inv
    LEFT JOIN tmhb_emply csr ON inv.invcm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON inv.invcm_upusr = usr.id
    WHERE inv.invcm_users = $1
    AND inv.invcm_actve = TRUE
    ORDER BY inv.invcm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get invoice- ${user_c}`);
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
      tripm_users,
      tripm_bsins,
      tripm_dpart,
      tripm_party,
      tripm_trnno,
      tripm_trdat,
      tripm_trpmv,
      tripm_trpma,
      tripm_trpmb,
      tripm_notes,
      tripm_lsdat,
      tripm_blamt,
      tripm_ispnd,
      tmob_tripc,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !tripm_dpart ||
      !tripm_party ||
      !tmob_tripc ||
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
    const newId = uuidv4();
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmob_tripm",
      "Delivery Trip",
      tripm_dpart,
    );

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmob_tripm(id, tripm_users, tripm_bsins, tripm_dpart, tripm_party, tripm_trnno,
                          tripm_trdat, tripm_trpmv, tripm_trpma, tripm_trpmb, tripm_notes, tripm_lsdat,
                          tripm_blamt, tripm_ispnd, tripm_crusr, tripm_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16)`,
      params: [
        newId,
        user_c,
        user_b,
        tripm_dpart,
        tripm_party,
        newTrnNo,
        tripm_trdat,
        tripm_trpmv,
        tripm_trpma,
        tripm_trpmb,
        tripm_notes,
        tripm_lsdat || null,
        tripm_blamt || 0,
        tripm_ispnd || false,
        user_s,
        user_s,
      ],
      label: `Created delivery trip ${newTrnNo}`,
    });

    //Insert trip details, invoice lists
    for (const det of tmob_tripc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_tripc (id, tripc_users, tripc_bsins, tripc_tripm, tripc_refid, tripc_sorce,
                            tripc_dldat, tripc_isdlv, tripc_atmpt, tripc_inval, tripc_duval, tripc_clval,
                            tripc_addrs, tripc_notes, tripc_crusr, tripc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.tripc_refid,
          det.tripc_sorce,
          tripm_trdat,
          det.tripc_isdlv || false,
          det.tripc_atmpt || 0,
          det.tripc_inval || 0,
          det.tripc_duval || 0,
          det.tripc_clval || 0,
          det.tripc_addrs || "",
          det.tripc_notes || "",
          user_s,
          user_s,
        ],
        label: `Created trip detail ${newTrnNo}`,
      });

      scripts.push({
        sql: `UPDATE tmob_invcm
        SET invcm_vehid = $1
        WHERE id = $2`,
        params: [lineId, det.tripc_refid],
        label: `Update invoice detail ${newTrnNo}`,
      });
    }

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo} - delivery trip created successfully`,
      data: {
        ...req.body,
        invcm_trnno: newTrnNo,
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
    return res.json({
      success: true,
      message: `Update feature is unavailable.`,
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
    const { id, dpart_cname, dpart_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !dpart_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmsb_dpart
    SET dpart_actve = NOT dpart_actve,
    dpart_upusr = $1,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_cname} - ${dpart_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-details-by-master
router.post("/get-details-by-master", async (req, res) => {
  try {
    const { tripc_tripm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!tripc_tripm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT tpc.*, ivm.invcm_trnno, cnt.cntct_cname
    FROM tmob_tripc tpc
    JOIN tmob_invcm ivm ON tpc.tripc_refid = ivm.id
    JOIN tmcb_cntct cnt ON ivm.invcm_cntct = cnt.id
    WHERE tpc.tripc_users = $1
    AND tpc.tripc_tripm = $2
    ORDER BY tpc.tripc_refid ASC`;

    const params = [user_c, tripc_tripm];
    const rows = await dbGetAll(sql, params, `get trip Details- ${user_c}`);
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

// get-all-due-trip
router.post("/get-all-due-trip", async (req, res) => {
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
    const sql = `SELECT ivm.id, ivm.id tripc_refid, ivm.invcm_ttype tripc_sorce, false tripc_isdlv,
                0 tripc_atmpt, ivm.invcm_pyamt tripc_inval, ivm.invcm_duamt tripc_duval,
                0 tripc_clval, ivm.invcm_trnno, cnt.cntct_cname, cnt.cntct_ofadr tripc_addrs,
                true tripc_actve
            FROM tmob_invcm ivm
            JOIN tmcb_cntct cnt ON ivm.invcm_cntct = cnt.id
            WHERE ivm.invcm_vehid IS NULL
                OR TRIM(ivm.invcm_vehid) = ''
                AND ivm.invcm_dpart = $1
                AND ivm.invcm_users = $2
            ORDER BY ivm.invcm_trdat DESC`;

    const params = [dpart_id, user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get due invoice for delivery trip- ${user_c}`,
    );
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
