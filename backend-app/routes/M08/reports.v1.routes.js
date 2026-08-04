const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get-journal-data
router.post("/get-journal-data", async (req, res) => {
  try {
    const { user_s, user_c, user_b, user_d, fsyar, acprd } = req.body;

    // Validate input
    if (!user_c || !user_b || !user_d || !fsyar || !acprd) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT jnm.jrnlm_crncy, jnm.jrnlm_trtyp, jnm.jrnlm_trdat, jnm.jrnlm_refno, jnm.jrnlm_narrt, jnm.jrnlm_drval,
        jnm.jrnlm_crval, jnc.jrnlc_drval, jnc.jrnlc_crval, jnc.jrnlc_descr, jnc.jrnlc_sorce,
        jnc.jrnlc_chtac, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno,
        jnc.jrnlc_party, pty.party_ptype, pty.party_cname
        FROM tmtb_jrnlm jnm
        JOIN tmtb_jrnlc jnc ON jnm.id = jnc.jrnlc_jrnlm
        JOIN tmtb_chtac cht ON jnc.jrnlc_chtac = cht.id
        JOIN tmtb_party pty ON jnc.jrnlc_party = pty.id
        WHERE jnm.jrnlm_users = $1
        AND jnm.jrnlm_bsins = $2
        AND jnm.jrnlm_dpart = $3
        AND jnm.jrnlm_fsyar = $4
        AND jnm.jrnlm_acprd = $5
    ORDER BY jnm.jrnlm_trdat ASC`;

    const params = [user_c, user_b, user_d, fsyar, acprd];
    const rows = await dbGetAll(sql, params, `get journal data- ${user_c}`);
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
