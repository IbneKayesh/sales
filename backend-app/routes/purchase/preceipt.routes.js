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
      AND mstr.pmstr_bsins = ?
      AND mstr.pmstr_odtyp = 'Purchase Receipt'`;
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

// receipt details
router.post("/receipt-details", async (req, res) => {
  try {
    const { recpt_pmstr } = req.body;

    // Validate input
    if (!recpt_pmstr) {
      return res.json({
        success: false,
        message: "Booking ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT recpt.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmpb_recpt recpt
    LEFT JOIN tmib_items itm ON recpt.recpt_items = itm.id
    LEFT JOIN tmib_bitem bitm ON recpt.recpt_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE recpt.recpt_pmstr = ?`;
    let params = [recpt_pmstr];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase receipt for ${recpt_pmstr}`,
    );
    res.json({
      success: true,
      message: "Purchase receipt fetched successfully",
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

// receipt payment
router.post("/receipt-payment", async (req, res) => {
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
      mrcpt_users,
      mrcpt_bsins,
      mrcpt_cntct,
      mrcpt_trnno,
      mrcpt_trdat,
      mrcpt_refno,
      mrcpt_trnte,
      mrcpt_odamt,
      mrcpt_dsamt,
      mrcpt_vtamt,
      mrcpt_vatpy,
      mrcpt_incst,
      mrcpt_excst,
      mrcpt_rnamt,
      mrcpt_ttamt,
      mrcpt_pyamt,
      mrcpt_pdamt,
      mrcpt_duamt,
      mrcpt_rtamt,
      mrcpt_ispad,
      mrcpt_ispst,
      mrcpt_iscls,
      mrcpt_vatcl,
      mrcpt_hscnl,
      user_id,
      tmpb_crcpt,
      tmpb_expns,
    } = req.body;

    //console.log("create:", JSON.stringify(req.body));

    // Validate input
    if (
      !id ||
      !mrcpt_users ||
      !mrcpt_bsins ||
      !mrcpt_cntct ||
      !mrcpt_trdat ||
      !tmpb_crcpt ||
      !Array.isArray(tmpb_crcpt)
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
    const sql = `SELECT MAX(CAST(RIGHT(mrcpt_trnno, 5) AS UNSIGNED)) AS max_seq
      FROM tmpb_mrcpt
      WHERE DATE(mrcpt_trdat) = CURDATE()`;
    const max_seq = await dbGet(sql, []);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const mrcpt_trnno_new = `PR-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + mrcpt_trnno_new);


    //return;

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_mrcpt(id, mrcpt_users, mrcpt_bsins, mrcpt_cntct, mrcpt_trnno, mrcpt_trdat,
      mrcpt_refno, mrcpt_trnte, mrcpt_odamt, mrcpt_dsamt, mrcpt_vtamt, mrcpt_vatpy,
      mrcpt_incst, mrcpt_excst, mrcpt_rnamt, mrcpt_ttamt, mrcpt_pyamt, mrcpt_pdamt,
      mrcpt_duamt, mrcpt_rtamt, mrcpt_ispad, mrcpt_ispst, mrcpt_iscls, mrcpt_vatcl,
      mrcpt_hscnl, mrcpt_crusr, mrcpt_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        id,
        mrcpt_users,
        mrcpt_bsins,
        mrcpt_cntct,
        mrcpt_trnno_new,
        mrcpt_trdat,
        mrcpt_refno,
        mrcpt_trnte,
        mrcpt_odamt,
        mrcpt_dsamt,
        mrcpt_vtamt,
        mrcpt_vatpy,
        mrcpt_incst,
        mrcpt_excst,
        mrcpt_rnamt,
        mrcpt_ttamt,
        mrcpt_pyamt,
        mrcpt_pdamt,
        mrcpt_duamt,
        mrcpt_rtamt,
        mrcpt_ispad,
        mrcpt_ispst,
        0,
        0,
        0,
        user_id,
        user_id,
      ],
      label: `Created master ${mrcpt_trnno_new}`,
    });


    //Insert receipt details
    for (const det of tmpb_crcpt) {
      scripts.push({
        sql: `INSERT INTO tmpb_crcpt(id, crcpt_mrcpt, crcpt_bitem, crcpt_items, crcpt_itrat, crcpt_itqty,
        crcpt_itamt, crcpt_dspct, crcpt_dsamt, crcpt_vtpct, crcpt_vtamt, crcpt_csrat,
        crcpt_ntamt, crcpt_notes, crcpt_rtqty, crcpt_slqty, crcpt_ohqty, crcpt_cbkng,
        crcpt_crusr, crcpt_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.crcpt_bitem,
          det.crcpt_items,
          det.crcpt_itrat || 0,
          det.crcpt_itqty || 1,
          det.crcpt_itamt || 0,
          det.crcpt_dspct || 0,
          det.crcpt_dsamt || 0,
          det.crcpt_vtpct || 0,
          det.crcpt_vtamt || 0,
          det.crcpt_csrat || 0,
          det.crcpt_ntamt || 0,
          det.crcpt_notes || "",
          0,
          0,
          det.crcpt_ohqty || 1, //det.cbkng_pnqty,
          det.crcpt_cbkng,
          user_id,
          user_id,
        ],
        label: `Created detail ${mrcpt_trnno_new}`,
      });
    }

    //Insert expense details
    for (const pay of tmpb_expns) {
      scripts.push({
        sql: `INSERT INTO tmpb_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?)`,
        params: [
          uuidv4(),
          mrcpt_users,
          mrcpt_bsins,
          mrcpt_cntct,
          id,
          mrcpt_trnno_new,
          "Purchase Receipt",
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created expense ${mrcpt_trnno_new}`,
      });
    }

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Purchase receipt created successfully",
      data: {
        ...req.body,
        mrcpt_trnno: mrcpt_trnno_new,
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
        bking_notes, bking_cnqty, bking_rcqty, bking_pnqty, bking_crusr, bking_upusr)
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


