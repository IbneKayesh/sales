const { dbGet, dbGetAll } = require("./sqlManagerpg");

const GenNewCode = async (user_c, tableName) => {
  // get prefix + length config
  const sql = `SELECT ccode_prfix, ccode_prlen
        FROM tmsb_ccode
        WHERE ccode_users = $1
        AND ccode_cname = $2
        LIMIT 1`;
  const result = await dbGet(sql, [user_c, tableName]);
  if (!result) throw new Error("Code generation config is not found");

  const prefix = result.ccode_prfix || "ERR"; // fallback
  const length = result.ccode_prlen || 8;

  const regColumn = tableName.split("_")[1];
  // get count from table by main registered user
  const countSql = `SELECT COUNT(id) AS total FROM ${tableName} WHERE ${regColumn}_apusr = $1 GROUP BY ${regColumn}_apusr`;
  //console.log("countSql,"countSql)
  const countResult = await dbGet(countSql, [user_c]);
  const count = Number(countResult?.total || 0) + 1;

  // pad sequence
  const seq = String(count).padStart(length, "0");

  // final code
  return `${prefix}${seq}`;
};

const GenNewTrn = async (user_c, user_b, tableName, trnName, dpart_id) => {
  // Current month/year
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const datePart = `${month}${year}`;
  const regColumn = tableName.split("_")[1];

  // Prefix from transaction name
  const prefix = getInitials(trnName);

  // Count this month's transactions
  const sql = `
    SELECT COUNT(*)::int AS total
    FROM ${tableName} jrn
    WHERE jrn.${regColumn}_apusr = $1
      AND jrn.${regColumn}_bsins = $2
      AND jrn.${regColumn}_dpart = $3
      AND EXTRACT(MONTH FROM jrn.${regColumn}_trdat) = $4
      AND EXTRACT(YEAR FROM jrn.${regColumn}_trdat) = $5
  `;

  const result = await dbGet(sql, [
    user_c,
    user_b,
    dpart_id,
    Number(month),
    Number(`20${year}`),
  ]);

  // Next sequence
  const nextNo = (result?.total || 0) + 1;

  // Left padding
  const seq = String(nextNo).padStart(6, "0");

  // Final transaction no
  return `${prefix}-${datePart}-${seq}`;
};

// Get initials
const getInitials = (text = "") => {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const getFiscalYearPeriod = async (user_c, user_b, dept_id, trnDate) => {
  const sql = `
    SELECT
      fsy.id AS fsyar_id,
      acp.id AS acprd_id
    FROM tmtb_fsyar fsy
    JOIN tmtb_acprd acp
      ON fsy.id = acp.acprd_fsyar
      AND fsy.fsyar_apusr = acp.acprd_apusr
      AND fsy.fsyar_bsins = acp.acprd_bsins
      AND fsy.fsyar_dpart = acp.acprd_dpart
    WHERE fsy.fsyar_apusr = $1
      AND fsy.fsyar_bsins = $2
      AND fsy.fsyar_dpart = $3
      AND $4 BETWEEN fsy.fsyar_stdat AND fsy.fsyar_endat
      AND $4 BETWEEN acp.acprd_stdat AND acp.acprd_endat
      AND fsy.fsyar_stats = 'open'
      AND fsy.fsyar_iscur = TRUE
      AND fsy.fsyar_actve = TRUE
      AND acp.acprd_stats = 'open'
      AND acp.acprd_iscur = TRUE
      AND acp.acprd_actve = TRUE
  `;

  //console.log(user_c, user_b, dept_id);

  const result = await dbGetAll(sql, [user_c, user_b, dept_id, trnDate]);

  //console.log(result);

  if (!result || result.length === 0) {
    throw new Error(
      `No active fiscal year or accounting period found for transaction date ${trnDate}`,
    );
  }

  return result;
};

const getFiscalYearPeriod_v2 = async (user_c, user_b, dept_id, trnDate) => {
  const sql = `
    SELECT 
      fsy.id AS fsyar_id,
      acp.id AS acprd_id
    FROM tmtb_fsyar fsy
    JOIN tmtb_acprd acp 
      ON fsy.id = acp.acprd_fsyar
      AND fsy.fsyar_apusr = acp.acprd_apusr
      AND fsy.fsyar_bsins = acp.acprd_bsins
      AND fsy.fsyar_dpart = acp.acprd_dpart
    WHERE fsy.fsyar_apusr = $1
      AND fsy.fsyar_bsins = $2
      AND fsy.fsyar_dpart = $3
      AND $4::date BETWEEN fsy.fsyar_stdat::date 
                      AND fsy.fsyar_endat::date
      AND fsy.fsyar_stats = 'open'
      AND fsy.fsyar_iscur = TRUE
      AND fsy.fsyar_actve = TRUE
      AND $4::date BETWEEN acp.acprd_stdat::date 
                      AND acp.acprd_endat::date
      AND acp.acprd_stats = 'open'
      AND acp.acprd_iscur = TRUE
      AND acp.acprd_actve = TRUE
    LIMIT 1
  `;

  const result = await dbGet(sql, [user_c, user_b, dept_id, trnDate]);

  // If no fiscal year or period found
  if (!result || result.length === 0) {
    throw new Error(
      `No active fiscal year or accounting period found for transaction date ${trnDate}`,
    );
  }

  return result[0];
};

const getFiscalYearPeriod_v1 = async (user_c, user_b, dept_id, trnDate) => {
  const sql = `select fsy.id AS fsyar_id, acp.id AS acprd_id
from tmtb_fsyar fsy
JOIN tmtb_acprd acp ON fsy.id = acp.acprd_fsyar
	AND fsy.fsyar_apusr = acp.acprd_apusr
	AND fsy.fsyar_bsins = acp.acprd_bsins
	AND fsy.fsyar_dpart = acp.acprd_dpart
WHERE fsy.fsyar_apusr = $1
	AND fsy.fsyar_bsins = $2
	AND fsy.fsyar_dpart = $3
	AND fsy.fsyar_stdat = '2026-01-01 00:00:00'
	AND fsy.fsyar_endat = '2026-12-31 00:00:00'
	AND fsy.fsyar_stats = 'open'
	AND fsy.fsyar_iscur = TRUE
	AND fsy.fsyar_actve = TRUE
	AND acp.acprd_stdat = '2026-05-01 00:00:00'
	AND acp.acprd_endat = '2026-05-31 00:00:00'
	AND acp.acprd_stats = 'open'
	AND acp.acprd_iscur = TRUE
	AND acp.acprd_actve = TRUE`;

  const result = await dbGet(sql, [
    user_c,
    user_b,
    dept_id,
    trnDate,
    trnDate,
    trnDate,
    trnDate,
  ]);

  return result;
};

const getDefaultCOAforPartyId = async (user_c, user_b, src_id) => {
  const sql = `
    SELECT rcg.parcg_chtac
    FROM tmtb_parcg rcg
    WHERE rcg.parcg_apusr = $1
    AND rcg.parcg_bsins = $2
    AND rcg.parcg_sorce = $3
    AND rcg.parcg_actve = TRUE`;

  //console.log(user_c, user_b, dept_id);

  const result = await dbGet(sql, [user_c, user_b, src_id]);

  //console.log(result);
  if (!result || result.length === 0) {
    throw new Error(
      `No default chart of accounts configured for this ${src_id}`,
    );
  }

  return result.parcg_chtac;
};

module.exports = {
  GenNewCode,
  GenNewTrn,
  getFiscalYearPeriod,
  getDefaultCOAforPartyId,
};
