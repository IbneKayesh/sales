const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      mbkng_users,
      mbkng_bsins,
      mbkng_cntct,
      mbkng_trnno,
      mbkng_trdat,
      mbkng_refno,
      search_option,
    } = req.body;

    // Validate input
    if (!mbkng_users || !mbkng_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT bkng.*, bkng.mbkng_ispst as edit_stop,
    cont.cntct_cntnm, cont.cntct_cntps, cont.cntct_cntno, cont.cntct_ofadr, cont.cntct_crlmt
      FROM tmpb_mbkng bkng
      LEFT JOIN tmcb_cntct cont on bkng.mbkng_cntct = cont.id
      WHERE bkng.mbkng_users = ?
      AND bkng.mbkng_bsins = ?`;
    let params = [mbkng_users, mbkng_bsins];

    // Optional filters
    if (mbkng_cntct) {
      sql += ` AND cont.cntct_cntnm LIKE ?`;
      params.push(`%${mbkng_cntct}%`);
    }

    if (mbkng_trnno) {
      sql += ` AND bkng.mbkng_trnno LIKE ?`;
      params.push(`%${mbkng_trnno}%`);
    }

    //console.log("params", mbkng_trdat);

    if (mbkng_trdat) {
      const dateObj = new Date(mbkng_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(bkng.mbkng_trdat) = ?`;
      params.push(formattedDate);
    }

    if (mbkng_refno) {
      sql += ` AND bkng.mbkng_refno LIKE ?`;
      params.push(`%${mbkng_refno}%`);
    }

    if (search_option) {
      switch (search_option) {
        case "mbkng_ispad":
          sql += ` AND bkng.mbkng_duamt > 0`;
          break;
        case "mbkng_ispst":
          sql += ` AND bkng.mbkng_ispst = 0`;
          break;
        case "mbkng_iscls":
          sql += ` AND bkng.mbkng_iscls = 1`;
          break;
        case "mbkng_vatcl":
          sql += ` AND bkng.mbkng_vatcl = 1`;
          break;
        case "mbkng_hscnl":
          sql += ` AND bkng.mbkng_hscnl = 1`;
          break;
        case "last_3_days":
          sql += ` AND bkng.mbkng_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND bkng.mbkng_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` ORDER BY bkng.mbkng_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase bookings for ${mbkng_users}`,
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
    const { cbkng_mbkng } = req.body;

    // Validate input
    if (!cbkng_mbkng) {
      return res.json({
        success: false,
        message: "Booking ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT cbkng.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmpb_cbkng cbkng
    LEFT JOIN tmib_items itm ON cbkng.cbkng_items = itm.id
    LEFT JOIN tmib_bitem bitm ON cbkng.cbkng_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE cbkng.cbkng_mbkng = ?
    ORDER BY itm.items_icode, itm.items_iname`;
    let params = [cbkng_mbkng];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase booking for ${cbkng_mbkng}`,
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

// booking expenses
router.post("/booking-expense", async (req, res) => {
  try {
    const { expns_refid } = req.body;

    // Validate input
    if (!expns_refid) {
      return res.json({
        success: false,
        message: "Payment ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT expn.*
    FROM tmpb_expns expn
    WHERE expn.expns_refid = ?
    ORDER BY expn.expns_inexc, expn.expns_xpamt`;
    let params = [expns_refid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase booking expenses for ${expns_refid}`,
    );
    res.json({
      success: true,
      message: "Purchase booking expenses fetched successfully",
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
    const { paybl_refid } = req.body;

    // Validate input
    if (!paybl_refid) {
      return res.json({
        success: false,
        message: "Payment ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT pybl.*
    FROM tmtb_paybl pybl
    WHERE pybl.paybl_refid = ?
    ORDER BY pybl.paybl_cramt,pybl.paybl_trdat`;
    let params = [paybl_refid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase booking payment for ${paybl_refid}`,
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
      mbkng_users,
      mbkng_bsins,
      mbkng_cntct,
      mbkng_trnno,
      mbkng_trdat,
      mbkng_refno,
      mbkng_trnte,
      mbkng_odamt,
      mbkng_dsamt,
      mbkng_vtamt,
      mbkng_vatpy,
      mbkng_incst,
      mbkng_excst,
      mbkng_rnamt,
      mbkng_ttamt,
      mbkng_pyamt,
      mbkng_pdamt,
      mbkng_duamt,
      mbkng_cnamt,
      mbkng_ispad,
      mbkng_ispst,
      mbkng_iscls,
      mbkng_vatcl,
      mbkng_hscnl,
      user_id,
      tmpb_cbkng,
      tmpb_expns,
      tmtb_paybl,
    } = req.body;

    //console.log("create:", JSON.stringify(req.body));

    // Validate input
    if (
      !id ||
      !mbkng_users ||
      !mbkng_bsins ||
      !mbkng_cntct ||
      !mbkng_trdat ||
      !tmpb_cbkng ||
      !Array.isArray(tmpb_cbkng)
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
    const sql = `SELECT MAX(CAST(RIGHT(mbkng_trnno, 5) AS UNSIGNED)) AS max_seq
      FROM tmpb_mbkng
      WHERE DATE(mbkng_trdat) = CURDATE()`;
    const max_seq = await dbGet(sql, []);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const mbkng_trnno_new = `PB-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + mbkng_trnno_new);

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_mbkng(id, mbkng_users, mbkng_bsins, mbkng_cntct, mbkng_trnno, mbkng_trdat,
      mbkng_refno, mbkng_trnte, mbkng_odamt, mbkng_dsamt, mbkng_vtamt, mbkng_vatpy,
      mbkng_incst, mbkng_excst, mbkng_rnamt, mbkng_ttamt, mbkng_pyamt, mbkng_pdamt,
      mbkng_duamt, mbkng_cnamt, mbkng_ispad, mbkng_ispst, mbkng_iscls, mbkng_vatcl,
      mbkng_hscnl, mbkng_crusr, mbkng_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        id,
        mbkng_users,
        mbkng_bsins,
        mbkng_cntct,
        mbkng_trnno_new,
        mbkng_trdat,
        mbkng_refno,
        mbkng_trnte,
        mbkng_odamt,
        mbkng_dsamt,
        mbkng_vtamt,
        mbkng_vatpy,
        mbkng_incst,
        mbkng_excst,
        mbkng_rnamt,
        mbkng_ttamt,
        mbkng_pyamt,
        mbkng_pdamt,
        mbkng_duamt,
        0,
        mbkng_ispad,
        mbkng_ispst,
        0,
        0,
        0,
        user_id,
        user_id,
      ],
      label: `Created PB master ${mbkng_trnno_new}`,
    });

    //Insert booking details
    for (const det of tmpb_cbkng) {
      scripts.push({
        sql: `INSERT INTO tmpb_cbkng(id, cbkng_mbkng, cbkng_bitem, cbkng_items, cbkng_itrat, cbkng_itqty,
        cbkng_itamt, cbkng_dspct, cbkng_dsamt, cbkng_vtpct, cbkng_vtamt, cbkng_csrat,
        cbkng_ntamt, cbkng_notes, cbkng_attrb, cbkng_cnqty, cbkng_rcqty, cbkng_pnqty,
        cbkng_crusr, cbkng_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.cbkng_bitem,
          det.cbkng_items,
          det.cbkng_itrat || 0,
          det.cbkng_itqty || 1,
          det.cbkng_itamt || 0,
          det.cbkng_dspct || 0,
          det.cbkng_dsamt || 0,
          det.cbkng_vtpct || 0,
          det.cbkng_vtamt || 0,
          det.cbkng_csrat || 0,
          det.cbkng_ntamt || 0,
          det.cbkng_notes || "",
          det.cbkng_attrb || "",
          0,
          0,
          det.cbkng_itqty || 1, //det.cbkng_pnqty,
          user_id,
          user_id,
        ],
        label: `Created PB detail ${mbkng_trnno_new}`,
      });
    }

    //Insert expense details
    for (const pay of tmpb_expns) {
      scripts.push({
        sql: `INSERT INTO tmpb_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_trdat, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?)`,
        params: [
          uuidv4(),
          mbkng_users,
          mbkng_bsins,
          mbkng_cntct,
          id,
          mbkng_trnno_new,
          "Purchase Booking",
          mbkng_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created PB expense ${mbkng_trnno_new}`,
      });
    }

    //Insert payment details :: debit
    for (const pay of tmtb_paybl) {
      if (pay.paybl_dbamt > 0) {
        scripts.push({
          sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
        paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
        paybl_cramt, paybl_crusr, paybl_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?)`,
          params: [
            uuidv4(),
            mbkng_users,
            mbkng_bsins,
            mbkng_cntct,
            pay.paybl_pymod,
            id,
            mbkng_trnno_new,
            "Purchase Booking",
            mbkng_trdat,
            pay.paybl_descr,
            pay.paybl_notes,
            pay.paybl_dbamt,
            0,
            user_id,
            user_id,
          ],
          label: `Created payment debit ${mbkng_trnno_new}`,
        });
      }
    }

    //Insert payment details :: credit
    scripts.push({
      sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
      paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
      paybl_cramt, paybl_crusr, paybl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
        mbkng_users,
        mbkng_bsins,
        mbkng_cntct,
        "Inventory",
        id,
        mbkng_trnno_new,
        "Purchase Booking",
        mbkng_trdat,
        "Supplier Goods",
        "Products",
        0,
        mbkng_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${mbkng_trnno_new}`,
    });

    //when posted
    if (mbkng_ispst === 1) {
      for (const det of tmpb_cbkng) {
        scripts.push({
          sql: `UPDATE tmib_bitem
          SET bitem_pbqty = bitem_pbqty + ?
          WHERE id = ?
          AND bitem_bsins = ?`,
          params: [det.cbkng_itqty, det.cbkng_bitem, mbkng_bsins],
          label: `Updated purchase booking quantity`,
        });
      }
      scripts.push({
        sql: `UPDATE tmpb_mbkng
        SET mbkng_ispad = 1
        WHERE mbkng_ispad IN (0,2)
        AND mbkng_duamt = 0
        AND id = ?`,
        params: [id],
        label: `Updated purchase booking status`,
      });
    }

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Purchase booking created successfully",
      data: {
        ...req.body,
        mbkng_trnno: mbkng_trnno_new,
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
      mbkng_users,
      mbkng_bsins,
      mbkng_cntct,
      mbkng_trnno,
      mbkng_trdat,
      mbkng_refno,
      mbkng_trnte,
      mbkng_odamt,
      mbkng_dsamt,
      mbkng_vtamt,
      mbkng_vatpy,
      mbkng_incst,
      mbkng_excst,
      mbkng_rnamt,
      mbkng_ttamt,
      mbkng_pyamt,
      mbkng_pdamt,
      mbkng_duamt,
      mbkng_cnamt,
      mbkng_ispad,
      mbkng_ispst,
      mbkng_iscls,
      mbkng_vatcl,
      mbkng_hscnl,
      user_id,
      tmpb_cbkng,
      tmpb_expns,
      tmtb_paybl,
    } = req.body;

    // Validate input
    if (
      !id ||
      !mbkng_users ||
      !mbkng_bsins ||
      !mbkng_cntct ||
      !mbkng_trdat ||
      !tmpb_cbkng ||
      !Array.isArray(tmpb_cbkng)
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
      sql: `DELETE FROM tmpb_cbkng WHERE cbkng_mbkng = ?`,
      params: [id],
      label: `Delete booking details for ${mbkng_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmpb_expns WHERE expns_refid = ?`,
      params: [id],
      label: `Delete expenses details for ${mbkng_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmtb_paybl WHERE paybl_refid = ?`,
      params: [id],
      label: `Delete payments details for ${mbkng_trnno}`,
    });

    //when posted
    if (mbkng_ispst === 1) {
      for (const det of tmpb_cbkng) {
        scripts.push({
          sql: `UPDATE tmib_bitem
          SET bitem_pbqty = bitem_pbqty + ?
          WHERE id = ?
          AND bitem_bsins = ?`,
          params: [det.cbkng_itqty, det.cbkng_bitem, mbkng_bsins],
          label: `Updated purchase booking quantity`,
        });
      }
      scripts.push({
        sql: `UPDATE tmpb_mbkng
        SET mbkng_ispad = 1
        WHERE mbkng_ispad IN (0,2)
        AND mbkng_duamt = 0
        AND id = ?`,
        params: [id],
        label: `Updated purchase booking status`,
      });
    }
    await dbRunAll(scripts);

    //update master
    const scripts_updt = [];
    scripts_updt.push({
      sql: `UPDATE tmpb_mbkng
    SET mbkng_cntct = ?,
    mbkng_trdat = ?,
    mbkng_refno = ?,
    mbkng_trnte = ?,
    mbkng_odamt = ?,
    mbkng_dsamt = ?,
    mbkng_vtamt = ?,
    mbkng_vatpy = ?,
    mbkng_incst = ?,
    mbkng_excst = ?,
    mbkng_rnamt = ?,
    mbkng_ttamt = ?,
    mbkng_pyamt = ?,
    mbkng_pdamt = ?,
    mbkng_duamt = ?,
    mbkng_ispad = ?,
    mbkng_ispst = ?,
    mbkng_upusr = ?,
    mbkng_updat = current_timestamp(),
    mbkng_rvnmr = mbkng_rvnmr + 1
    WHERE id = ?`,
      params: [
        mbkng_cntct,
        mbkng_trdat,
        mbkng_refno,
        mbkng_trnte,
        mbkng_odamt,
        mbkng_dsamt,
        mbkng_vtamt,
        mbkng_vatpy,
        mbkng_incst,
        mbkng_excst,
        mbkng_rnamt,
        mbkng_ttamt,
        mbkng_pyamt,
        mbkng_pdamt,
        mbkng_duamt,
        mbkng_ispad,
        mbkng_ispst,
        user_id,
        id,
      ],
      label: `Update master ${mbkng_trnno}`,
    });

    console.log(JSON.stringify(tmpb_cbkng));

    //Insert booking details
    for (const det of tmpb_cbkng) {
      scripts_updt.push({
        sql: `INSERT INTO tmpb_cbkng(id, cbkng_mbkng, cbkng_bitem, cbkng_items, cbkng_itrat, cbkng_itqty,
        cbkng_itamt, cbkng_dspct, cbkng_dsamt, cbkng_vtpct, cbkng_vtamt, cbkng_csrat,
        cbkng_ntamt, cbkng_notes, cbkng_attrb, cbkng_cnqty, cbkng_rcqty, cbkng_pnqty,
        cbkng_crusr, cbkng_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.cbkng_bitem,
          det.cbkng_items,
          det.cbkng_itrat || 0,
          det.cbkng_itqty || 1,
          det.cbkng_itamt || 0,
          det.cbkng_dspct || 0,
          det.cbkng_dsamt || 0,
          det.cbkng_vtpct || 0,
          det.cbkng_vtamt || 0,
          det.cbkng_csrat || 0,
          det.cbkng_ntamt || 0,
          det.cbkng_notes || "",
          det.cbkng_attrb || "",
          0,
          0,
          det.cbkng_itqty || 1, //det.cbkng_pnqty,
          user_id,
          user_id,
        ],
        label: `Created PB detail ${mbkng_trnno}`,
      });
    }

    //Insert expense details
    for (const pay of tmpb_expns) {
      scripts_updt.push({
        sql: `INSERT INTO tmpb_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_trdat, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?)`,
        params: [
          uuidv4(),
          mbkng_users,
          mbkng_bsins,
          mbkng_cntct,
          id,
          mbkng_trnno,
          "Purchase Booking",
          mbkng_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created expense ${mbkng_trnno}`,
      });
    }

    //Insert payment details :: debit
    for (const pay of tmtb_paybl) {
      if (pay.paybl_dbamt > 0) {
        scripts_updt.push({
          sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
        paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
        paybl_cramt, paybl_crusr, paybl_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?)`,
          params: [
            uuidv4(),
            mbkng_users,
            mbkng_bsins,
            mbkng_cntct,
            pay.paybl_pymod,
            id,
            mbkng_trnno,
            "Purchase Booking",
            mbkng_trdat,
            pay.paybl_descr,
            pay.paybl_notes,
            pay.paybl_dbamt,
            0,
            user_id,
            user_id,
          ],
          label: `Created payment debit ${mbkng_trnno}`,
        });
      }
    }

    // //Insert payment details :: credit
    scripts_updt.push({
      sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
      paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
      paybl_cramt, paybl_crusr, paybl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
        mbkng_users,
        mbkng_bsins,
        mbkng_cntct,
        "Inventory",
        id,
        mbkng_trnno,
        "Purchase Booking",
        mbkng_trdat,
        "Supplier Goods",
        "Products",
        0,
        mbkng_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${mbkng_trnno}`,
    });

    await dbRunAll(scripts_updt);
    res.json({
      success: true,
      message: "Booking updated successfully",
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

//cancel-booking-items
router.post("/cancel-booking-items", async (req, res) => {
  try {
    const {
      id,
      pmstr_users,
      pmstr_bsins,
      pmstr_cntct,
      pmstr_trnno,
      pmstr_cnamt,
      user_id,
      tmtb_rcvpy,
    } = req.body;

    // Validate input
    if (!id || !pmstr_users || !pmstr_bsins || !user_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    console.log(tmtb_rcvpy);
    //return;
    //database action
    const scripts = [];

    scripts.push({
      sql: `UPDATE tmpb_pmstr
    SET pmstr_cnamt = ?,
      pmstr_ispad = 1,
      pmstr_hscnl = 1,
      pmstr_upusr = ?,
      pmstr_updat = current_timestamp(),
      pmstr_rvnmr = pmstr_rvnmr + 1
    WHERE id = ?
    AND pmstr_users = ?
    AND pmstr_bsins = ?
    AND pmstr_ispst = 1
    AND pmstr_hscnl = 0`,
      params: [pmstr_cnamt, user_id, id, pmstr_users, pmstr_bsins],
      label: `Cancel booking for ${pmstr_users}`,
    });

    scripts.push({
      sql: `UPDATE tmpb_bking
    SET bking_cnqty = bking_pnqty,
        bking_pnqty = 0,
        bking_updat = current_timestamp(),
        bking_upusr = ?,
        bking_rvnmr = bking_rvnmr + 1
    WHERE bking_pmstr = ?
    AND bking_pnqty > 0`,
      params: [user_id, id],
      label: `Cancel booking details for ${pmstr_users}`,
    });

    scripts.push({
      sql: `INSERT INTO tmtb_rcvpy(id, rcvpy_users, rcvpy_bsins, rcvpy_cntct, rcvpy_pymod, rcvpy_refid,
      rcvpy_refno, rcvpy_srcnm, rcvpy_notes, rcvpy_pyamt, rcvpy_crusr, rcvpy_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?)`,
      params: [
        uuidv4(),
        pmstr_users,
        pmstr_bsins,
        pmstr_cntct,
        "Refund",
        id,
        pmstr_trnno,
        "Purchase Retrun",
        "Booking Cancel Refund",
        pmstr_cnamt,
        user_id,
        user_id,
      ],
      label: `Created payment ${pmstr_trnno}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Booking cancelled successfully",
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
