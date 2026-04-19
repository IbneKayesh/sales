const { dbGetAll } = require("../../db/sqlManagerpg");

const get = async (inputs) => {
  const data = {};
  for (const input of inputs) {
    if (input.attrb) {
      const sql = `SELECT * FROM tmib_attrb WHERE attrb_actve = $1`;
      const params = [input.attrb.p1 || "true"];
      data.attrb = await dbGetAll(sql, params, "Get attrb");
    } else if (input.brand) {
      const sql = `SELECT * FROM tmib_brand WHERE brand_actve = $1`;
      const params = [input.brand.p1 || "true"];
      data.brand = await dbGetAll(sql, params, "Get brand");
    } else {
      const key = Object.keys(input)[1];
      data[key] = null;
    }
  }
  return data;
};

const set = async (inputs) => {
  // Implementation for set logic would go here
  return inputs; // Mock return
};

const del = async (inputs) => {
  // Implementation for delete logic would go here
  return inputs; // Mock return
};

module.exports = {
  get,
  set,
  del,
};
