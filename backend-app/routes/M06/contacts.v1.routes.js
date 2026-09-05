const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode, getDefaultCOAforPartyId } = require("../../db/genHelper");

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
    //LEFT JOIN tmib_price prc ON cnt.cntct_price = prc.id
    //database action
    const sql = `SELECT cnt.*,
    try.trtry_cname, tar.tarea_cname, dzn.dzone_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmcb_cntct cnt
    LEFT JOIN tmcb_trtry try ON cnt.cntct_trtry = try.id
    LEFT JOIN tmcb_tarea tar ON cnt.cntct_tarea = tar.id
    LEFT JOIN tmcb_dzone dzn ON cnt.cntct_dzone = dzn.id
    LEFT JOIN tmhb_emply csr ON cnt.cntct_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON cnt.cntct_upusr = usr.id
    WHERE cnt.cntct_users = $1
    ORDER BY cnt.cntct_cname ASC`;

    //JOIN tmnb_shtbl ctr ON cnt.cntct_cntry = ctr.shtbl_value AND ctr.shtbl_gname = 'Country'
    //JOIN tmnb_shtbl crn ON cnt.cntct_crncy = crn.shtbl_value AND crn.shtbl_gname = 'Currency'

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact- ${user_c}`);
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
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact- ${user_c}`);
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
      cntct_users,
      cntct_bsins,
      cntct_ccode,
      cntct_ctype,
      cntct_sorce,
      cntct_cname,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_trtry,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_crncy,
      cntct_dspct,
      cntct_crlmt,
      cntct_crbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !cntct_ctype ||
      !cntct_sorce ||
      !cntct_cname ||
      !cntct_cntps ||
      !cntct_cntno ||
      !cntct_cntry ||
      !cntct_crncy ||
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
    const sql_chtac = `SELECT cht.id AS chtac_id
    FROM tmtb_chtac cht
    JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
    WHERE cht.chtac_users = $1
    AND cht.chtac_bsins = $2
    AND crt.chtrt_trnid = 'SYS_SUB_LEDGER_PARTY'
    AND crt.chtrt_pegid = 'SYS_CONTACTS_CREATE'
    AND crt.chtrt_grpid = 'SYS_PARTY_SINGLE'
    AND crt.chtrt_route = $3`;
    const row_chtac = await dbGetAll(
      sql_chtac,
      [user_c, user_b, cntct_ctype],
      `get account coa- ${cntct_ctype}`,
    );

    if (row_chtac.length === 0) {
      return res.json({
        success: false,
        message: `No account party setup for ${cntct_ctype}`,
        data: {},
      });
    }

    const masterId = uuidv4();
    const scripts = [];
    const newCode = await GenNewCode(user_c, "tmcb_cntct");
    scripts.push({
      sql: `INSERT INTO tmcb_cntct(id, cntct_users, cntct_bsins, cntct_ccode, cntct_ctype, cntct_sorce,
        cntct_cname, cntct_cntps, cntct_cntno, cntct_email, cntct_tinno, cntct_trade,
        cntct_ofadr, cntct_fcadr, cntct_trtry, cntct_tarea, cntct_dzone, cntct_cntry,
        cntct_cntad, cntct_crncy, cntct_dspct, cntct_crlmt, cntct_crbal, cntct_crusr, cntct_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25)`,
      params: [
        masterId,
        user_c,
        user_b,
        newCode,
        cntct_ctype,
        cntct_sorce,
        cntct_cname,
        cntct_cntps,
        cntct_cntno,
        cntct_email,
        cntct_tinno,
        cntct_trade,
        cntct_ofadr,
        cntct_fcadr,
        cntct_trtry,
        cntct_tarea,
        cntct_dzone,
        cntct_cntry,
        cntct_cntad,
        cntct_crncy,
        cntct_dspct || 0,
        cntct_crlmt || 0,
        0, //cntct_crbal
        user_s,
        user_s,
      ],
      label: `create contact- ${user_c}`,
    });

    for (row of row_chtac) {
      const newCodeParty = await GenNewCode(user_c, "tmtb_party");
      scripts.push({
        sql: `INSERT INTO tmtb_party(id, party_users, party_bsins, party_ccode, party_ptype, party_chtac,
      party_vndor, party_cname, party_opbal, party_crusr, party_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newCodeParty,
          cntct_ctype,
          row.chtac_id,
          masterId,
          cntct_cname,
          0,
          user_s,
          user_s,
        ],
        label: `create party accounts- ${user_c}`,
      });
    }
    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${cntct_cname} - Created successfully.`,
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

const update = async (req, res) => {
  try {
    const {
      id,
      cntct_users,
      cntct_bsins,
      cntct_ccode,
      cntct_ctype,
      cntct_sorce,
      cntct_cname,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_trtry,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_crncy,
      cntct_dspct,
      cntct_crlmt,
      cntct_crbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !cntct_ctype ||
      !cntct_sorce ||
      !cntct_cname ||
      !cntct_cntps ||
      !cntct_cntno ||
      !cntct_cntry ||
      !cntct_crncy ||
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
    const scripts = [];
    //cntct_ctype :: accounts party created - don't update
    scripts.push({
      sql: `UPDATE tmcb_cntct
    SET cntct_sorce = $1,
    cntct_cname = $2,
    cntct_cntps = $3,
    cntct_cntno = $4,
    cntct_email = $5,
    cntct_tinno = $6,
    cntct_trade = $7,
    cntct_ofadr = $8,
    cntct_fcadr = $9,
    cntct_trtry = $10,
    cntct_tarea = $11,
    cntct_dzone = $12,
    cntct_cntry = $13,
    cntct_cntad = $14,
    cntct_crncy = $15,
    cntct_dspct = $16,
    cntct_crlmt = $17,
    cntct_upusr = $18,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $19`,
      params: [
        cntct_sorce,
        cntct_cname,
        cntct_cntps,
        cntct_cntno,
        cntct_email,
        cntct_tinno,
        cntct_trade,
        cntct_ofadr,
        cntct_fcadr,
        cntct_trtry,
        cntct_tarea,
        cntct_dzone,
        cntct_cntry,
        cntct_cntad,
        cntct_crncy,
        cntct_dspct,
        cntct_crlmt,
        user_s,
        id,
      ],
      label: `update contact- ${user_c}`,
    });

    scripts.push({
      sql: `UPDATE tmtb_party
    SET party_cname = $1,
    party_upusr = $2,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE party_vndor = $3`,
      params: [cntct_cname, user_s, id],
      label: `update party accounts- ${user_c}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${cntct_cname} - Updated successfully.`,
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
    const { id, cntct_cname, dzone_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !cntct_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntct
    SET cntct_actve = NOT cntct_actve,
    cntct_upusr = $1,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete contact- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cname} - ${dzone_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-address
router.post("/get-address", async (req, res) => {
  try {
    const { cntad_cntct, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!cntad_cntct || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT tad.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmcb_cntad tad
    LEFT JOIN tmhb_emply csr ON tad.cntad_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON tad.cntad_upusr = usr.id
    WHERE tad.cntad_users = $1
    AND tad.cntad_cntct = $2
    ORDER BY tad.cntad_ofadr ASC`;

    const params = [user_c, cntad_cntct];
    const rows = await dbGetAll(sql, params, `get address- ${user_c}`);
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

router.post("/upsert-address", async (req, res) => {
  try {
    const {
      id,
      cntad_cntct,
      cntad_ttype,
      cntad_cntps,
      cntad_cntno,
      cntad_email,
      cntad_ofadr,
      cntad_notes,
      cntad_gmaps,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (id) {
      // Validate input
      if (
        !cntad_cntct ||
        !cntad_ttype ||
        !cntad_cntps ||
        !cntad_cntno ||
        !cntad_ofadr ||
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

      const sql = `UPDATE tmcb_cntad
      SET cntad_ttype = $1,
      cntad_cntps = $2,
      cntad_cntno = $3,
      cntad_email = $4,
      cntad_ofadr = $5,
      cntad_notes = $6,
      cntad_gmaps = $7,
      cntad_upusr = $8,
      cntad_updat = CURRENT_TIMESTAMP,
      cntad_rvnmr = cntad_rvnmr + 1
      WHERE id = $9`;
      const params = [
        cntad_ttype,
        cntad_cntps,
        cntad_cntno,
        cntad_email,
        cntad_ofadr,
        cntad_notes,
        cntad_gmaps,
        user_s,
        id,
      ];

      await dbRun(sql, params, `update address- ${user_c}`);
      res.json({
        success: true,
        message: `${cntad_ofadr} - Updated successfully.`,
        data: {},
      });
    } else {
      // Validate input
      if (
        !cntad_cntct ||
        !cntad_ttype ||
        !cntad_cntps ||
        !cntad_cntno ||
        !cntad_ofadr ||
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
      const newCode = await GenNewCode(user_c, "tmcb_cntad");
      const sql = `INSERT INTO tmcb_cntad(id, cntad_users, cntad_bsins, cntad_ccode, cntad_cntct, cntad_ttype,
      cntad_cntps, cntad_cntno, cntad_email, cntad_ofadr, cntad_notes, cntad_gmaps, 
      cntad_crusr, cntad_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14)`;
      const params = [
        uuidv4(),
        user_c,
        user_b,
        newCode,
        cntad_cntct,
        cntad_ttype,
        cntad_cntps,
        cntad_cntno,
        cntad_email,
        cntad_ofadr,
        cntad_notes,
        cntad_gmaps,
        user_s,
        user_s,
      ];

      await dbRun(sql, params, `create address- ${user_c}`);
      res.json({
        success: true,
        message: `${cntad_ofadr} - Created successfully.`,
        data: {},
      });
    }
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

// delete-address
router.post("/delete-address", async (req, res) => {
  try {
    const { id, cntad_ofadr, cntad_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !cntad_ofadr || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntad
    SET cntad_actve = NOT cntad_actve,
    cntad_upusr = $1,
    cntad_updat = CURRENT_TIMESTAMP,
    cntad_rvnmr = cntad_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete contact address- ${user_c}`);
    res.json({
      success: true,
      message: `${cntad_ofadr} - ${cntad_actve ? "Deactivate" : "Activate"} successfully.`,
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

//get-avail-contact-accounts
router.post("/get-avail-contact-accounts", async (req, res) => {
  try {
    const { cntct_ctype, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cnt.*
    FROM tmcb_cntct cnt
    LEFT JOIN tmtb_party prt ON cnt.id = prt.party_vndor
    WHERE prt.party_vndor IS NULL
    AND cnt.cntct_users = $1
    AND cnt.cntct_ctype = $2
    ORDER BY cnt.cntct_ccode`;

    const params = [user_c, cntct_ctype];
    const rows = await dbGetAll(
      sql,
      params,
      `get get-avail-contact-accounts- ${user_c}`,
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

// get-suppliers
router.post("/get-suppliers", async (req, res) => {
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
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_ctype IN ('Supplier')
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cname`;

    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get contact suppliers- ${user_c}`,
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

// get-suppliers-mrr
router.post("/get-suppliers-mrr", async (req, res) => {
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
    const sql = `SELECT cnt.*, pty.id party_id, pty.party_chtac chtac_id, pty.party_crbal
    FROM tmcb_cntct cnt
    JOIN tmtb_party pty ON cnt.id = pty.party_vndor
    JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
    JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_actve = TRUE
	  AND crt.chtrt_trnid = 'SYS_MRR'
	  AND crt.chtrt_pegid = 'SYS_MRR_DIRECT'
    AND crt.chtrt_grpid ='SYS_LIB_SUPPLIER'
    AND pty.party_actve = TRUE
    AND cht.chtac_actve = TRUE
    AND crt.chtrt_actve = TRUE
    ORDER BY cnt.cntct_cname`;
    //AND cnt.cntct_ctype IN ('Supplier')
    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get contact suppliers- ${user_c}`,
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

// get-customers-sales-invoice
router.post("/get-customers-sales-invoice", async (req, res) => {
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
    //10101110 :: Customer Receivable
    const sql = `SELECT cnt.*, pty.id party_id, pty.party_chtac chtac_id, pty.party_crbal
    FROM tmcb_cntct cnt
    JOIN tmtb_party pty ON cnt.id = pty.party_vndor
    JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
    JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_actve = TRUE
    AND crt.chtrt_trnid = 'SYS_SALES'
	  AND crt.chtrt_pegid = 'SYS_SALES_INVOICE'
    AND crt.chtrt_grpid ='SYS_AST_CUSTOMER'
    AND pty.party_actve = TRUE
    AND cht.chtac_actve = TRUE
    AND crt.chtrt_actve = TRUE
    ORDER BY cnt.cntct_cname`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact customer- ${user_c}`);
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

// get-avail-suppliers-item
router.post("/get-avail-suppliers-item", async (req, res) => {
  try {
    const { itmct_items, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!itmct_items || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    LEFT JOIN tmib_itmct itm ON cnt.id = itm.itmct_cntct AND itm.itmct_items = $1
    WHERE cnt.cntct_users = $2
    AND cnt.cntct_ctype IN ('Supplier')
    AND cnt.cntct_actve = TRUE
    AND itm.itmct_cntct IS NULL
    ORDER BY cnt.cntct_cname`;

    const params = [itmct_items, user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get contact suppliers- ${user_c}`,
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