//available-receipt-items
router.post("/available-receipt-items", async (req, res) => {
  try {
    const {
      mbkng_users,
      mbkng_bsins,
      mbkng_cntct,
    } = req.body;

    // Validate input
    if (!mbkng_users || !mbkng_bsins || !mbkng_cntct) {
      return res.json({
        success: false,
        message: "User ID and Business ID and Contact ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT cbkg.id AS id, '' AS crcpt_mrcpt, cbkg.cbkng_bitem AS crcpt_bitem, cbkg.cbkng_items AS crcpt_items,
    cbkg.cbkng_itrat AS crcpt_itrat, cbkg.cbkng_itqty AS crcpt_itqty, cbkg.cbkng_itamt AS crcpt_itamt, cbkg.cbkng_dspct AS crcpt_dspct,
    cbkg.cbkng_dsamt AS crcpt_dsamt, cbkg.cbkng_vtpct AS crcpt_vtpct, cbkg.cbkng_vtamt AS crcpt_vtamt, cbkg.cbkng_csrat AS crcpt_csrat,
    cbkg.cbkng_ntamt AS crcpt_ntamt, cbkg.cbkng_notes AS crcpt_notes,
    0 AS crcpt_rtqty, 0 AS crcpt_slqty, cbkg.cbkng_itqty AS crcpt_ohqty, cbkg.id AS crcpt_cbkng, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmpb_cbkng cbkg
    JOIN tmpb_mbkng bkg ON cbkg.cbkng_mbkng = bkg.id
    LEFT JOIN tmib_items itm ON cbkg.cbkng_items = itm.id
    LEFT JOIN tmib_bitem bitm ON cbkg.cbkng_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE cbkg.cbkng_pnqty > 0
    AND bkg.mbkng_users = ?
    AND bkg.mbkng_bsins = ?
    AND bkg.mbkng_cntct = ?
    ORDER BY bkg.mbkng_trdat DESC`;
    let params = [mbkng_users, mbkng_bsins, mbkng_cntct];
    const rows = await dbGetAll(
      sql,
      params,
      `Get available purchase bookings for ${mbkng_users}`,
    );
    res.json({
      success: true,
      message: "Available purchase bookings fetched successfully",
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
