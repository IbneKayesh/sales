const { dbGet } = require("./sqlManagerpg");

const GenNewCode = async (user_c, tableName) => {
  // get prefix + length config
  const sql = `SELECT tcode_prfix, tcode_prlen
        FROM tmab_tcode
        WHERE tcode_apusr = $1
        AND tcode_tname = $2
        LIMIT 1`;
  const result = await dbGet(sql, [user_c, tableName]);
  if (!result) throw new Error("Code generation config is not found");

  const prefix = result.tcode_prfix || "ERR"; // fallback
  const length = result.tcode_prlen || 8;

  // get count from table
  const countSql = `SELECT COUNT(id) AS total FROM ${tableName}`;
  const countResult = await dbGet(countSql, []);
  const count = Number(countResult.total) + 1;

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

  // Prefix from transaction name
  const prefix = getInitials(trnName);

  // Count this month's transactions
  const sql = `
    SELECT COUNT(*)::int AS total
    FROM ${tableName} jrn
    WHERE jrn.mjrnl_apusr = $1
      AND jrn.mjrnl_bsins = $2
      AND jrn.mjrnl_dpart = $3
      AND EXTRACT(MONTH FROM jrn.mjrnl_trdat) = $4
      AND EXTRACT(YEAR FROM jrn.mjrnl_trdat) = $5
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

module.exports = { GenNewCode, GenNewTrn };
