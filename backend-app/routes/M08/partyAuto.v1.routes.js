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
    const sql = `SELECT ptya.*, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno, cht.chtac_ntype,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_prtya ptya
    JOIN tmtb_chtac cht ON ptya.prtya_chtac = cht.chtac_chtno::text
    LEFT JOIN tmhb_emply csr ON ptya.prtya_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON ptya.prtya_upusr = usr.id
    WHERE ptya.prtya_users = $1
    ORDER BY ptya.prtya_sorce ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party auto- ${user_c}`);
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
    let contactDefaultCOA = "";

    if (cntct_ctype === "Customer") {
      contactDefaultCOA = await getDefaultCOAforPartyId(
        user_c,
        user_b,
        "SYS_PARTY_COA_CNF_CUSTOMER",
      );
    }
    if (cntct_ctype === "Supplier") {
      contactDefaultCOA = await getDefaultCOAforPartyId(
        user_c,
        user_b,
        "SYS_PARTY_COA_CNF_SUPPLIER",
      );
    }

    const masterId = uuidv4();
    const scripts = [];
    const newCode = await GenNewCode(user_c, "tmcb_cntct");
    scripts.push({
      sql: `INSERT INTO tmcb_cntct(id, cntct_users, cntct_bsins, cntct_ctype, cntct_sorce, cntct_ccode,
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
        cntct_ctype,
        cntct_sorce,
        newCode,
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

module.exports = router;
