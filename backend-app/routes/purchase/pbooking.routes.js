const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      pmstr_users,
      pmstr_bsins,
      pmstr_cntct,
      pmstr_trnno,
      pmstr_trdat,
      pmstr_refno,
    } = req.body;

    // Validate input
    if (!pmstr_users || !pmstr_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT mstr.*, mstr.pmstr_ispst as edit_stop,
    cont.cntct_cntnm, cont.cntct_cntps, cont.cntct_cntno, cont.cntct_ofadr, cont.cntct_crlmt
      FROM tmpb_pmstr mstr
      LEFT JOIN tmcb_cntct cont on mstr.pmstr_cntct = cont.id
      WHERE mstr.pmstr_users = ?
      AND mstr.pmstr_bsins = ?`;
    let params = [pmstr_users, pmstr_bsins];

    // Optional filters
    if (pmstr_cntct) {
      sql += ` AND cont.cntct_cntnm LIKE ?`;
      params.push(`%${pmstr_cntct}%`);
    }

    if (pmstr_trnno) {
      sql += ` AND mstr.pmstr_trnno LIKE ?`;
      params.push(`%${pmstr_trnno}%`);
    }

    //console.log("params", pmstr_trdat);

    if (pmstr_trdat) {
      const dateObj = new Date(pmstr_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(mstr.pmstr_trdat) = ?`;
      params.push(formattedDate);
    }

    if (pmstr_refno) {
      sql += ` AND mstr.pmstr_refno LIKE ?`;
      params.push(`%${pmstr_refno}%`);
    }

    sql += ` ORDER BY mstr.pmstr_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase bookings for ${pmstr_users}`,
    );
    res.json({
      success: true,
      message: "Purchase bookings fetched successfully",
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

// booking details
router.post("/booking-details", async (req, res) => {
  try {
    const { bking_pmstr } = req.body;

    // Validate input
    if (!bking_pmstr) {
      return res.json({
        success: false,
        message: "Booking ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT bking.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmpb_bking bking
    LEFT JOIN tmib_items itm ON bking.bking_items = itm.id
    LEFT JOIN tmib_bitem bitm ON bking.bking_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE bking.bking_pmstr = ?`;
    let params = [bking_pmstr];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase booking for ${bking_pmstr}`,
    );
    res.json({
      success: true,
      message: "Purchase booking fetched successfully",
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

// booking payment
router.post("/booking-payment", async (req, res) => {
  try {
    const { rcvpy_refid } = req.body;

    // Validate input
    if (!rcvpy_refid) {
      return res.json({
        success: false,
        message: "Payment ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT rcvpy.*
    FROM tmtb_rcvpy rcvpy
    WHERE rcvpy.rcvpy_refid = ?
    ORDER BY rcvpy.rcvpy_trdat`;
    let params = [rcvpy_refid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase booking payment for ${rcvpy_refid}`,
    );
    res.json({
      success: true,
      message: "Purchase booking payment fetched successfully",
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
      pmstr_users,
      pmstr_bsins,
      pmstr_cntct,
      pmstr_odtyp,
      pmstr_trnno,
      pmstr_trdat,
      pmstr_trnte,
      pmstr_refno,
      pmstr_odamt,
      pmstr_dsamt,
      pmstr_vtamt,
      pmstr_vatpy,
      pmstr_incst,
      pmstr_excst,
      pmstr_rnamt,
      pmstr_ttamt,
      pmstr_pyamt,
      pmstr_pdamt,
      pmstr_duamt,
      pmstr_rtamt,
      pmstr_cnamt,
      pmstr_ispad,
      pmstr_ispst,
      pmstr_isret,
      pmstr_iscls,
      pmstr_vatcl,
      pmstr_hscnl,
      user_id,
      tmpb_bking,
      tmtb_rcvpy,
    } = req.body;

    //console.log("create:", JSON.stringify(req.body));

    // Validate input
    if (
      !id ||
      !pmstr_users ||
      !pmstr_bsins ||
      !pmstr_cntct ||
      !pmstr_odtyp ||
      !pmstr_trdat ||
      !tmpb_bking ||
      !Array.isArray(tmpb_bking)
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const date_part = dd + mm + yy;
    const sql = `SELECT MAX(CAST(RIGHT(pmstr_trnno, 5) AS UNSIGNED)) AS max_seq
      FROM tmpb_pmstr
      WHERE pmstr_odtyp = ?
      AND DATE(pmstr_trdat) = CURDATE()`;
    const max_seq = await dbGet(sql, [pmstr_odtyp]);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const pmstr_trnno_new = `PB-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + pmstr_trnno_new);

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_pmstr(id, pmstr_users, pmstr_bsins, pmstr_cntct, pmstr_odtyp, pmstr_trnno,
      pmstr_trdat, pmstr_trnte, pmstr_refno, pmstr_odamt, pmstr_dsamt, pmstr_vtamt,
      pmstr_vatpy, pmstr_incst, pmstr_excst, pmstr_rnamt, pmstr_ttamt, pmstr_pyamt,
      pmstr_pdamt, pmstr_duamt, pmstr_rtamt, pmstr_cnamt, pmstr_ispad, pmstr_ispst,
      pmstr_isret, pmstr_iscls, pmstr_vatcl, pmstr_hscnl, pmstr_crusr, pmstr_upusr)
      VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
      )`,
      params: [
        id,
        pmstr_users,
        pmstr_bsins,
        pmstr_cntct,
        pmstr_odtyp,
        pmstr_trnno_new,
        pmstr_trdat,
        pmstr_trnte,
        pmstr_refno,
        pmstr_odamt || 0,
        pmstr_dsamt || 0,
        pmstr_vtamt || 0,
        pmstr_vatpy,
        pmstr_incst || 0,
        pmstr_excst || 0,
        pmstr_rnamt || 0,
        pmstr_ttamt || 0,
        pmstr_pyamt || 0,
        pmstr_pdamt || 0,
        pmstr_duamt || 0,
        0,
        0,
        pmstr_ispad,
        pmstr_ispst,
        0,
        0,
        0,
        0,
        user_id,
        user_id,
      ],
      label: `Created master ${pmstr_trnno_new}`,
    });

    //Insert booking details
    for (const det of tmpb_bking) {
      scripts.push({
        sql: `INSERT INTO tmpb_bking(id, bking_pmstr, bking_bitem, bking_items, bking_bkrat, bking_bkqty, bking_itamt,
        bking_dspct, bking_dsamt, bking_vtpct, bking_vtamt, bking_csrat, bking_ntamt,
        bking_notes, bking_cnqty, bking_ivqty, bking_pnqty, bking_crusr, bking_upusr)
        VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
        )`,
        params: [
          uuidv4(),
          id,
          det.bking_bitem,
          det.bking_items,
          det.bking_bkrat || 0,
          det.bking_bkqty || 0,
          det.bking_itamt || 0,
          det.bking_dspct || 0,
          det.bking_dsamt || 0,
          det.bking_vtpct || 0,
          det.bking_vtamt || 0,
          det.bking_csrat || 0,
          det.bking_ntamt || 0,
          det.bking_notes || "",
          0,
          0,
          det.bking_bkqty || 0, //det.bking_pnqty,
          user_id,
          user_id,
        ],
        label: `Created detail ${pmstr_trnno_new}`,
      });
    }

    //Insert payment details
    for (const pay of tmtb_rcvpy) {
      scripts.push({
        sql: `INSERT INTO tmtb_rcvpy(id, rcvpy_users, rcvpy_bsins, rcvpy_cntct, rcvpy_pymod, rcvpy_refid,
        rcvpy_refno, rcvpy_srcnm, rcvpy_trdat, rcvpy_notes, rcvpy_pyamt, rcvpy_crusr, rcvpy_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          uuidv4(),
          pmstr_users,
          pmstr_bsins,
          pmstr_cntct,
          pay.rcvpy_pymod,
          id,
          pmstr_trnno_new,
          pmstr_odtyp,
          pmstr_trdat,
          pay.rcvpy_notes,
          pay.rcvpy_pyamt,
          user_id,
          user_id,
        ],
        label: `Created payment ${pmstr_trnno_new}`,
      });
    }

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Purchase booking created successfully",
      data: {
        ...req.body,
        pmstr_trnno: pmstr_trnno_new,
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
      pmstr_users,
      pmstr_bsins,
      pmstr_cntct,
      pmstr_odtyp,
      pmstr_trnno,
      pmstr_trdat,
      pmstr_trnte,
      pmstr_refno,
      pmstr_odamt,
      pmstr_dsamt,
      pmstr_vtamt,
      pmstr_vatpy,
      pmstr_incst,
      pmstr_excst,
      pmstr_rnamt,
      pmstr_ttamt,
      pmstr_pyamt,
      pmstr_pdamt,
      pmstr_duamt,
      pmstr_rtamt,
      pmstr_cnamt,
      pmstr_ispad,
      pmstr_ispst,
      pmstr_isret,
      pmstr_iscls,
      pmstr_vatcl,
      pmstr_hscnl,
      user_id,
      tmpb_bking,
      tmtb_rcvpy,
    } = req.body;

    // Validate input
    if (
      !id ||
      !pmstr_users ||
      !pmstr_bsins ||
      !pmstr_cntct ||
      !pmstr_odtyp ||
      !pmstr_trdat ||
      !tmpb_bking ||
      !Array.isArray(tmpb_bking)
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    //remove details
    const scripts = [];
    scripts.push({
      sql: `DELETE FROM tmpb_bking WHERE bking_pmstr = ?`,
      params: [id],
      label: `Delete booking details for ${pmstr_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmtb_rcvpy WHERE rcvpy_refid = ?`,
      params: [id],
      label: `Delete payment details for ${pmstr_trnno}`,
    });
    await dbRunAll(scripts);

    //update master
    const scripts_updt = [];
    scripts_updt.push({
      sql: `UPDATE tmpb_pmstr
    SET pmstr_cntct = ?,
    pmstr_trdat = ?,
    pmstr_trnte = ?,
    pmstr_refno = ?,
    pmstr_odamt = ?,
    pmstr_dsamt = ?,
    pmstr_vtamt = ?,
    pmstr_vatpy = ?,
    pmstr_incst = ?,
    pmstr_excst = ?,
    pmstr_rnamt = ?,
    pmstr_ttamt = ?,
    pmstr_pyamt = ?,
    pmstr_pdamt = ?,
    pmstr_duamt = ?,
    pmstr_ispad = ?,
    pmstr_ispst = ?,
    pmstr_upusr = ?,
    pmstr_updat = current_timestamp(),
    pmstr_rvnmr = pmstr_rvnmr + 1
    WHERE id = ?`,
      params: [
        pmstr_cntct,
        pmstr_trdat,
        pmstr_trnte,
        pmstr_refno,
        pmstr_odamt,
        pmstr_dsamt,
        pmstr_vtamt,
        pmstr_vatpy,
        pmstr_incst,
        pmstr_excst,
        pmstr_rnamt,
        pmstr_ttamt,
        pmstr_pyamt,
        pmstr_pdamt,
        pmstr_duamt,
        pmstr_ispad,
        pmstr_ispst,
        user_id,
        id,
      ],
      label: `Update master ${pmstr_trnno}`,
    });

    //Insert booking details
    for (const det of tmpb_bking) {
      scripts_updt.push({
        sql: `INSERT INTO tmpb_bking(id, bking_pmstr, bking_bitem, bking_items, bking_bkrat, bking_bkqty, bking_itamt,
        bking_dspct, bking_dsamt, bking_vtpct, bking_vtamt, bking_csrat, bking_ntamt,
        bking_notes, bking_cnqty, bking_ivqty, bking_pnqty, bking_crusr, bking_upusr)
        VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
        )`,
        params: [
          uuidv4(),
          id,
          det.bking_bitem,
          det.bking_items,
          det.bking_bkrat || 0,
          det.bking_bkqty || 0,
          det.bking_itamt || 0,
          det.bking_dspct || 0,
          det.bking_dsamt || 0,
          det.bking_vtpct || 0,
          det.bking_vtamt || 0,
          det.bking_csrat || 0,
          det.bking_ntamt || 0,
          det.bking_notes || "",
          0,
          0,
          det.bking_bkqty || 0, //det.bking_pnqty,
          user_id,
          user_id,
        ],
        label: `Created detail ${pmstr_trnno}`,
      });
    }

    //Insert payment details
    for (const pay of tmtb_rcvpy) {
      scripts_updt.push({
        sql: `INSERT INTO tmtb_rcvpy(id, rcvpy_users, rcvpy_bsins, rcvpy_cntct, rcvpy_pymod, rcvpy_refid,
        rcvpy_refno, rcvpy_srcnm, rcvpy_trdat, rcvpy_notes, rcvpy_pyamt, rcvpy_crusr, rcvpy_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          uuidv4(),
          pmstr_users,
          pmstr_bsins,
          pmstr_cntct,
          pay.rcvpy_pymod,
          id,
          pmstr_trnno,
          pmstr_odtyp,
          pmstr_trdat,
          pay.rcvpy_notes,
          pay.rcvpy_pyamt,
          user_id,
          user_id,
        ],
        label: `Created payment ${pmstr_trnno}`,
      });
    }

    await dbRunAll(scripts_updt);
    res.json({
      success: true,
      message: "User updated successfully",
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
    const { id, users_oname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmab_users
    SET users_actve = 1 - users_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete user for ${users_oname}`);
    res.json({
      success: true,
      message: "User deleted successfully",
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

module.exports = router;
