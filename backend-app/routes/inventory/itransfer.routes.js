const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      mtrsf_users,
      mtrsf_bsins,
      mtrsf_bsins_to,
      mtrsf_trnno,
      mtrsf_trdat,
      mtrsf_refno,
      search_option,
    } = req.body;

    // Validate input
    if (!mtrsf_users || !mtrsf_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT mts.*, mts.mtrsf_ispst as edit_stop,
    bsn.bsins_bname, bsn.bsins_addrs, bsn.bsins_cntct
      FROM tmib_mtrsf mts
      LEFT JOIN tmsb_bsins bsn on mts.mtrsf_bsins_to = bsn.id
      WHERE mts.mtrsf_users = ?
      AND mts.mtrsf_bsins = ?`;
    let params = [mtrsf_users, mtrsf_bsins];

    // Optional filters
    if (mtrsf_bsins_to) {
      sql += ` AND bsn.bsins_bname LIKE ?`;
      params.push(`%${mtrsf_bsins_to}%`);
    }

    if (mtrsf_trnno) {
      sql += ` AND mts.mtrsf_trnno LIKE ?`;
      params.push(`%${mtrsf_trnno}%`);
    }

    //console.log("params", mtrsf_trdat);

    if (mtrsf_trdat) {
      const dateObj = new Date(mtrsf_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(mts.mtrsf_trdat) = ?`;
      params.push(formattedDate);
    }

    if (mtrsf_refno) {
      sql += ` AND mts.mtrsf_refno LIKE ?`;
      params.push(`%${mtrsf_refno}%`);
    }

    if (search_option) {
      switch (search_option) {
        case "mtrsf_ispst":
          sql += ` AND mts.mtrsf_ispst = 0`;
          break;
        case "last_3_days":
          sql += ` AND mts.mtrsf_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND mts.mtrsf_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` ORDER BY mts.mtrsf_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      params,
      `Get inventory transfers for ${mtrsf_users}`,
    );
    res.json({
      success: true,
      message: "Inventory transfers fetched successfully",
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

// transfer details
router.post("/transfer-details", async (req, res) => {
  try {
    const { ctrsf_mtrsf } = req.body;

    // Validate input
    if (!ctrsf_mtrsf) {
      return res.json({
        success: false,
        message: "Transfer ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT ctrs.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmib_ctrsf ctrs
    LEFT JOIN tmib_items itm ON ctrs.ctrsf_items = itm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE ctrs.ctrsf_mtrsf = ?
    ORDER BY itm.items_icode, itm.items_iname`;
    let params = [ctrsf_mtrsf];

    const rows = await dbGetAll(
      sql,
      params,
      `Get transfer details for ${ctrsf_mtrsf}`,
    );
    res.json({
      success: true,
      message: "Transfer details fetched successfully",
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

// transfer expenses
router.post("/transfer-expense", async (req, res) => {
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
    FROM tmib_expns expn
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
      mtrsf_users,
      mtrsf_bsins,
      mtrsf_bsins_to,
      mtrsf_trnno,
      mtrsf_trdat,
      mtrsf_refno,
      mtrsf_trnte,
      mtrsf_odamt,
      mtrsf_excst,
      mtrsf_ttamt,
      mtrsf_ispst,
      mtrsf_isrcv,
      mtrsf_rcusr,
      mtrsf_rcdat,
      user_id,
      tmib_ctrsf,
      tmib_expns,
    } = req.body;

    //console.log("create:", JSON.stringify(req.body));
    //return;
    // Validate input
    if (
      !id ||
      !mtrsf_users ||
      !mtrsf_bsins ||
      !mtrsf_bsins_to ||
      !mtrsf_trdat ||
      !tmib_ctrsf ||
      !Array.isArray(tmib_ctrsf)
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
    const sql = `SELECT MAX(CAST(RIGHT(mtrsf_trnno, 5) AS UNSIGNED)) AS max_seq
      FROM tmib_mtrsf
      WHERE DATE(mtrsf_trdat) = CURDATE()`;
    const max_seq = await dbGet(sql, []);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const mtrsf_trnno_new = `IT-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + mtrsf_trnno_new);

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmib_mtrsf(id, mtrsf_users, mtrsf_bsins, mtrsf_bsins_to, mtrsf_trnno, mtrsf_trdat,
      mtrsf_refno, mtrsf_trnte, mtrsf_odamt, mtrsf_excst, mtrsf_ttamt, mtrsf_ispst,
      mtrsf_isrcv, mtrsf_rcusr, mtrsf_rcdat, mtrsf_crusr, mtrsf_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?)`,
      params: [
        id,
        mtrsf_users,
        mtrsf_bsins,
        mtrsf_bsins_to,
        mtrsf_trnno_new,
        mtrsf_trdat,
        mtrsf_refno,
        mtrsf_trnte,
        mtrsf_odamt,
        mtrsf_excst,
        mtrsf_ttamt,
        mtrsf_ispst,
        0,
        "",
        mtrsf_trdat,
        user_id,
        user_id,
      ],
      label: `Created IT master ${mtrsf_trnno_new}`,
    });

    //Insert booking details
    for (const det of tmib_ctrsf) {
      scripts.push({
        sql: `INSERT INTO tmib_ctrsf(id, ctrsf_mtrsf, ctrsf_bitem, ctrsf_items, ctrsf_itrat, ctrsf_itqty,
        ctrsf_itamt, ctrsf_csrat, ctrsf_ntamt, ctrsf_notes, ctrsf_attrb, ctrsf_rtqty,
        ctrsf_slqty, ctrsf_ohqty, ctrsf_srcnm, ctrsf_refid, ctrsf_crusr, ctrsf_upusr)
          VALUES (?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.ctrsf_bitem,
          det.ctrsf_items,
          det.ctrsf_itrat || 0,
          det.ctrsf_itqty || 1,
          det.ctrsf_itamt || 0,
          det.ctrsf_csrat || 0,
          det.ctrsf_ntamt || 0,
          det.ctrsf_notes || 0,
          det.ctrsf_attrb || 0,
          0, //ctrsf_rtqty
          0, //ctrsf_slqty
          det.ctrsf_itqty || 1, //ctrsf_ohqty
          det.ctrsf_srcnm || "",
          det.ctrsf_refid || "",
          user_id,
          user_id,
        ],
        label: `Created IT detail ${mtrsf_trnno_new}`,
      });
    }

    //Insert expense details
    for (const pay of tmib_expns) {
      scripts.push({
        sql: `INSERT INTO tmib_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_trdat, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?)`,
        params: [
          uuidv4(),
          mtrsf_users,
          mtrsf_bsins,
          mtrsf_bsins_to,
          id,
          mtrsf_trnno_new,
          "Internal Transfer",
          mtrsf_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created IT expense ${mtrsf_trnno_new}`,
      });
    }

    //Insert payment details :: debit
    // scripts.push({
    //   sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
    //     paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
    //     paybl_cramt, paybl_crusr, paybl_upusr)
    //     VALUES (?, ?, ?, ?, ?, ?,
    //     ?, ?, ?, ?, ?, ?,
    //     ?, ?, ?)`,
    //   params: [
    //     uuidv4(),
    //     mtrsf_users,
    //     mtrsf_bsins,
    //     mtrsf_bsins_to,
    //     "Inventory",
    //     id,
    //     mtrsf_trnno_new,
    //     "Internal Transfer",
    //     mtrsf_trdat,
    //     "Internal Transfer",
    //     "Products",
    //     mtrsf_ttamt,
    //     0,
    //     user_id,
    //     user_id,
    //   ],
    //   label: `Created payment debit ${mtrsf_trnno_new}`,
    // });

    //Insert payment details :: credit
    // scripts.push({
    //   sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
    //   paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
    //   paybl_cramt, paybl_crusr, paybl_upusr)
    //   VALUES (?, ?, ?, ?, ?, ?,
    //   ?, ?, ?, ?, ?, ?,
    //   ?, ?, ?)`,
    //   params: [
    //     uuidv4(),
    //     mtrsf_users,
    //     mtrsf_bsins,
    //     mtrsf_bsins_to,
    //     "Inventory",
    //     id,
    //     mtrsf_trnno_new,
    //     "Internal Transfer",
    //     mtrsf_trdat,
    //     "Internal Transfer",
    //     "Products",
    //     0,
    //     mtrsf_ttamt,
    //     user_id,
    //     user_id,
    //   ],
    //   label: `Created payment credit ${mtrsf_trnno_new}`,
    // });

    //when posted
    if (mtrsf_ispst === 1) {
      for (const det of tmib_ctrsf) {
        if (det.ctrsf_srcnm === "Purchase Invoice") {
          scripts.push({
            sql: `UPDATE tmpb_cinvc
          SET cinvc_slqty = cinvc_slqty + ?,
          cinvc_ohqty = cinvc_ohqty - ?
          WHERE id = ?`,
            params: [det.ctrsf_itqty, det.ctrsf_itqty, det.ctrsf_refid],
            label: `Purchase invoice sold, on-hand qty updated`,
          });
        }
        else if (det.ctrsf_srcnm === "Purchase Receipt") {
          scripts.push({
            sql: `UPDATE tmpb_crcpt
          SET crcpt_slqty = crcpt_slqty + ?,
          crcpt_ohqty = crcpt_ohqty - ?
          WHERE id = ?`,
            params: [det.ctrsf_itqty, det.ctrsf_itqty, det.ctrsf_refid],
            label: `Purchase received sold, on-hand qty updated`,
          });
        }

        if (det.ctrsf_srcnm === "Inventory Stock") {
          scripts.push({
            sql: `UPDATE tmib_bitem
        SET bitem_gstkq = bitem_gstkq - ?
        WHERE id = ?`,
            params: [det.ctrsf_itqty, det.ctrsf_bitem],
            label: `B item good stock updated`,
          });
        } else {
          scripts.push({
            sql: `UPDATE tmib_bitem
        SET bitem_istkq = bitem_istkq - ?
        WHERE id = ?`,
            params: [det.ctrsf_itqty, det.ctrsf_bitem],
            label: `B item item stock updated`,
          });
        }
      }
    }

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Transfer created successfully",
      data: {
        ...req.body,
        mtrsf_trnno: mtrsf_trnno_new,
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
  return res.json({
    success: true,
    message: "Transfer updated not implemented",
    data: null,
  });
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
