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
    const sql = `SELECT prty.*, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_party prty
    JOIN tmtb_chtac cht ON prty.party_chtac = cht.id
    LEFT JOIN tmhb_emply csr ON prty.party_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON prty.party_upusr = usr.id
    WHERE prty.party_users = $1
    ORDER BY prty.party_chtac ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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
    const sql = `SELECT prty.*, 0 as edit_stop
    FROM tmtb_party prty
    WHERE prty.party_users = $1
    AND prty.party_actve = TRUE
    ORDER BY prty.party_chtac ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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
      party_users,
      party_bsins,
      party_ccode,
      party_ptype,
      party_chtac,
      party_vndor,
      party_cname,
      party_opbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !party_ptype ||
      !party_chtac ||
      //!party_vndor ||
      !party_cname ||
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
    const masterId = uuidv4();
    const scripts = [];
    const newCode = await GenNewCode(user_c, "tmtb_party");
    scripts.push({
      sql: `INSERT INTO tmtb_party(id, party_users, party_bsins, party_ccode, party_ptype, party_chtac,
      party_vndor, party_cname, party_opbal, party_crusr, party_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
      params: [
        masterId,
        user_c,
        user_b,
        newCode,
        party_ptype,
        party_chtac,
        party_vndor || "-",
        party_cname,
        party_opbal,
        user_s,
        user_s,
      ],
      label: `create party accounts- ${user_c}`,
    });

    //console.log("params", params);

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${newCode} - Created successfully.`,
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
      party_users,
      party_bsins,
      party_ccode,
      party_ptype,
      party_chtac,
      party_vndor,
      party_cname,
      party_opbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !party_ptype ||
      !party_chtac ||
      !party_vndor ||
      !party_cname ||
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
    const sql = `UPDATE tmtb_party
    SET party_ptype = $1,
    party_vndor = $2,
    party_cname = $3,
    party_chtac = $4,
    party_opbal = $5,
    party_upusr = $6,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE id = $7`;
    const params = [
      party_ptype,
      party_vndor,
      party_cname,
      party_chtac,
      party_opbal,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update party accounts- ${user_c}`);
    res.json({
      success: true,
      message: `${party_cname} - Updated successfully.`,
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
    const { id, party_cname, party_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !party_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_party
    SET party_actve = NOT party_actve,
    party_upusr = $1,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete party accounts- ${user_c}`);
    res.json({
      success: true,
      message: `${party_cname} - ${party_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-by-coa
router.post("/get-by-coa", async (req, res) => {
  try {
    const { party_chtac, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!party_chtac || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT prty.*, cht.chtac_cname, cht.chtac_ctype, 0 as edit_stop
    FROM tmtb_party prty
    JOIN tmtb_chtac cht ON prty.party_chtac = cht.id
    WHERE prty.party_users = $1
    AND prty.party_actve = TRUE
    AND prty.party_chtac = $2
    ORDER BY prty.party_chtac ASC`;

    const params = [user_c, party_chtac];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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

// get-by-contacts
router.post("/get-by-contacts", async (req, res) => {
  try {
    const { party_vndor, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!party_vndor || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT prty.*,  cht.chtac_cname, cht.chtac_ctype, 0 as edit_stop
    FROM tmtb_party prty
    LEFT JOIN tmtb_chtac cht ON prty.party_chtac = cht.id
    WHERE prty.party_users = $1
    AND prty.party_actve = TRUE
    AND prty.party_vndor = $2
    ORDER BY prty.party_chtac ASC`;

    const params = [user_c, party_vndor];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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

// get-by-vendor
router.post("/get-by-vendor", async (req, res) => {
  try {
    const { party_vndor, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!party_vndor || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT prty.*, cht.chtac_cname, cht.chtac_ctype, 0 as edit_stop
    FROM tmtb_party prty
    LEFT JOIN tmtb_chtac cht ON prty.party_chtac = cht.id
    WHERE prty.party_users = $1
    AND prty.party_actve = TRUE
    AND prty.party_vndor = $2
    ORDER BY prty.party_chtac ASC`;

    const params = [user_c, party_vndor];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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

//create-ext
router.post("/create-ext", async (req, res) => {
  try {
    const { party_ptype, party_vndor, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!party_ptype || !party_vndor || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    //-----------------FIND VENDOR INFO-----------------
    let vendorId = "";
    let vendorName = "";
    if (["Customer", "Supplier"].includes(party_ptype)) {
      const sql_cntct = `SELECT id, cntct_cname
      FROM tmcb_cntct
      WHERE cntct_ccode = $1
      AND cntct_users = $2
      AND cntct_bsins = $3
      AND cntct_ctype = $4
      AND cntct_actve = TRUE`;
      const row_cntct = await dbGet(
        sql_cntct,
        [party_vndor, user_c, user_b, party_ptype],
        "",
      );
      //console.log("row_cntct", row_cntct);
      if (!row_cntct) {
        return res.json({
          success: false,
          message: "Contact is not found.",
          data: [],
        });
      } else {
        vendorId = row_cntct.id;
        vendorName = row_cntct.cntct_cname;
      }
    } else if (["FG", "RM", "PM", "WIP", "FOH", "SVC"].includes(party_ptype)) {
      const sql_cntct = `SELECT id, items_iname
      FROM tmib_items
      WHERE items_icode = $1
      AND items_users = $2
      AND items_bsins = $3
      AND items_itype = $4
      AND items_actve = TRUE`;
      const row_cntct = await dbGet(
        sql_cntct,
        [party_vndor, user_c, user_b, party_ptype],
        "",
      );
      //console.log("row_cntct", row_cntct);
      if (!row_cntct) {
        return res.json({
          success: false,
          message: "Product is not found.",
          data: [],
        });
      } else {
        vendorId = row_cntct.id;
        vendorName = row_cntct.items_iname;
      }
    } else {
      return res.json({
        success: false,
        message: "Vendor is not found.",
        data: [],
      });
    }
    //-----------------FIND VENDOR PARTY INFO-----------------
    const sql_party = "SELECT * FROM tmtb_party WHERE party_vndor = $1";
    const rows_party = await dbGetAll(sql_party, [vendorId], "");
    //console.log("rows_party", rows_party);
    if (rows_party.length > 0) {
      return res.json({
        success: false,
        message: "Party already exists.",
        data: [],
      });
    } else {
      //-----------------FIND VENDOR PARTY CONFGURE-----------------
      const sql_prtya = "SELECT * FROM tmtb_prtya WHERE prtya_sorce = $1";
      const rows_prtya = await dbGetAll(sql_prtya, [party_ptype], "");
      console.log("rows_prtya", rows_prtya);
      if (rows_prtya.length > 0) {
        for (const row of rows_prtya) {
          //-----------------FIND COA INFO-----------------
          const sql_chtac = "SELECT id FROM tmtb_chtac WHERE chtac_chtno = $1";
          const row_chtac = await dbGet(sql_chtac, [row.prtya_chtac], "");
          console.log("row_chtac", row_chtac);
          if (!row_chtac) {
            return res.json({
              success: false,
              message: "Chart of accounts is not found.",
              data: [],
            });
          }
          //-----------------CREATE VENDOR PARTY-----------------
          const newCode = await GenNewCode(user_c, "tmtb_party");
          const sql = `INSERT INTO tmtb_party(id, party_users, party_bsins, party_ccode, party_ptype, party_chtac,
      party_vndor, party_cname, party_opbal, party_crusr, party_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`;
          const params = [
            uuidv4(),
            user_c,
            user_b,
            newCode,
            party_ptype,
            row_chtac.id,
            vendorId,
            vendorName,
            0,
            user_s,
            user_s,
          ];
          await dbRun(sql, params, `create party accounts- ${user_c}`);
        }
      } else {
        return res.json({
          success: false,
          message: "Party configure is not found.",
          data: [],
        });
      }
    }
    return res.json({
      success: true,
      message: "Query executed successfully.",
      data: [],
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

//get-vendor-ext
router.post("/get-vendor-ext", async (req, res) => {
  try {
    const { party_ptype, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!party_ptype || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    if (["Customer", "Supplier"].includes(party_ptype)) {
      const sql_cntct = `SELECT cnt.cntct_ccode AS id, cnt.cntct_cname AS cname, pty.party_vndor
      FROM tmcb_cntct cnt
      LEFT JOIN tmtb_party pty ON cnt.id = pty.party_vndor
      WHERE pty.party_vndor IS NULL
      AND cnt.cntct_users = $1
      AND cnt.cntct_bsins = $2
      AND cnt.cntct_ctype = $3
      AND cnt.cntct_actve = TRUE`;
      const rows_cntct = await dbGetAll(sql_cntct, [user_c, user_b, party_ptype], "");
      //console.log("row_cntct", row_cntct);
      return res.json({
        success: true,
        message: "Query executed successfully.",
        data: rows_cntct,
      });
    } else if (["FG", "RM", "PM", "WIP", "FOH", "SVC"].includes(party_ptype)) {
      const sql_items = `SELECT itm.items_icode AS id, items_iname AS cname, pty.party_vndor
      FROM tmib_items itm
      LEFT JOIN tmtb_party pty ON itm.id = pty.party_vndor
      WHERE pty.party_vndor IS NULL
      AND itm.items_users = $1
      AND itm.items_bsins = $2
      AND itm.items_itype = $3
      AND itm.items_actve = TRUE`;
      const row_items = await dbGetAll(sql_items, [user_c, user_b, party_ptype], "");
      //console.log("row_cntct", row_cntct);
      return res.json({
        success: true,
        message: "Query executed successfully.",
        data: row_items,
      });
    } else {
      return res.json({
        success: false,
        message: "Vendor is not found.",
        data: [],
      });
    }
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
