const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { attnd_users, attnd_bsins } = req.body;

    // Validate input
    if (!attnd_users || !attnd_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tnd.*,  0 as edit_stop,
      emp.emply_ecode, emp.emply_ename, wks.wksft_sftnm
      FROM tmhb_attnd tnd
      JOIN tmhb_emply emp ON tnd.attnd_emply = emp.id AND tnd.attnd_users = emp.emply_users AND tnd.attnd_bsins = emp.emply_bsins
      JOIN tmhb_wksft wks ON tnd.attnd_wksft = wks.id AND tnd.attnd_users = wks.wksft_users AND tnd.attnd_bsins = wks.wksft_bsins
      WHERE tnd.attnd_users = $1
      AND tnd.attnd_bsins = $2
      ORDER BY tnd.attnd_atdat DESC, tnd.attnd_emply ASC`;
    const params = [attnd_users, attnd_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get attendance for ${attnd_users}`,
    );
    res.json({
      success: true,
      message: "Attendance fetched successfully",
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
    const { id, attnd_users, attnd_bsins, attnd_emply, attnd_atdat, suser_id } =
      req.body;

    // Validate input
    if (!id || !attnd_users || !attnd_bsins || !attnd_atdat) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    console.log(" req.body", req.body);

    const dateObj = new Date(attnd_atdat);
    dateObj.setDate(dateObj.getDate() + 1);
    const next_date = dateObj.toISOString().split("T")[0];
    const yearid = new Date(attnd_atdat).getFullYear();

    //database action
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmhb_attnd (id, attnd_users, attnd_bsins, attnd_emply, attnd_wksft,
      attnd_atdat, attnd_dname, attnd_sname, attnd_crusr, attnd_upusr)
      SELECT gen_random_uuid(), emp.emply_users, emp.emply_bsins, emp.id, emp.emply_wksft,
      $1::date, TO_CHAR($2::date, 'Day'), 'Pending', $3, $4
      FROM tmhb_emply emp
      WHERE emp.emply_actve = TRUE
      AND emp.emply_wksft IS NOT NULL
      AND NOT EXISTS (
          SELECT 1
          FROM tmhb_attnd tnd
          WHERE tnd.attnd_emply = emp.id
            AND tnd.attnd_users = emp.emply_users
            AND tnd.attnd_bsins = emp.emply_bsins
            AND tnd.attnd_atdat >= $5::date
            AND tnd.attnd_atdat <  $6::date
            AND tnd.attnd_users = $7
            AND tnd.attnd_bsins = $8
      )`,
      params: [
        attnd_atdat,
        attnd_atdat,
        suser_id,
        suser_id,
        attnd_atdat,
        next_date,
        attnd_users,
        attnd_bsins,
      ],
      label: `1. create empty attendance ${attnd_users} for ${attnd_atdat}`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd t
    SET 
    attnd_sname = 'Present',
    attnd_notes = hdy.hlday_hldnm
    FROM tmhb_hlday hdy
    WHERE hdy.hlday_yerid = $1
    AND hdy.hlday_hldat::DATE = t.attnd_atdat::DATE
    AND hdy.hlday_users = t.attnd_users
    AND hdy.hlday_bsins = t.attnd_bsins
    AND t.attnd_ipaid = FALSE
    AND hdy.hlday_users = $2
    AND hdy.hlday_bsins = $3
    `,
      params: [yearid, attnd_users, attnd_bsins],
      label: `2. holiday process`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd t
      SET 
          attnd_sname = qry.atnst_sname,
          attnd_notes = qry.lvapp_notes
      FROM (
      SELECT tnd.id, nst.atnst_sname, ap.lvapp_notes
      FROM tmhb_lvapp ap
      JOIN tmhb_attnd tnd ON ap.lvapp_frdat::date = tnd.attnd_atdat::date
      AND ap.lvapp_todat::date = tnd.attnd_atdat::date
      AND ap.lvapp_emply = tnd.attnd_emply
      AND ap.lvapp_users = tnd.attnd_users
      AND ap.lvapp_bsins = tnd.attnd_bsins
      JOIN tmhb_atnst nst ON ap.lvapp_atnst = nst.id
      AND nst.atnst_users = tnd.attnd_users
      AND nst.atnst_bsins = tnd.attnd_bsins
      WHERE ap.lvapp_yerid = $1
      AND tnd.attnd_ipaid = FALSE
      AND nst.atnst_users = $2
      AND nst.atnst_bsins = $3
      )qry
      WHERE t.id = qry.id`,
      params: [yearid, attnd_users, attnd_bsins],
      label: `3. Leave and IOM Process`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
      SET 
          attnd_intim = qry.atnlg_lgtim,
          attnd_trmni = qry.atnlg_trmnl
      FROM (
          SELECT DISTINCT ON (emp.id)
              emp.id,
              nlg.atnlg_lgtim::time AS atnlg_lgtim,
              nlg.atnlg_trmnl
          FROM tmhb_atnlg nlg
          JOIN tmhb_emply emp 
              ON nlg.atnlg_ecode = emp.emply_ecode
          JOIN tmhb_attnd tnd 
              ON emp.id = tnd.attnd_emply
             AND tnd.attnd_users = emp.emply_users
             AND tnd.attnd_bsins = emp.emply_bsins
          WHERE nlg.atnlg_lgtim >= $1::DATE
            AND nlg.atnlg_lgtim <  $2::DATE  
            AND tnd.attnd_users = $3
            AND tnd.attnd_bsins = $4
          ORDER BY emp.id, nlg.atnlg_lgtim ASC
      ) qry
      WHERE tnd.attnd_emply = qry.id
      AND tnd.attnd_ipaid = FALSE
      AND tnd.attnd_users = $5
      AND tnd.attnd_bsins = $6`,
      params: [
        attnd_atdat,
        next_date,
        attnd_users,
        attnd_bsins,
        attnd_users,
        attnd_bsins,
      ],
      label: `4. find min or in time`,
    });
    //ORDER BY tnd.id, nlg.atnlg_lgtim ASC  responsible for MIN time from any terminal for each employee, instead of group by

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
      SET 
          attnd_outim = qry.atnlg_lgtim,
          attnd_trmno = qry.atnlg_trmnl
      FROM (
          SELECT DISTINCT ON (emp.id)
              emp.id,
              nlg.atnlg_lgtim::time AS atnlg_lgtim,
              nlg.atnlg_trmnl
          FROM tmhb_atnlg nlg
          JOIN tmhb_emply emp 
              ON nlg.atnlg_ecode = emp.emply_ecode
          JOIN tmhb_attnd tnd 
              ON emp.id = tnd.attnd_emply
            AND tnd.attnd_users = emp.emply_users
            AND tnd.attnd_bsins = emp.emply_bsins
          WHERE nlg.atnlg_lgtim >= $1::DATE
            AND nlg.atnlg_lgtim <  $2::DATE
            AND tnd.attnd_users = $3
            AND tnd.attnd_bsins = $4
          ORDER BY emp.id, nlg.atnlg_lgtim DESC
      ) qry
      WHERE tnd.attnd_emply = qry.id
      AND tnd.attnd_ipaid = FALSE
      AND tnd.attnd_users = $5
      AND tnd.attnd_bsins = $6`,
      //   -- MAX time from any terminal for each employee, instead of group by
      params: [
        attnd_atdat,
        next_date,
        attnd_users,
        attnd_bsins,
        attnd_users,
        attnd_bsins,
      ],
      label: `5. find max or out time`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd
          SET attnd_totwh = COALESCE(EXTRACT(EPOCH FROM (attnd_outim - attnd_intim)) / 60::int,0)
          WHERE attnd_ipaid = FALSE
          AND attnd_users = $1
          AND attnd_bsins = $2`,
      params: [attnd_users, attnd_bsins],
      label: `6. find total working hours`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
            SET attnd_stsin = CASE
                WHEN tnd.attnd_intim BETWEEN 
                    (wks.wksft_satim - (wks.wksft_btbst * INTERVAL '1 minute'))
                    AND
                    (wks.wksft_satim + (wks.wksft_gsmin * INTERVAL '1 minute'))
                    THEN 'In Time'
                WHEN tnd.attnd_intim < (wks.wksft_satim - (wks.wksft_btbst * INTERVAL '1 minute'))
                    THEN 'Early Entry'
                WHEN tnd.attnd_intim > (wks.wksft_satim + (wks.wksft_gsmin * INTERVAL '1 minute'))
                    THEN 'Late Entry'
            END
            FROM tmhb_wksft wks
            WHERE tnd.attnd_wksft = wks.id
            AND tnd.attnd_ipaid = FALSE
            AND tnd.attnd_users = $1
            AND tnd.attnd_bsins = $2`,
      params: [attnd_users, attnd_bsins],
      label: `7. find In Time status`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
            SET attnd_stsou = CASE
                WHEN tnd.attnd_outim BETWEEN 
                    (wks.wksft_entim - (wks.wksft_gemin * INTERVAL '1 minute'))
                    AND
                    (wks.wksft_entim + (wks.wksft_btand * INTERVAL '1 minute'))
                    THEN 'In Time'
                WHEN tnd.attnd_outim < (wks.wksft_entim - (wks.wksft_gemin * INTERVAL '1 minute'))
                    THEN 'Early Out'
                WHEN tnd.attnd_outim > (wks.wksft_entim + (wks.wksft_btand * INTERVAL '1 minute'))
                    THEN 'Late Out'
            END
            FROM tmhb_wksft wks
            WHERE tnd.attnd_wksft = wks.id
            AND tnd.attnd_ipaid = FALSE
            AND tnd.attnd_users = $1
            AND tnd.attnd_bsins = $2`,
      params: [attnd_users, attnd_bsins],
      label: `8. find Out Time status`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
          SET attnd_totoh = tnd.attnd_totwh - wks.wksft_wrhrs
          FROM tmhb_wksft wks
          WHERE tnd.attnd_wksft = wks.id
          AND wks.wksft_ovrtm = TRUE
          AND tnd.attnd_ipaid = FALSE
          AND tnd.attnd_users = $1
          AND tnd.attnd_bsins = $2`,
      params: [attnd_users, attnd_bsins],
      label: `9. find overtime`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
            SET attnd_sname = CASE
                WHEN 
                    (
                        tnd.attnd_intim BETWEEN 
                            (wks.wksft_satim - (wks.wksft_btbst * INTERVAL '1 minute'))
                            AND
                            (wks.wksft_satim + (wks.wksft_gsmin * INTERVAL '1 minute'))
                    )
                    AND
                    (
                        tnd.attnd_outim BETWEEN 
                            (wks.wksft_entim - (wks.wksft_gemin * INTERVAL '1 minute'))
                            AND
                            (wks.wksft_entim + (wks.wksft_btand * INTERVAL '1 minute'))
                    )
                THEN 'Present'
                ELSE 'Absent'
            END
            FROM tmhb_wksft wks
            WHERE tnd.attnd_wksft = wks.id
            AND wks.wksft_crday = FALSE
            AND wks.wksft_sgpnc = FALSE
            AND tnd.attnd_ipaid = FALSE
            AND tnd.attnd_users = $1
            AND tnd.attnd_bsins = $2`,
      params: [attnd_users, attnd_bsins],
      label: `10. find final status`,
    });

    scripts.push({
      sql: `UPDATE tmhb_attnd tnd
            SET attnd_prsnt = nst.atnst_prsnt,
            attnd_paybl = nst.atnst_paybl
            FROM tmhb_atnst nst
            WHERE tnd.attnd_sname = nst.atnst_sname
            AND tnd.attnd_ipaid = false
            AND tnd.attnd_users = nst.atnst_users
            AND tnd.attnd_bsins = nst.atnst_bsins
            AND tnd.attnd_users = $1
            AND tnd.attnd_bsins = $2`,
      params: [attnd_users, attnd_bsins],
      label: `11. update flag`,
    });

    //console.log("scripts ", scripts);

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Attendance created successfully",
      data: {
        ...req.body,
      },
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
      attnd_users,
      attnd_bsins,
      attnd_emply,
      attnd_wksft,
      attnd_atdat,
      attnd_dname,
      attnd_intim,
      attnd_stsin,
      attnd_trmni,
      attnd_outim,
      attnd_stsou,
      attnd_trmno,
      attnd_totwh,
      attnd_totoh,
      attnd_notes,
      attnd_sname,
      attnd_prsnt,
      attnd_paybl,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !attnd_users ||
      !attnd_bsins ||
      !attnd_emply ||
      !attnd_wksft ||
      !attnd_atdat ||
      !attnd_dname
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_attnd
    SET attnd_emply = $1,
    attnd_wksft = $2,
    attnd_atdat = $3,
    attnd_dname = $4,
    attnd_intim = $5,
    attnd_stsin = $6,
    attnd_trmni = $7,
    attnd_outim = $8,
    attnd_stsou = $9,
    attnd_trmno = $10,
    attnd_totwh = $11,
    attnd_totoh = $12,
    attnd_notes = $13,
    attnd_sname = $14,
    attnd_prsnt = $15,
    attnd_paybl = $16,
    attnd_upusr = $17,
    attnd_updat = CURRENT_TIMESTAMP,
    attnd_rvnmr = attnd_rvnmr + 1
    WHERE id = $18`;
    const params = [
      attnd_emply,
      attnd_wksft,
      new Date(attnd_atdat),
      attnd_dname,
      attnd_intim || null,
      attnd_stsin || "",
      attnd_trmni || "",
      attnd_outim || null,
      attnd_stsou || "",
      attnd_trmno || "",
      attnd_totwh || 0,
      attnd_totoh || 0,
      attnd_notes || "",
      attnd_sname || "",
      attnd_prsnt || false,
      attnd_paybl || false,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update attendance for ${attnd_emply}`);
    res.json({
      success: true,
      message: "Attendance updated successfully",
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
    const { id, attnd_emply, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_attnd
    SET attnd_actve = NOT attnd_actve,
    attnd_upusr = $1,
    attnd_updat = CURRENT_TIMESTAMP,
    attnd_rvnmr = attnd_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete attendance for ${attnd_emply}`);
    res.json({
      success: true,
      message: "Attendance deleted successfully",
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

// get all active
router.post("/get-all-active", async (req, res) => {
  try {
    const { attnd_users, attnd_bsins } = req.body;

    // Validate input
    if (!attnd_users || !attnd_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_attnd tbl
      WHERE tbl.attnd_users = $1
      AND tbl.attnd_bsins = $2
      AND tbl.attnd_actve = TRUE
      ORDER BY tbl.attnd_atdat DESC, tbl.attnd_emply ASC`;
    const params = [attnd_users, attnd_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get active attendance for ${attnd_users}`,
    );
    res.json({
      success: true,
      message: "Active attendance fetched successfully",
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
