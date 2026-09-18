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
      tripm_sorce,
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
      !tripm_sorce ||
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
                          tripm_trdat, tripm_trpmv, tripm_trpma, tripm_trpmb, tripm_notes, tripm_sorce,
                          tripm_lsdat, tripm_blamt, tripm_ispnd, tripm_crusr, tripm_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17)`,
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
        tripm_sorce,
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

      if (tripm_sorce === "Sales Order") {
        scripts.push({
          sql: `UPDATE tmob_odrdm
        SET odrdm_vehid = $1
        WHERE id = $2`,
          params: [lineId, det.tripc_refid],
          label: `Update order detail ${newTrnNo}`,
        });
      } else if (tripm_sorce === "Sales Invoice") {
        scripts.push({
          sql: `UPDATE tmob_invcm
        SET invcm_vehid = $1
        WHERE id = $2`,
          params: [lineId, det.tripc_refid],
          label: `Update invoice detail ${newTrnNo}`,
        });
      }
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
    const { tripm_sorce, tripc_tripm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!tripm_sorce || !tripc_tripm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    let sql = "";
    if (tripm_sorce === "Sales Order") {
      sql = `SELECT tpc.*, odm.odrdm_trnno tripm_trnno, cnt.cntct_cname
    FROM tmob_tripc tpc
    JOIN tmob_odrdm odm ON tpc.tripc_refid = odm.id
    JOIN tmcb_cntct cnt ON odm.odrdm_cntct = cnt.id
    WHERE tpc.tripc_users = $1
    AND tpc.tripc_tripm = $2
    ORDER BY tpc.tripc_refid ASC`;
    } else if (tripm_sorce === "Sales Invoice") {
      sql = `SELECT tpc.*, ivm.invcm_trnno tripm_trnno, cnt.cntct_cname
    FROM tmob_tripc tpc
    JOIN tmob_invcm ivm ON tpc.tripc_refid = ivm.id
    JOIN tmcb_cntct cnt ON ivm.invcm_cntct = cnt.id
    WHERE tpc.tripc_users = $1
    AND tpc.tripc_tripm = $2
    ORDER BY tpc.tripc_refid ASC`;
    } else {
      sql = "";
    }
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
    const { dpart_id, tripm_sorce, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!dpart_id || !tripm_sorce || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    let sql = "";
    if (tripm_sorce === "Sales Order") {
      sql = `SELECT odm.id, odm.id tripc_refid, odm.odrdm_ttype tripc_sorce, false tripc_isdlv,
                0 tripc_atmpt, odm.odrdm_pyamt tripc_inval, odm.odrdm_duamt tripc_duval,
                0 tripc_clval, odm.odrdm_trnno tripm_trnno, cnt.cntct_cname, cnt.cntct_ofadr tripc_addrs,
                true tripc_actve
            FROM tmob_odrdm odm
            JOIN tmcb_cntct cnt ON odm.odrdm_cntct = cnt.id
            WHERE odm.odrdm_vehid IS NULL
                OR TRIM(odm.odrdm_vehid) = ''
                AND odm.odrdm_dpart = $1
                AND odm.odrdm_users = $2
            ORDER BY odm.odrdm_trdat DESC`;
    } else if (tripm_sorce === "Sales Invoice") {
      sql = `SELECT ivm.id, ivm.id tripc_refid, ivm.invcm_ttype tripc_sorce, false tripc_isdlv,
                0 tripc_atmpt, ivm.invcm_pyamt tripc_inval, ivm.invcm_duamt tripc_duval,
                0 tripc_clval, ivm.invcm_trnno tripm_trnno, cnt.cntct_cname, cnt.cntct_ofadr tripc_addrs,
                true tripc_actve
            FROM tmob_invcm ivm
            JOIN tmcb_cntct cnt ON ivm.invcm_cntct = cnt.id
            WHERE ivm.invcm_vehid IS NULL
                OR TRIM(ivm.invcm_vehid) = ''
                AND ivm.invcm_dpart = $1
                AND ivm.invcm_users = $2
            ORDER BY ivm.invcm_trdat DESC`;
    }

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

// get-print
router.post("/get-print", async (req, res) => {
  try {
    const { id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const params = [user_c, id];

    const sql_trip_summary = `SELECT tpm.tripm_trnno, tpm.tripm_trdat, tpm.tripm_trpmv, tpm.tripm_trpma, tpm.tripm_trpmb,
          tpm.tripm_notes, tpm.tripm_sorce, tpm.tripm_lsdat, tpm.tripm_blamt, tpm.tripm_ispnd,
          pty.party_cname, dpt.dpart_cname
          FROM tmob_tripm tpm
          JOIN tmtb_party pty ON tpm.tripm_party = pty.id
          JOIN tmsb_dpart dpt ON tpm.tripm_dpart = dpt.id
          WHERE tpm.tripm_users = $1
          AND tpm.id = $2`;
    const rows_trip_summary = await dbGetAll(
      sql_trip_summary,
      params,
      `get trip summary- ${user_c}`,
    );

    const sql_trip_details = `SELECT tpc.tripc_sorce, tpc.tripc_dldat, tpc.tripc_isdlv, tpc.tripc_atmpt, tpc.tripc_inval, tpc.tripc_duval,
          tpc.tripc_clval, tpc.tripc_addrs, tpc.tripc_notes, odr.odrdm_trnno, cnt.cntct_cname
          FROM tmob_tripc tpc
          JOIN tmob_odrdm odr ON tpc.tripc_refid = odr.id
          JOIN tmcb_cntct cnt ON odr.odrdm_cntct = cnt.id
          WHERE tpc.tripc_users = $1
          AND tpc.tripc_tripm = $2`;
    const rows_trip_details = await dbGetAll(
      sql_trip_details,
      params,
      `get trip details- ${user_c}`,
    );

    const sql_trip_items = `SELECT itm.items_iname, itm.items_pkqty, itm.items_szqty, prc.price_cname,
          runit.units_cname as runit_cname, punit.units_cname as punit_cname, sunit.units_cname as sunit_cname,
          SUM(odc.odrdc_itqty) odrdc_itqty
          FROM tmob_tripc tpc
          JOIN tmob_odrdm odm ON tpc.tripc_refid = odm.id
          JOIN tmob_odrdc odc ON odm.id = odc.odrdc_odrdm
          JOIN tmib_items itm ON odc.odrdc_items = itm.id
          JOIN tmib_price prc ON odc.odrdc_price = prc.id
                      AND itm.id = prc.price_items
          JOIN tmib_units runit ON odc.odrdc_units = runit.id
          JOIN tmib_units punit ON itm.items_punit = punit.id
          JOIN tmib_units sunit ON itm.items_sunit = sunit.id
          WHERE tpc.tripc_users = $1
          AND tpc.tripc_tripm = $2
      GROUP BY itm.items_iname, itm.items_pkqty, itm.items_szqty, prc.price_cname,
      runit.units_cname, punit.units_cname, sunit.units_cname`;
    const rows_trip_items = await dbGetAll(
      sql_trip_items,
      params,
      `get trip items- ${user_c}`,
    );

    const sql_trip_orders = `SELECT odr.*, dpt.dpart_cname, cnt.cntct_cname, odc.*,
    itm.items_iname, itm.items_pkqty, itm.items_szqty,
    prc.price_cname,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
    tpc.tripc_dldat, tpc.tripc_isdlv, tpc.tripc_atmpt
	FROM tmob_odrdm odr
    JOIN tmsb_dpart dpt ON odr.odrdm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON odr.odrdm_cntct = cnt.id
    JOIN tmob_odrdc odc ON odr.id = odc.odrdc_odrdm
    JOIN tmib_items itm ON odc.odrdc_items = itm.id
    JOIN tmib_price prc ON odc.odrdc_price = prc.id
                            AND itm.id = prc.price_items
    JOIN tmib_units runit ON odc.odrdc_units = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    JOIN tmob_tripc tpc ON odr.odrdm_vehid = tpc.id
    WHERE odc.odrdc_users = $1
    AND tpc.tripc_tripm = $2
    ORDER BY odr.odrdm_trnno ASC`;
    const rows_trip_orders = await dbGetAll(
      sql_trip_orders,
      params,
      `get trip orders- ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: {
        summary: rows_trip_summary,
        details: rows_trip_details,
        items: rows_trip_items,
        orders: rows_trip_orders,
      },
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
