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

module.exports = { GenNewCode };