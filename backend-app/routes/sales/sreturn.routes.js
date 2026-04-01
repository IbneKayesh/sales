const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      mretn_users,
      mretn_bsins,
      mretn_cntct,
      mretn_trnno,
      mretn_trdat,
      mretn_refno,
      search_option,
    } = req.body;

    // Validate input
    if (!mretn_users || !mretn_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT mretn.*, mretn.mretn_ispst as edit_stop,
    cont.cntct_cntnm, cont.cntct_cntps, cont.cntct_cntno, cont.cntct_ofadr, cont.cntct_crlmt
      FROM tmeb_mretn mretn
      LEFT JOIN tmcb_cntct cont on mretn.mretn_cntct = cont.id
      WHERE mretn.mretn_users = $1
      AND mretn.mretn_bsins = $2`;
    let params = [mretn_users, mretn_bsins];

    // Optional filters
    if (mretn_cntct) {
      params.push(`%${mretn_cntct}%`);
      sql += ` AND cont.cntct_cntnm ILIKE $${params.length}`;
    }

    if (mretn_trnno) {
      params.push(`%${mretn_trnno}%`);
      sql += ` AND mretn.mretn_trnno ILIKE $${params.length}`;
    }

    //console.log("params", mretn_trdat);
    if (mretn_trdat) {
      const dateObj = new Date(mretn_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      params.push(formattedDate);
      sql += ` AND DATE(mretn.mretn_trdat) = $${params.length}`;
    }

    if (mretn_refno) {
      params.push(`%${mretn_refno}%`);
      sql += ` AND mretn.mretn_refno LIKE $${params.length}`;
    }

    if (search_option) {
      switch (search_option) {
        case "mretn_ispad":
          sql += ` AND mretn.mretn_duamt > 0`;
          break;
        case "mretn_ispst":
          sql += ` AND mretn.mretn_ispst = 0`;
          break;
        case "mretn_iscls":
          sql += ` AND mretn.mretn_iscls = 1`;
          break;
        case "mretn_vatcl":
          sql += ` AND mretn.mretn_vatcl = 1`;
          break;
        case "mretn_hscnl":
          sql += ` AND mretn.mretn_hscnl = 1`;
          break;
        case "last_3_days":
          //sql += ` AND mretn.mretn_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          sql += ` AND mretn.mretn_trdat >= CURRENT_DATE - INTERVAL '3 days'`;
          break;
        case "last_7_days":
          //sql += ` AND mretn.mretn_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          sql += ` AND mretn.mretn_trdat >= CURRENT_DATE - INTERVAL '7 days'`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    } else if (!search_option && params.length === 2) {
      //default 3 days
      sql += ` AND mretn.mretn_trdat >= CURRENT_DATE - INTERVAL '3 days'`;
    }

    sql += ` ORDER BY mretn.mretn_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      params,
      `Get Sales invoices for ${mretn_users}`,
    );
    res.json({
      success: true,
      message: "Sales invoices fetched successfully",
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
    const { cretn_mretn } = req.body;

    // Validate input
    if (!cretn_mretn) {
      return res.json({
        success: false,
        message: "Invoice ID is required",
        data: null,
      });
    }
    console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT invc.*, 0 as edit_stop,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmeb_cretn invc
    LEFT JOIN tmib_items itm ON invc.cretn_items = itm.id
    LEFT JOIN tmib_bitem bitm ON invc.cretn_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE invc.cretn_mretn = $1
    ORDER BY itm.items_icode, itm.items_iname`;
    let params = [cretn_mretn];

    const rows = await dbGetAll(
      sql,
      params,
      `Get Sales booking for ${cretn_mretn}`,
    );
    res.json({
      success: true,
      message: "Sales booking fetched successfully",
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
    FROM tmeb_expns expn
    WHERE expn.expns_refid = $1
    ORDER BY expn.expns_inexc, expn.expns_xpamt`;
    let params = [expns_refid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get Sales invoice expenses for ${expns_refid}`,
    );
    res.json({
      success: true,
      message: "Sales booking expenses fetched successfully",
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
    const { rcvbl_refid } = req.body;

    // Validate input
    if (!rcvbl_refid) {
      return res.json({
        success: false,
        message: "Payment ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT pybl.*
    FROM tmtb_rcvbl pybl
    WHERE pybl.rcvbl_refid = $1
    ORDER BY pybl.rcvbl_cramt,pybl.rcvbl_trdat`;
    let params = [rcvbl_refid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get Sales invoice payment for ${rcvbl_refid}`,
    );
    res.json({
      success: true,
      message: "Sales booking payment fetched successfully",
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
      mretn_users,
      mretn_bsins,
      mretn_cntct,
      mretn_trnno,
      mretn_trdat,
      mretn_refno,
      mretn_trnte,
      mretn_odamt,
      mretn_dsamt,
      mretn_vtamt,
      mretn_vatpy,
      mretn_incst,
      mretn_excst,
      mretn_rnamt,
      mretn_ttamt,
      mretn_pyamt,
      mretn_pdamt,
      mretn_duamt,
      mretn_rtamt,
      mretn_ispad,
      mretn_ispst,
      mretn_iscls,
      mretn_vatcl,
      mretn_hscnl,
      mretn_refid,
      user_id,
      tmeb_cretn,
      tmeb_expns,
      tmtb_rcvbl,
    } = req.body;

    //console.log("create:", JSON.stringify(req.body));
    //return;

    // Validate input
    if (
      !id ||
      !mretn_users ||
      !mretn_bsins ||
      !mretn_cntct ||
      !mretn_trdat ||
      !tmeb_cretn ||
      !Array.isArray(tmeb_cretn)
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

    const sql = `SELECT COALESCE(MAX(CAST(RIGHT(mretn_trnno, 5) AS INTEGER)), 0) AS max_seq
      FROM tmeb_mretn
      WHERE DATE(mretn_trdat) = CURRENT_DATE`;
    const max_seq = await dbGet(sql, []);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const mretn_trnno_new = `SR-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + mretn_trnno_new);

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmeb_mretn(id, mretn_users, mretn_bsins, mretn_cntct, mretn_trnno, mretn_trdat,
      mretn_refno, mretn_trnte, mretn_odamt, mretn_dsamt, mretn_vtamt, mretn_vatpy,
      mretn_incst, mretn_excst, mretn_rnamt, mretn_ttamt, mretn_pyamt, mretn_pdamt,
      mretn_duamt, mretn_rtamt, mretn_ispad, mretn_ispst, mretn_iscls, mretn_vatcl,
      mretn_hscnl, mretn_refid, mretn_crusr, mretn_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28)`,
      params: [
        id,
        mretn_users,
        mretn_bsins,
        mretn_cntct,
        mretn_trnno_new,
        mretn_trdat,
        mretn_refno,
        mretn_trnte,
        mretn_odamt,
        mretn_dsamt,
        mretn_vtamt,
        mretn_vatpy,
        mretn_incst,
        mretn_excst,
        mretn_rnamt,
        mretn_ttamt,
        mretn_pyamt,
        mretn_pdamt,
        mretn_duamt,
        0,
        mretn_ispad,
        mretn_ispst,
        0,
        0,
        0,
        mretn_refid,
        user_id,
        user_id,
      ],
      label: `Created SR master ${mretn_trnno_new}`,
    });

    //Insert invoice details
    for (const det of tmeb_cretn) {
      scripts.push({
        sql: `INSERT INTO tmeb_cretn(id, cretn_mretn, cretn_bitem, cretn_items, cretn_itrat, cretn_itqty,
        cretn_itamt, cretn_dspct, cretn_dsamt, cretn_vtpct, cretn_vtamt, cretn_csrat,
        cretn_ntamt, cretn_lprat, cretn_notes, cretn_attrb, cretn_srcnm, cretn_refid,
        cretn_crusr, cretn_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20)`,
        params: [
          uuidv4(),
          id,
          det.cretn_bitem,
          det.cretn_items,
          det.cretn_itrat || 0,
          det.cretn_itqty || 1,
          det.cretn_itamt || 0,
          det.cretn_dspct || 0,
          det.cretn_dsamt || 0,
          det.cretn_vtpct || 0,
          det.cretn_vtamt || 0,
          det.cretn_csrat || 0,
          det.cretn_ntamt || 0,
          det.cretn_lprat || 0,
          det.cretn_notes || "",
          det.cretn_attrb || "",
          det.cretn_srcnm,
          det.cretn_refid,
          user_id,
          user_id,
        ],
        label: `Created SR detail ${mretn_trnno_new}`,
      });
    }

    //Insert expense details
    for (const pay of tmeb_expns) {
      scripts.push({
        sql: `INSERT INTO tmeb_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_trdat, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13)`,
        params: [
          uuidv4(),
          mretn_users,
          mretn_bsins,
          mretn_cntct,
          id,
          mretn_trnno_new,
          "Sales Return",
          mretn_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created SR expense ${mretn_trnno_new}`,
      });
    }

    //Insert payment details :: debit
    for (const pay of tmtb_rcvbl) {
      if (pay.rcvbl_dbamt > 0) {
        scripts.push({
          sql: `INSERT INTO tmtb_rcvbl(id, rcvbl_users, rcvbl_bsins, rcvbl_cntct, rcvbl_pymod, rcvbl_refid,
        rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt,
        rcvbl_cramt, rcvbl_crusr, rcvbl_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15)`,
          params: [
            uuidv4(),
            mretn_users,
            mretn_bsins,
            mretn_cntct,
            pay.rcvbl_pymod,
            id,
            mretn_trnno_new,
            "Sales Return",
            mretn_trdat,
            pay.rcvbl_descr,
            pay.rcvbl_notes,
            pay.rcvbl_dbamt,
            0,
            user_id,
            user_id,
          ],
          label: `Created payment debit ${mretn_trnno_new}`,
        });
      }
    }

    //Insert payment details :: credit
    scripts.push({
      sql: `INSERT INTO tmtb_rcvbl(id, rcvbl_users, rcvbl_bsins, rcvbl_cntct, rcvbl_pymod, rcvbl_refid,
      rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt,
      rcvbl_cramt, rcvbl_crusr, rcvbl_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15)`,
      params: [
        uuidv4(),
        mretn_users,
        mretn_bsins,
        mretn_cntct,
        "Inventory",
        id,
        mretn_trnno_new,
        "Sales Return",
        mretn_trdat,
        "Customer Goods",
        "Products",
        0,
        mretn_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${mretn_trnno_new}`,
    });

    //when posted
    if (mretn_ispst) {
      for (const det of tmeb_cretn) {
        
        // 0 :: No Stock
        // 1 :: Single Stock
        // 2 :: Bulk Stock

        scripts.push({
          sql: `UPDATE tmib_bitem b
          SET
            bitem_gstkq = bitem_gstkq + CASE WHEN itm.items_trcks = 2 THEN $1 ELSE 0 END,
            bitem_istkq = bitem_istkq + CASE WHEN itm.items_trcks = 1 THEN $2 ELSE 0 END
          FROM tmib_items itm
          WHERE b.bitem_items = itm.id
            AND b.id = $3`,
          params: [
            Number(det.cretn_itqty), // for gstkq (items_track = 0)
            Number(det.cretn_itqty), // for istkq (items_track = 1)
            det.cretn_bitem, // bitem id
          ],
          label: `BItem good, item stock updated`,
        });

        //console.log("det", det);

        if (det.cretn_srcnm === "Purchase Invoice") {
          // scripts.push({
          //   sql: `UPDATE tmpb_cretn
          //       SET
          //       cretn_ohqty = cretn_ohqty + $1,
          //       cretn_slqty = cretn_slqty - $2
          //       WHERE id = $3`,
          //   params: [
          //     det.cretn_itqty, // cretn_ohqty
          //     det.cretn_itqty, // cretn_slqty
          //     det.cretn_refid,
          //   ],
          //   label: `Purchase Invoice detail updated`,
          // });
          //     } else if (det.cretn_srcnm === "Sales Receipt") {
          //       scripts.push({
          //         sql: `UPDATE tmeb_crcpt
          //         SET
          //         crcpt_ohqty = crcpt_ohqty - ?,
          //         crcpt_slqty = crcpt_slqty + ?
          //         WHERE id = ?`,
          //         params: [
          //           det.cretn_itqty, // crcpt_ohqty
          //           det.cretn_itqty, // crcpt_slqty
          //           det.cretn_refid,
          //         ],
          //         label: `Sales Receipt detail updated`,
          //       });
          //     } else if (det.cretn_srcnm === "Transfer Stock") {
          //       //sql script is need
        }
      }
    }
    //console.log("scripts",scripts);

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Sales return created successfully",
      data: {
        ...req.body,
        mretn_trnno: mretn_trnno_new,
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
    message: "Sales Invoice update is not implemented yet",
    data: null,
  });

  try {
    const {
      id,
      mretn_users,
      mretn_bsins,
      mretn_cntct,
      mretn_trnno,
      mretn_trdat,
      mretn_refno,
      mretn_trnte,
      mretn_odamt,
      mretn_dsamt,
      mretn_vtamt,
      mretn_vatpy,
      mretn_incst,
      mretn_excst,
      mretn_rnamt,
      mretn_ttamt,
      mretn_pyamt,
      mretn_pdamt,
      mretn_duamt,
      mretn_rtamt,
      mretn_ispad,
      mretn_ispst,
      mretn_iscls,
      mretn_vatcl,
      mretn_hscnl,
      user_id,
      tmeb_cretn,
      tmeb_expns,
      tmtb_rcvbl,
    } = req.body;

    // Validate input
    if (
      !id ||
      !mretn_users ||
      !mretn_bsins ||
      !mretn_cntct ||
      !mretn_trdat ||
      !tmeb_cretn ||
      !Array.isArray(tmeb_cretn)
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    //remove details
    const scripts_del = [];
    scripts_del.push({
      sql: `DELETE FROM tmeb_cretn WHERE cretn_mretn = ?`,
      params: [id],
      label: `Delete booking details for ${mretn_trnno}`,
    });
    scripts_del.push({
      sql: `DELETE FROM tmeb_expns WHERE expns_refid = ?`,
      params: [id],
      label: `Delete expenses details for ${mretn_trnno}`,
    });
    scripts_del.push({
      sql: `DELETE FROM tmtb_rcvbl WHERE rcvbl_refid = ?`,
      params: [id],
      label: `Delete payments details for ${mretn_trnno}`,
    });
    await dbRunAll(scripts_del);

    //update master
    const scripts = [];
    scripts.push({
      sql: `UPDATE tmeb_mretn
    SET mretn_cntct = ?,
    mretn_trdat = ?,
    mretn_refno = ?,
    mretn_trnte = ?,
    mretn_odamt = ?,
    mretn_dsamt = ?,
    mretn_vtamt = ?,
    mretn_vatpy = ?,
    mretn_incst = ?,
    mretn_excst = ?,
    mretn_rnamt = ?,
    mretn_ttamt = ?,
    mretn_pyamt = ?,
    mretn_pdamt = ?,
    mretn_duamt = ?,
    mretn_ispad = ?,
    mretn_ispst = ?,
    mretn_upusr = ?,
    mretn_updat = current_timestamp(),
    mretn_rvnmr = mretn_rvnmr + 1
    WHERE id = ?`,
      params: [
        mretn_cntct,
        mretn_trdat,
        mretn_refno,
        mretn_trnte,
        mretn_odamt,
        mretn_dsamt,
        mretn_vtamt,
        mretn_vatpy,
        mretn_incst,
        mretn_excst,
        mretn_rnamt,
        mretn_ttamt,
        mretn_pyamt,
        mretn_pdamt,
        mretn_duamt,
        mretn_ispad,
        mretn_ispst,
        user_id,
        id,
      ],
      label: `Update master ${mretn_trnno}`,
    });

    //console.log(JSON.stringify(tmeb_cretn));

    //Insert booking details
    for (const det of tmeb_cretn) {
      scripts.push({
        sql: `INSERT INTO tmeb_cretn(id, cretn_mretn, cretn_bitem, cretn_items, cretn_itrat, cretn_itqty,
        cretn_itamt, cretn_dspct, cretn_dsamt, cretn_vtpct, cretn_vtamt, cretn_csrat,
        cretn_ntamt, cretn_notes, cretn_attrb, cretn_rtqty, cretn_slqty, cretn_ohqty,
        cretn_crusr, cretn_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?)`,
        params: [
          uuidv4(),
          id,
          det.cretn_bitem,
          det.cretn_items,
          det.cretn_itrat || 0,
          det.cretn_itqty || 1,
          det.cretn_itamt || 0,
          det.cretn_dspct || 0,
          det.cretn_dsamt || 0,
          det.cretn_vtpct || 0,
          det.cretn_vtamt || 0,
          det.cretn_csrat || 0,
          det.cretn_ntamt || 0,
          det.cretn_notes || "",
          det.cretn_attrb || "",
          0,
          0,
          det.cretn_itqty || 1, //det.cretn_ohqty,
          user_id,
          user_id,
        ],
        label: `Created PB detail ${mretn_trnno}`,
      });
    }

    //Insert expense details
    for (const pay of tmeb_expns) {
      scripts.push({
        sql: `INSERT INTO tmeb_expns(id, expns_users, expns_bsins, expns_cntct, expns_refid, expns_refno,
        expns_srcnm, expns_trdat, expns_inexc, expns_notes, expns_xpamt, expns_crusr,
        expns_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?)`,
        params: [
          uuidv4(),
          mretn_users,
          mretn_bsins,
          mretn_cntct,
          id,
          mretn_trnno,
          "Sales Invoice",
          mretn_trdat,
          pay.expns_inexc,
          pay.expns_notes,
          pay.expns_xpamt,
          user_id,
          user_id,
        ],
        label: `Created expense ${mretn_trnno}`,
      });
    }

    //Insert payment details :: debit
    for (const pay of tmtb_rcvbl) {
      if (pay.rcvbl_dbamt > 0) {
        scripts.push({
          sql: `INSERT INTO tmtb_rcvbl(id, rcvbl_users, rcvbl_bsins, rcvbl_cntct, rcvbl_pymod, rcvbl_refid,
        rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt,
        rcvbl_cramt, rcvbl_crusr, rcvbl_upusr)
        VALUES (?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?)`,
          params: [
            uuidv4(),
            mretn_users,
            mretn_bsins,
            mretn_cntct,
            pay.rcvbl_pymod,
            id,
            mretn_trnno,
            "Sales Booking",
            mretn_trdat,
            pay.rcvbl_descr,
            pay.rcvbl_notes,
            pay.rcvbl_dbamt,
            0,
            user_id,
            user_id,
          ],
          label: `Created payment debit ${mretn_trnno}`,
        });
      }
    }

    //Insert payment details :: credit
    scripts.push({
      sql: `INSERT INTO tmtb_rcvbl(id, rcvbl_users, rcvbl_bsins, rcvbl_cntct, rcvbl_pymod, rcvbl_refid,
      rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt,
      rcvbl_cramt, rcvbl_crusr, rcvbl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
        mretn_users,
        mretn_bsins,
        mretn_cntct,
        "Inventory",
        id,
        mretn_trnno,
        "Sales Booking",
        mretn_trdat,
        "Supplier Goods",
        "Products",
        0,
        mretn_pyamt,
        user_id,
        user_id,
      ],
      label: `Created payment credit ${mretn_trnno}`,
    });

    //when posted
    if (mretn_ispst === 1) {
      for (const det of tmeb_cretn) {
        scripts.push({
          sql: `UPDATE tmib_bitem b
          JOIN tmib_items itm ON b.bitem_items = itm.id
        SET
          bitem_gstkq = bitem_gstkq + CASE WHEN itm.items_trcks = 0 THEN ? ELSE 0 END,
          bitem_istkq = bitem_istkq + CASE WHEN itm.items_trcks = 1 THEN ? ELSE 0 END
        WHERE b.id = ?`,
          params: [
            det.cretn_itqty, // for gstkq (items_track = 0)
            det.cretn_itqty, // for istkq (items_track = 1)
            det.cretn_bitem, // bitem id
          ],
          label: `BItem good, item stock updated`,
        });
      }
    }

    await dbRunAll(scripts);
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

//invoice return
router.post("/invoice-return", async (req, res) => {
  try {
    const { mretn_users, mretn_bsins, mretn_refid } = req.body;

    // Validate input
    if (!mretn_users || !mretn_bsins || !mretn_refid) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }
    //console.log("req.body", JSON.stringify(req.body));

    //database action
    const sql = `SELECT '' AS id, minv.mretn_users AS mretn_users, minv.mretn_bsins AS mretn_bsins,
    minv.mretn_cntct AS mretn_cntct, '' AS mretn_trnno, CURRENT_TIMESTAMP AS mretn_trdat,
    minv.mretn_trnno AS mretn_refno, minv.mretn_trnte AS mretn_trnte, minv.mretn_odamt AS mretn_odamt,
    minv.mretn_dsamt AS mretn_dsamt, minv.mretn_vtamt AS mretn_vtamt, minv.mretn_vatpy AS mretn_vatpy,
    minv.mretn_incst AS mretn_incst, minv.mretn_excst AS mretn_excst, minv.mretn_rnamt AS mretn_rnamt,
    minv.mretn_ttamt AS mretn_ttamt, minv.mretn_pyamt AS mretn_pyamt, minv.mretn_pdamt AS mretn_pdamt,
    minv.mretn_duamt AS mretn_duamt, minv.mretn_rtamt AS mretn_rtamt, minv.mretn_ispad AS mretn_ispad,
    minv.mretn_ispst AS mretn_ispst, minv.mretn_iscls AS mretn_iscls, minv.mretn_vatcl AS mretn_vatcl,
    minv.mretn_hscnl AS mretn_hscnl, minv.id AS mretn_refid,
    cont.cntct_cntnm, cont.cntct_cntps, cont.cntct_cntno, cont.cntct_ofadr, cont.cntct_crlmt
    FROM tmeb_mretn minv    
    LEFT JOIN tmcb_cntct cont on minv.mretn_cntct = cont.id
    WHERE minv.mretn_ispad IN (0,1,2)
    AND minv.mretn_ispst = TRUE
    AND minv.mretn_hscnl = FALSE
    AND minv.mretn_users = $1
    AND minv.mretn_bsins = $2
    AND minv.id = $3
    `;
    const params = [mretn_users, mretn_bsins, mretn_refid];

    const rows = await dbGet(
      sql,
      params,
      `Get Sales invoices for ${mretn_refid}`,
    );
    res.json({
      success: true,
      message: "Sales invoices fetched successfully",
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

//invoice return details
router.post("/invoice-return-details", async (req, res) => {
  try {
    const { mretn_refid } = req.body;

    // Validate input
    if (!mretn_refid) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }
    //console.log("req.body", JSON.stringify(req.body));

    //database action
    const sql = `SELECT gen_random_uuid() AS id, '' AS cretn_mretn, cinv.cretn_bitem AS cretn_bitem,
    cinv.cretn_items AS cretn_items, cinv.cretn_itrat AS cretn_itrat, cinv.cretn_itqty AS cretn_itqty,
    cinv.cretn_itamt AS cretn_itamt, cinv.cretn_dspct AS cretn_dspct, cinv.cretn_dsamt AS cretn_dsamt,
    cinv.cretn_vtpct AS cretn_vtpct, cinv.cretn_vtamt AS cretn_vtamt, cinv.cretn_csrat AS cretn_csrat,
    cinv.cretn_ntamt AS cretn_ntamt, cinv.cretn_lprat AS cretn_lprat, cinv.cretn_notes AS cretn_notes,
    cinv.cretn_attrb AS cretn_attrb, cinv.cretn_attrn AS cretn_attrn, cinv.cretn_srcnm AS cretn_srcnm,
    cinv.id AS cretn_refid,
    itm.items_icode, itm.items_iname, itm.items_dfqty, bitm.bitem_gstkq,
    puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
    FROM tmeb_cretn cinv    
    LEFT JOIN tmib_items itm ON cinv.cretn_items = itm.id
    LEFT JOIN tmib_bitem bitm ON cinv.cretn_bitem = bitm.id
    LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
    LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
    WHERE cinv.cretn_mretn = $1`;
    const params = [mretn_refid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get Sales invoices for ${mretn_refid}`,
    );
    res.json({
      success: true,
      message: "Sales invoices fetched successfully",
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
