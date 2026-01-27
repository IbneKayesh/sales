const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      minvc_users,
      minvc_bsins,
      minvc_cntct,
      minvc_trnno,
      minvc_trdat,
      minvc_refno,
      search_option,
    } = req.body;

    // Validate input
    if (!minvc_users || !minvc_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT minvc.*, minvc.minvc_ispst as edit_stop,
    cont.cntct_cntnm, cont.cntct_cntps, cont.cntct_cntno, cont.cntct_ofadr, cont.cntct_crlmt
      FROM tmpb_minvc minvc
      LEFT JOIN tmcb_cntct cont on minvc.minvc_cntct = cont.id
      WHERE minvc.minvc_users = ?
      AND minvc.minvc_bsins = ?`;
    let params = [minvc_users, minvc_bsins];

    // Optional filters
    if (minvc_cntct) {
      sql += ` AND cont.cntct_cntnm LIKE ?`;
      params.push(`%${minvc_cntct}%`);
    }

    if (minvc_trnno) {
      sql += ` AND minvc.minvc_trnno LIKE ?`;
      params.push(`%${minvc_trnno}%`);
    }

    //console.log("params", minvc_trdat);

    if (minvc_trdat) {
      const dateObj = new Date(minvc_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(minvc.minvc_trdat) = ?`;
      params.push(formattedDate);
    }

    if (minvc_refno) {
      sql += ` AND minvc.minvc_refno LIKE ?`;
      params.push(`%${minvc_refno}%`);
    }

    if (search_option) {
      switch (search_option) {
        case "minvc_ispad":
          sql += ` AND minvc.minvc_duamt > 0`;
          break;
        case "minvc_ispst":
          sql += ` AND minvc.minvc_ispst = 0`;
          break;
        case "minvc_iscls":
          sql += ` AND minvc.minvc_iscls = 1`;
          break;
        case "minvc_vatcl":
          sql += ` AND minvc.minvc_vatcl = 1`;
          break;
        case "minvc_hscnl":
          sql += ` AND minvc.minvc_hscnl = 1`;
          break;
        case "last_3_days":
          sql += ` AND minvc.minvc_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND minvc.minvc_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` ORDER BY minvc.minvc_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase invoices for ${minvc_users}`,
    );
    res.json({
      success: true,
      message: "Purchase invoices fetched successfully",
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

// invoice details
router.post("/invoice-details", async (req, res) => {
  try {
    const { cinvc_minvc } = req.body;

    // Validate input
    if (!cinvc_minvc) {
      return res.json({
        success: false,
        message: "Invoice ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT invc.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmpb_cinvc invc
    LEFT JOIN tmib_items itm ON invc.cinvc_items = itm.id
    LEFT JOIN tmib_bitem bitm ON invc.cinvc_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE invc.cinvc_minvc = ?
    ORDER BY itm.items_icode, itm.items_iname`;
    let params = [cinvc_minvc];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase booking for ${cinvc_minvc}`,
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

// invoice expenses
router.post("/invoice-expense", async (req, res) => {
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
      `Get purchase invoice expenses for ${expns_refid}`,
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

// invoice payment
router.post("/invoice-payment", async (req, res) => {
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
      `Get purchase invoice payment for ${paybl_refid}`,
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
      minvc_users,
      minvc_bsins,
      minvc_cntct,
      minvc_trnno,
      minvc_trdat,
      minvc_refno,
      minvc_trnte,
      minvc_odamt,
      minvc_dsamt,
      minvc_vtamt,
      minvc_vatpy,
      minvc_incst,
      minvc_excst,
      minvc_rnamt,
      minvc_ttamt,
      minvc_pyamt,
      minvc_pdamt,
      minvc_duamt,
      minvc_rtamt,
      minvc_ispad,
      minvc_ispst,
      minvc_iscls,
      minvc_vatcl,
      minvc_hscnl,
      user_id,
      tmpb_cinvc,
      tmpb_expns,
      tmtb_paybl,
    } = req.body;

    console.log("create:", JSON.stringify(req.body));

    // Validate input
    if (
      !id ||
      !minvc_users ||
      !minvc_bsins ||
      !minvc_cntct ||
      !minvc_trdat ||
      !tmpb_cinvc ||
      !Array.isArray(tmpb_cinvc)
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
    const sql = `SELECT MAX(CAST(RIGHT(minvc_trnno, 5) AS UNSIGNED)) AS max_seq
      FROM tmpb_minvc
      WHERE DATE(minvc_trdat) = CURDATE()`;
    const max_seq = await dbGet(sql, []);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const minvc_trnno_new = `PI-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + minvc_trnno_new);

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_minvc(id, minvc_users, minvc_bsins, minvc_cntct, minvc_trnno, minvc_trdat,
      minvc_refno, minvc_trnte, minvc_odamt, minvc_dsamt, minvc_vtamt, minvc_vatpy,
      minvc_incst, minvc_excst, minvc_rnamt, minvc_ttamt, minvc_pyamt, minvc_pdamt,
      minvc_duamt, minvc_rtamt, minvc_ispad, minvc_ispst, minvc_iscls, minvc_vatcl,
      minvc_hscnl, minvc_crusr, minvc_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        id,
        minvc_users,
        minvc_bsins,
        minvc_cntct,
        minvc_trnno_new,
        minvc_trdat,
        minvc_refno,
        minvc_trnte,
        minvc_odamt,
        minvc_dsamt,
        minvc_vtamt,
        minvc_vatpy,
        minvc_incst,
        minvc_excst,
        minvc_rnamt,
        minvc_ttamt,
        minvc_pyamt,
        minvc_pdamt,
        minvc_duamt,
        0,
        minvc_ispad,
        minvc_ispst,
        0,
        0,
        0,
        user_id,
        user_id,
      ],
      label: `Created PI master ${minvc_trnno_new}`,
    });

    //Insert invoice details
    for (const det of tmpb_cinvc) {
      scripts.push({
        sql: `INSERT INTO tmpb_cinvc(id, cinvc_minvc, cinvc_bitem, cinvc_items, cinvc_itrat, cinvc_itqty,
        cinvc_itamt, cinvc_dspct, cinvc_dsamt, cinvc_vtpct, cinvc_vtamt, cinvc_csrat,
        cinvc_ntamt, cinvc_notes, cinvc_attrb, cinvc_rtqty, cinvc_slqty, cinvc_ohqty,
        cinvc_crusr, cinvc_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.cinvc_bitem,
          det.cinvc_items,
          det.cinvc_itrat || 0,
          det.cinvc_itqty || 1,
          det.cinvc_itamt || 0,
          det.cinvc_dspct || 0,
          det.cinvc_dsamt || 0,
          det.cinvc_vtpct || 0,
          det.cinvc_vtamt || 0,
          det.cinvc_csrat || 0,
          det.cinvc_ntamt || 0,
          det.cinvc_notes || "",
          det.cinvc_attrb || "",
          0,
          0,
          det.cinvc_itqty || 1, //det.cinvc_ohqty,
          user_id,
          user_id,
        ],
        label: `Created PI detail ${minvc_trnno_new}`,
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
          minvc_users,
          minvc_bsins,
          minvc_cntct,
          id,
          minvc_trnno_new,
          "Purchase Booking",
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created PI expense ${minvc_trnno_new}`,
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
            minvc_users,
            minvc_bsins,
            minvc_cntct,
            pay.paybl_pymod,
            id,
            minvc_trnno_new,
            "Purchase Booking",
            minvc_trdat,
            pay.paybl_descr,
            pay.paybl_notes,
            pay.paybl_dbamt,
            0,
            user_id,
            user_id,
          ],
          label: `Created payment debit ${minvc_trnno_new}`,
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
        minvc_users,
        minvc_bsins,
        minvc_cntct,
        "Inventory",
        id,
        minvc_trnno_new,
        "Purchase Booking",
        minvc_trdat,
        "Supplier Goods",
        "Products",
        0,
        minvc_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${minvc_trnno_new}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Purchase booking created successfully",
      data: {
        ...req.body,
        minvc_trnno: minvc_trnno_new,
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
      minvc_users,
      minvc_bsins,
      minvc_cntct,
      minvc_trnno,
      minvc_trdat,
      minvc_refno,
      minvc_trnte,
      minvc_odamt,
      minvc_dsamt,
      minvc_vtamt,
      minvc_vatpy,
      minvc_incst,
      minvc_excst,
      minvc_rnamt,
      minvc_ttamt,
      minvc_pyamt,
      minvc_pdamt,
      minvc_duamt,
      minvc_rtamt,
      minvc_ispad,
      minvc_ispst,
      minvc_iscls,
      minvc_vatcl,
      minvc_hscnl,
      user_id,
      tmpb_cinvc,
      tmpb_expns,
      tmtb_paybl,
    } = req.body;

    // Validate input
    if (
      !id ||
      !minvc_users ||
      !minvc_bsins ||
      !minvc_cntct ||
      !minvc_trdat ||
      !tmpb_cinvc ||
      !Array.isArray(tmpb_cinvc)
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
      sql: `DELETE FROM tmpb_cinvc WHERE cinvc_minvc = ?`,
      params: [id],
      label: `Delete booking details for ${minvc_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmpb_expns WHERE expns_refid = ?`,
      params: [id],
      label: `Delete expenses details for ${minvc_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmtb_paybl WHERE paybl_refid = ?`,
      params: [id],
      label: `Delete payments details for ${minvc_trnno}`,
    });
    await dbRunAll(scripts);

    //update master
    const scripts_updt = [];
    scripts_updt.push({
      sql: `UPDATE tmpb_minvc
    SET minvc_cntct = ?,
    minvc_trdat = ?,
    minvc_refno = ?,
    minvc_trnte = ?,
    minvc_odamt = ?,
    minvc_dsamt = ?,
    minvc_vtamt = ?,
    minvc_vatpy = ?,
    minvc_incst = ?,
    minvc_excst = ?,
    minvc_rnamt = ?,
    minvc_ttamt = ?,
    minvc_pyamt = ?,
    minvc_pdamt = ?,
    minvc_duamt = ?,
    minvc_ispad = ?,
    minvc_ispst = ?,
    minvc_upusr = ?,
    minvc_updat = current_timestamp(),
    minvc_rvnmr = minvc_rvnmr + 1
    WHERE id = ?`,
      params: [
        minvc_cntct,
        minvc_trdat,
        minvc_refno,
        minvc_trnte,
        minvc_odamt,
        minvc_dsamt,
        minvc_vtamt,
        minvc_vatpy,
        minvc_incst,
        minvc_excst,
        minvc_rnamt,
        minvc_ttamt,
        minvc_pyamt,
        minvc_pdamt,
        minvc_duamt,
        minvc_ispad,
        minvc_ispst,
        user_id,
        id,
      ],
      label: `Update master ${minvc_trnno}`,
    });
  
    console.log(JSON.stringify(tmpb_cinvc));
    
    //Insert booking details
    for (const det of tmpb_cinvc) {
      scripts_updt.push({
        sql: `INSERT INTO tmpb_cinvc(id, cinvc_minvc, cinvc_bitem, cinvc_items, cinvc_itrat, cinvc_itqty,
        cinvc_itamt, cinvc_dspct, cinvc_dsamt, cinvc_vtpct, cinvc_vtamt, cinvc_csrat,
        cinvc_ntamt, cinvc_notes, cinvc_attrb, cinvc_rtqty, cinvc_slqty, cinvc_ohqty,
        cinvc_crusr, cinvc_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.cinvc_bitem,
          det.cinvc_items,
          det.cinvc_itrat || 0,
          det.cinvc_itqty || 1,
          det.cinvc_itamt || 0,
          det.cinvc_dspct || 0,
          det.cinvc_dsamt || 0,
          det.cinvc_vtpct || 0,
          det.cinvc_vtamt || 0,
          det.cinvc_csrat || 0,
          det.cinvc_ntamt || 0,
          det.cinvc_notes || "",
          det.cinvc_attrb || "",
          0,
          0,
          det.cinvc_itqty || 1, //det.cinvc_ohqty,
          user_id,
          user_id,
        ],
        label: `Created PB detail ${minvc_trnno}`,
      });
    }

    //Insert expense details
    for (const pay of tmpb_expns) {
      scripts_updt.push({
        sql: `INSERT INTO tmpb_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?)`,
        params: [
          uuidv4(),
          minvc_users,
          minvc_bsins,
          minvc_cntct,
          id,
          minvc_trnno,
          "Purchase Booking",
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created expense ${minvc_trnno}`,
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
            minvc_users,
            minvc_bsins,
            minvc_cntct,
            pay.paybl_pymod,
            id,
            minvc_trnno,
            "Purchase Booking",
            minvc_trdat,
            pay.paybl_descr,
            pay.paybl_notes,
            pay.paybl_dbamt,
            0,
            user_id,
            user_id,
          ],
          label: `Created payment debit ${minvc_trnno}`,
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
        minvc_users,
        minvc_bsins,
        minvc_cntct,
        "Inventory",
        id,
        minvc_trnno,
        "Purchase Booking",
        minvc_trdat,
        "Supplier Goods",
        "Products",
        0,
        minvc_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${minvc_trnno}`,
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

module.exports = router;
