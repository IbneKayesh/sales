const express = require("express");
const router = express.Router();
const { dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// =====================
// Get All
// =====================
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT emp.id, emp.emply_ccode, emp.emply_cname, emp.emply_cntno, emp.emply_email, emp.emply_islgn,
      emp.emply_isprm, emp.emply_urole, emp.emply_actve, csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 AS edit_stop
      FROM tmhb_emply emp
      LEFT JOIN tmhb_emply csr ON emp.emply_crusr = csr.id
      LEFT JOIN tmhb_emply usr ON emp.emply_upusr = usr.id
      WHERE emp.emply_users = $1
      AND emp.emply_bsins = $2
      ORDER BY emp.emply_cname`;

    const rows = await dbGetAll(sql, [user_c, user_b], `Get users - ${user_c}`);

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// Update
// =====================
const update = async (req, res) => {
  try {
    const {
      id,
      emply_users,
      emply_bsins,
      emply_ccode,
      emply_cname,
      emply_pswrd,
      emply_islgn,
      emply_urole,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (!id || !emply_cname || !emply_pswrd || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmhb_emply
      SET
        emply_pswrd = $1,
        emply_islgn = $2,
        emply_urole = $3,
        emply_upusr = $4,
        emply_updat = CURRENT_TIMESTAMP,
        emply_rvnmr = emply_rvnmr + 1
      WHERE id = $5
      AND emply_isprm = false`;

    const params = [emply_pswrd, emply_islgn, emply_urole, user_s, id];

    await dbRun(sql, params, `Update users - ${user_c}`);

    res.json({
      success: true,
      message: `${emply_cname} - Updated successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// =====================
// Update
// =====================
router.post("/update", update);

// =====================
// Activate / Deactivate
// =====================
router.post("/delete", async (req, res) => {
  try {
    const { id, emply_cname, emply_islgn, user_s, user_c, user_b } = req.body;

    if (!id || !emply_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmhb_emply
      SET
        emply_islgn = NOT emply_islgn,
        emply_upusr = $1,
        emply_updat = CURRENT_TIMESTAMP,
        emply_rvnmr = emply_rvnmr + 1
      WHERE id = $2
      AND emply_isprm = false`;

    await dbRun(sql, [user_s, id], `Delete Product - ${user_c}`);

    res.json({
      success: true,
      message: `${emply_cname} - ${
        emply_islgn ? "Deactivate" : "Activate"
      } successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

// =====================
// get menus user
// =====================
router.post("/get-menus-user", async (req, res) => {
  try {
    const { menup_emply, user_s, user_c, user_b } = req.body;

    if (!menup_emply || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT mnu.*
      FROM tmsb_menup mnu
      LEFT JOIN tmhb_emply csr ON mnu.menup_crusr = csr.id
      LEFT JOIN tmhb_emply usr ON mnu.menup_upusr = usr.id
      WHERE mnu.menup_users = $1
      AND mnu.menup_emply = $2
      ORDER BY mnu.menup_menus`;

    const rows = await dbGetAll(
      sql,
      [user_c, menup_emply],
      `Get menus - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// update menus user
// =====================
router.post("/update-menus-user", async (req, res) => {
  try {
    const { menup_emply, menup_menus, user_s, user_c, user_b } = req.body;

    // Validate input
    if (
      !menup_emply ||
      !Array.isArray(menup_menus) ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    /*
     * Get existing menu permissions for this employee.
     */
    const sql = `SELECT *
      FROM tmsb_menup mnu
      WHERE mnu.menup_users = $1
      AND mnu.menup_emply = $2`;
    const rows = await dbGetAll(
      sql,
      [user_c, menup_emply],
      `Get menus - ${user_c}`,
    );

    /*
     * Convert existing records into a Map.
     * Key = menu ID
     */
    const existingMenus = new Map(rows.map((row) => [row.menup_menus, row]));

    /*
     * Keep track of menus received from frontend.
     * Anything existing in DB but NOT in this Set
     * will be deleted.
     */
    const receivedMenus = new Set();

    /*
     * Build SQL scripts.
     */
    const scripts = [];

    for (const det of menup_menus) {
      const menuId = det.menup_menus;

      if (!menuId) {
        continue;
      }

      receivedMenus.add(menuId);

      const extpr = Boolean(det.menup_extpr);
      const addpr = Boolean(det.menup_addpr);
      const edtpr = Boolean(det.menup_edtpr);
      const delpr = Boolean(det.menup_delpr);
      const actve = det.menup_actve !== false;

      /*
       * If all permissions are false,
       * remove the menu permission completely.
       */
      const noPermission = !extpr && !addpr && !edtpr && !delpr;
      const existing = existingMenus.get(menuId);
      if (noPermission) {
        if (existing) {
          scripts.push({
            sql: `DELETE FROM tmsb_menup WHERE id = $1`,
            params: [existing.id],
          });
        }
        continue;
      }

      /*
       * Existing menu -> UPDATE
       */
      if (existing) {
        scripts.push({
          sql: `UPDATE tmsb_menup
            SET
              menup_extpr = $1,
              menup_addpr = $2,
              menup_edtpr = $3,
              menup_delpr = $4,
              menup_actve = $5,
              menup_upusr = $6,
              menup_updat = CURRENT_TIMESTAMP,
              menup_rvnmr = menup_rvnmr + 1
            WHERE id = $7`,
          params: [extpr, addpr, edtpr, delpr, actve, user_s, existing.id],
        });
      } else {
        /*
         * New menu -> INSERT
         */
        scripts.push({
          sql: `INSERT INTO tmsb_menup (id, menup_users, menup_emply, menup_menus, menup_extpr, menup_addpr,
                              menup_edtpr, menup_delpr, menup_crusr, menup_upusr)
                        VALUES ($1, $2, $3, $4, $5, $6,
                                $7, $8, $9, $10)`,
          params: [
            uuidv4(),
            user_c,
            menup_emply,
            menuId,
            extpr,
            addpr,
            edtpr,
            delpr,
            user_s,
            user_s,
          ],
        });
      }
    }

    /*
     * Delete existing menus which were removed
     * from the frontend selection.
     */
    for (const existing of rows) {
      if (!receivedMenus.has(existing.menup_menus)) {
        scripts.push({
          sql: `DELETE FROM tmsb_menup WHERE id = $1`,
          params: [existing.id],
        });
      }
    }

    /*
     * Execute scripts.
     *
     * IMPORTANT:
     * Ideally this should be done inside a DB transaction.
     */
    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `Permissions created successfully`,
      data: {},
    });
  } catch (error) {
    console.error(error);

    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

module.exports = router;
