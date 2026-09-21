const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

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
    const sql = `SELECT emp.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmhb_emply emp
    LEFT JOIN tmhb_emply csr ON emp.emply_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON emp.emply_upusr = usr.id
    WHERE emp.emply_users = $1
    ORDER BY emp.emply_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Employee- ${user_c}`);
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
    const sql = `SELECT emp.*, 0 as edit_stop
    FROM tmhb_emply emp
    WHERE emp.emply_users = $1
    AND emp.emply_actve = TRUE
    ORDER BY emp.emply_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Employee- ${user_c}`);
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
      emply_users,
      emply_bsins,
      emply_ccode,
      emply_cname,
      emply_cntno,
      emply_email,
      emply_pswrd,
      emply_recky,
      emply_ltokn,
      emply_islgn,
      emply_isprm,
      emply_urole,
      emply_crdno,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !emply_cname ||
      !emply_cntno ||
      !emply_email ||
      !emply_urole ||
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
    // Assets / Field Force > will create manually
    const sql_chtac = `SELECT cht.id AS chtac_id
    FROM tmtb_chtac cht
    JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
    WHERE cht.chtac_users = $1
    AND cht.chtac_bsins = $2
    AND crt.chtrt_trnid = 'SYS_SUB_LEDGER_PARTY'
    AND crt.chtrt_pegid = 'SYS_EMPLOYEE_CREATE'
    AND crt.chtrt_grpid = 'SYS_PARTY_SINGLE'
    AND crt.chtrt_route = 'SYS_EMPTY'`;
    const row_chtac = await dbGetAll(
      sql_chtac,
      [user_c, user_b],
      `get account coa employee`,
    );

    if (row_chtac.length === 0) {
      return res.json({
        success: false,
        message: `No account party setup for employee`,
        data: {},
      });
    }

    if (row_chtac.length !== 2) {
      return res.json({
        success: false,
        message: `Set only 2 party route (SYS_EMPTY) for employee `,
        data: {},
      });
    }

    const masterId = uuidv4();
    const scripts = [];
    const newCode = await GenNewCode(user_c, "tmhb_emply");
    scripts.push({
      sql: `INSERT INTO tmhb_emply(id, emply_users, emply_bsins, emply_ccode, emply_cname, emply_cntno,
                              emply_email, emply_pswrd, emply_recky, emply_ltokn, emply_islgn, emply_isprm,
                              emply_urole, emply_crdno, emply_crusr, emply_upusr)
                  VALUES ($1, $2, $3, $4, $5, $6,
                          $7, $8, $9, $10, $11, $12,
                          $13, $14, $15, $16)`,
      params: [
        masterId,
        user_c,
        user_b,
        emply_ccode || newCode,
        emply_cname,
        emply_cntno,
        emply_email,
        emply_ccode || newCode,
        emply_ccode || newCode,
        emply_ccode || newCode,
        emply_islgn || false,
        emply_isprm || false,
        emply_urole || "EMPLOYEE", //USER will access the login panel
        emply_crdno,
        user_s,
        user_s,
      ],
      label: `create Employee- ${emply_cname}`,
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
          "Employee",
          row.chtac_id,
          masterId,
          emply_cname,
          0,
          user_s,
          user_s,
        ],
        label: `create party accounts- ${emply_cname}`,
      });
    }

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${emply_cname} - Created successfully.`,
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
      emply_users,
      emply_bsins,
      emply_ccode,
      emply_cname,
      emply_cntno,
      emply_email,
      emply_pswrd,
      emply_recky,
      emply_ltokn,
      emply_islgn,
      emply_isprm,
      emply_urole,
      emply_crdno,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !emply_cname ||
      !emply_cntno ||
      !emply_email ||
      !emply_urole ||
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
    scripts.push({
      sql: `UPDATE tmhb_emply
    SET emply_ccode = $1,
    emply_cname = $2,
    emply_cntno = $3,
    emply_email = $4,    
    emply_upusr = $5,
    emply_updat = CURRENT_TIMESTAMP,
    emply_rvnmr = emply_rvnmr + 1
    WHERE id = $6`,
      params: [emply_ccode, emply_cname, emply_cntno, emply_email, user_s, id],
      label: `update Employee- ${emply_cname}`,
    });

    scripts.push({
      sql: `UPDATE tmtb_party
    SET party_cname = $1,
    party_upusr = $2,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE party_vndor = $3`,
      params: [emply_cname, user_s, id],
      label: `update party accounts- ${user_c}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${emply_cname} - Updated successfully.`,
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
    const { id, emply_cname, emply_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !emply_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmhb_emply
    SET emply_actve = NOT emply_actve,
    emply_upusr = $1,
    emply_updat = CURRENT_TIMESTAMP,
    emply_rvnmr = emply_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Employee- ${user_c}`);
    res.json({
      success: true,
      message: `${emply_cname} - ${emply_actve ? "Deactivate" : "Activate"} successfully.`,
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

// create-ff
router.post("/create-ff", async (req, res) => {
  try {
    const { id, emply_cname, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !emply_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql_exists = `SELECT pty.*
    FROM tmtb_party pty
    JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
    JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
    WHERE cht.chtac_users = $1
    AND cht.chtac_bsins = $2
    AND pty.party_vndor = $3
    AND crt.chtrt_trnid = 'SYS_SUB_LEDGER_PARTY'
    AND crt.chtrt_pegid = 'SYS_EMPLOYEE_CREATE'
    AND crt.chtrt_grpid = 'SYS_PARTY_SINGLE'
    AND crt.chtrt_route = 'Field Force'`;
    const row_exists = await dbGetAll(
      sql_exists,
      [user_c, user_b, id],
      `get account coa employee`,
    );
    if (row_exists.length > 0) {
      return res.json({
        success: false,
        message: `Field Force ID exists for employee ${emply_cname}`,
        data: {},
      });
    }

    const sql_chtac = `SELECT cht.id AS chtac_id
    FROM tmtb_chtac cht
    JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
    WHERE cht.chtac_users = $1
    AND cht.chtac_bsins = $2
    AND crt.chtrt_trnid = 'SYS_SUB_LEDGER_PARTY'
    AND crt.chtrt_pegid = 'SYS_EMPLOYEE_CREATE'
    AND crt.chtrt_grpid = 'SYS_PARTY_SINGLE'
    AND crt.chtrt_route = 'Field Force'`;
    const row_chtac = await dbGetAll(
      sql_chtac,
      [user_c, user_b],
      `get account coa employee`,
    );

    if (row_chtac.length === 0) {
      return res.json({
        success: false,
        message: `No Field Force ID account party setup for employee`,
        data: {},
      });
    }

    if (row_chtac.length !== 1) {
      return res.json({
        success: false,
        message: `Set only 1 party route (Field Force) for employee `,
        data: {},
      });
    }

    const newCodeParty = await GenNewCode(user_c, "tmtb_party");
    const sql = `INSERT INTO tmtb_party(id, party_users, party_bsins, party_ccode, party_ptype, party_chtac,
      party_vndor, party_cname, party_opbal, party_crusr, party_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCodeParty,
      "Employee",
      row_chtac[0].chtac_id,
      id,
      emply_cname,
      0,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create Employee FF - ${emply_cname}`);
    res.json({
      success: true,
      message: `${emply_cname} - Created successfully.`,
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


// get-ff
router.post("/get-ff", async (req, res) => {
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
    const sql = `SELECT emp.*
    FROM tmhb_emply emp
    WHERE emp.emply_users = $1
    AND emp.emply_actve = TRUE
    ORDER BY emp.emply_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get FF Employee- ${user_c}`);
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
