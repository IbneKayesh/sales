const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      mrcpt_users,
      mrcpt_bsins,
      mrcpt_cntct,
      mrcpt_trnno,
      mrcpt_trdat,
      mrcpt_refno,
      search_option,
    } = req.body;

    // Validate input
    if (!mrcpt_users || !mrcpt_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT mrcpt.*, mrcpt.mrcpt_ispst as edit_stop,
    cont.cntct_cntnm, cont.cntct_cntps, cont.cntct_cntno, cont.cntct_ofadr, cont.cntct_crlmt
      FROM tmpb_mrcpt mrcpt
      LEFT JOIN tmcb_cntct cont on mrcpt.mrcpt_cntct = cont.id
      WHERE mrcpt.mrcpt_users = ?
      AND mrcpt.mrcpt_bsins = ?`;
    let params = [mrcpt_users, mrcpt_bsins];

    // Optional filters
    if (mrcpt_cntct) {
      sql += ` AND cont.cntct_cntnm LIKE ?`;
      params.push(`%${mrcpt_cntct}%`);
    }

    if (mrcpt_trnno) {
      sql += ` AND mrcpt.mrcpt_trnno LIKE ?`;
      params.push(`%${mrcpt_trnno}%`);
    }

    //console.log("params", mrcpt_trdat);

    if (mrcpt_trdat) {
      const dateObj = new Date(mrcpt_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(mrcpt.mrcpt_trdat) = ?`;
      params.push(formattedDate);
    }

    if (mrcpt_refno) {
      sql += ` AND mrcpt.mrcpt_refno LIKE ?`;
      params.push(`%${mrcpt_refno}%`);
    }

    if (search_option) {
      switch (search_option) {
        case "mrcpt_ispad":
          sql += ` AND mrcpt.mrcpt_duamt > 0`;
          break;
        case "mrcpt_ispst":
          sql += ` AND mrcpt.mrcpt_ispst = 0`;
          break;
        case "mrcpt_iscls":
          sql += ` AND mrcpt.mrcpt_iscls = 1`;
          break;
        case "mrcpt_vatcl":
          sql += ` AND mrcpt.mrcpt_vatcl = 1`;
          break;
        case "mrcpt_hscnl":
          sql += ` AND mrcpt.mrcpt_hscnl = 1`;
          break;
        case "last_3_days":
          sql += ` AND mrcpt.mrcpt_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND mrcpt.mrcpt_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` ORDER BY mrcpt.mrcpt_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase receipt for ${mrcpt_users}`,
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

// receipt details
router.post("/receipt-details", async (req, res) => {
  try {
    const { crcpt_mrcpt } = req.body;

    // Validate input
    if (!crcpt_mrcpt) {
      return res.json({
        success: false,
        message: "Receipt ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT crcpt.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmpb_crcpt crcpt
    LEFT JOIN tmib_items itm ON crcpt.crcpt_items = itm.id
    LEFT JOIN tmib_bitem bitm ON crcpt.crcpt_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE crcpt.crcpt_mrcpt = ?
    ORDER BY itm.items_icode, itm.items_iname`;
    let params = [crcpt_mrcpt];

    const rows = await dbGetAll(
      sql,
      params,
      `Get purchase receipt for ${crcpt_mrcpt}`,
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

// receipt expenses
router.post("/receipt-expense", async (req, res) => {
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
      `Get purchase receipt expenses for ${expns_refid}`,
    );
    res.json({
      success: true,
      message: "Purchase receipt expenses fetched successfully",
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
      //tmtb_paybl
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
        mrcpt_pyamt,
        0,
        0,
        mrcpt_ispad,
        mrcpt_ispst,
        0,
        0,
        0,
        user_id,
        user_id,
      ],
      label: `Created PR master ${mrcpt_trnno_new}`,
    });

    //Insert receipt details
    for (const det of tmpb_crcpt) {
      scripts.push({
        sql: `INSERT INTO tmpb_crcpt(id, crcpt_mrcpt, crcpt_bitem, crcpt_items, crcpt_itrat, crcpt_itqty,
        crcpt_itamt, crcpt_dspct, crcpt_dsamt, crcpt_vtpct, crcpt_vtamt, crcpt_csrat,
        crcpt_ntamt, crcpt_notes, crcpt_attrb, crcpt_rtqty, crcpt_slqty, crcpt_ohqty, crcpt_cbkng,
        crcpt_crusr, crcpt_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
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
          det.crcpt_attrb || "",
          0,
          0,
          det.crcpt_ohqty || 1, //det.cbkng_pnqty,
          det.crcpt_cbkng, //ref of booking line
          user_id,
          user_id,
        ],
        label: `Created PR detail ${mrcpt_trnno_new}`,
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
          mrcpt_users,
          mrcpt_bsins,
          mrcpt_cntct,
          id,
          mrcpt_trnno_new,
          "Purchase Receipt",
          mrcpt_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created PR expense ${mrcpt_trnno_new}`,
      });
    }

    //Insert payment details :: debit
    scripts.push({
      sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
      paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
      paybl_cramt, paybl_crusr, paybl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
        mrcpt_users,
        mrcpt_bsins,
        mrcpt_cntct,
        "Payment",
        id,
        mrcpt_trnno_new,
        "Purchase Receipt",
        mrcpt_trdat,
        "Supplier Payment",
        "Payment",
        mrcpt_pyamt,
        0,
        user_id,
        user_id,
      ],
      label: `Created payment debit ${mrcpt_trnno_new}`,
    });

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
        mrcpt_users,
        mrcpt_bsins,
        mrcpt_cntct,
        "Inventory",
        id,
        mrcpt_trnno_new,
        "Purchase Receipt",
        mrcpt_trdat,
        "Supplier Goods",
        "Products",
        0,
        mrcpt_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${mrcpt_trnno_new}`,
    });

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
      //tmtb_paybl
    } = req.body;

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
    //remove details
    const scripts = [];
    scripts.push({
      sql: `DELETE FROM tmpb_crcpt WHERE crcpt_mrcpt = ?`,
      params: [id],
      label: `Delete receipt details for ${mrcpt_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmpb_expns WHERE expns_refid = ?`,
      params: [id],
      label: `Delete receipt expense details for ${mrcpt_trnno}`,
    });
    scripts.push({
      sql: `DELETE FROM tmtb_paybl WHERE paybl_refid = ?`,
      params: [id],
      label: `Delete receipt payment details for ${mrcpt_trnno}`,
    });
    await dbRunAll(scripts);

    //update master
    const scripts_updt = [];
    scripts_updt.push({
      sql: `UPDATE tmpb_mrcpt
    SET mrcpt_cntct = ?,
    mrcpt_trdat = ?,
    mrcpt_refno = ?,
    mrcpt_trnte = ?,
    mrcpt_odamt = ?,
    mrcpt_dsamt = ?,
    mrcpt_vtamt = ?,
    mrcpt_vatpy = ?,
    mrcpt_incst = ?,
    mrcpt_excst = ?,
    mrcpt_rnamt = ?,
    mrcpt_ttamt = ?,
    mrcpt_pyamt = ?,
    mrcpt_pdamt = ?,
    mrcpt_duamt = ?,
    mrcpt_ispad = ?,
    mrcpt_ispst = ?,
    mrcpt_upusr = ?,
    mrcpt_updat = current_timestamp(),
    mrcpt_rvnmr = mrcpt_rvnmr + 1
    WHERE id = ?`,
      params: [
        mrcpt_cntct,
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
        mrcpt_pyamt,
        0,
        mrcpt_ispad,
        mrcpt_ispst,
        user_id,
        id,
      ],
      label: `Update master ${mrcpt_trnno}`,
    });

    //Insert receipt details
    for (const det of tmpb_crcpt) {
      scripts_updt.push({
        sql: `INSERT INTO tmpb_crcpt(id, crcpt_mrcpt, crcpt_bitem, crcpt_items, crcpt_itrat, crcpt_itqty,
        crcpt_itamt, crcpt_dspct, crcpt_dsamt, crcpt_vtpct, crcpt_vtamt, crcpt_csrat,
        crcpt_ntamt, crcpt_notes, crcpt_attrb, crcpt_rtqty, crcpt_slqty, crcpt_ohqty, crcpt_cbkng,
        crcpt_crusr, crcpt_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
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
          det.crcpt_attrb || "",
          0,
          0,
          det.crcpt_ohqty || 1, //det.cbkng_pnqty,
          det.crcpt_cbkng, //ref of booking line
          user_id,
          user_id,
        ],
        label: `Created PR detail ${mrcpt_trnno}`,
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
          mrcpt_users,
          mrcpt_bsins,
          mrcpt_cntct,
          id,
          mrcpt_trnno_new,
          "Purchase Receipt",
          mrcpt_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created PR expense ${mrcpt_trnno_new}`,
      });
    }

    //Insert payment details :: debit
    scripts_updt.push({
      sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
      paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
      paybl_cramt, paybl_crusr, paybl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
        mrcpt_users,
        mrcpt_bsins,
        mrcpt_cntct,
        "Payment",
        id,
        mrcpt_trnno,
        "Purchase Receipt",
        mrcpt_trdat,
        "Supplier Payment",
        "Payment",
        mrcpt_pyamt,
        0,
        user_id,
        user_id,
      ],
      label: `Created payment debit ${mrcpt_trnno}`,
    });

    //Insert payment details :: credit
    scripts_updt.push({
      sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
      paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
      paybl_cramt, paybl_crusr, paybl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
        mrcpt_users,
        mrcpt_bsins,
        mrcpt_cntct,
        "Inventory",
        id,
        mrcpt_trnno,
        "Purchase Receipt",
        mrcpt_trdat,
        "Supplier Goods",
        "Products",
        0,
        mrcpt_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${mrcpt_trnno}`,
    });

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
    const { mrcpt_users, mrcpt_bsins, mrcpt_cntct } = req.body;

    // Validate input
    if (!mrcpt_users || !mrcpt_bsins || !mrcpt_cntct) {
      return res.json({
        success: false,
        message: "User ID and Business ID and Contact ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT cbkg.id AS id, '' AS crcpt_mrcpt, cbkg.cbkng_bitem AS crcpt_bitem, cbkg.cbkng_items AS crcpt_items,
    cbkg.cbkng_itrat AS crcpt_itrat, cbkg.cbkng_pnqty AS crcpt_itqty, cbkg.cbkng_itamt AS crcpt_itamt, cbkg.cbkng_dspct AS crcpt_dspct,
    cbkg.cbkng_dsamt AS crcpt_dsamt, cbkg.cbkng_vtpct AS crcpt_vtpct, cbkg.cbkng_vtamt AS crcpt_vtamt, cbkg.cbkng_csrat AS crcpt_csrat,
    cbkg.cbkng_ntamt AS crcpt_ntamt, cbkg.cbkng_notes AS crcpt_notes, cbkg.cbkng_attrb AS crcpt_attrb,
    0 AS crcpt_rtqty, 0 AS crcpt_slqty,
    cbkg.cbkng_pnqty AS crcpt_ohqty,
    cbkg.id AS crcpt_cbkng, 0 as edit_stop,
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
    ORDER BY bkg.mbkng_trdat, itm.items_iname`;
    let params = [mrcpt_users, mrcpt_bsins, mrcpt_cntct];
    const rows = await dbGetAll(
      sql,
      params,
      `Get available purchase bookings for ${mrcpt_users}`,
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
