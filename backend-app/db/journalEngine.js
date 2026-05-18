const {
  GenNewCode,
  GenNewTrn,
  getFiscalYearPeriod,
} = require("./genHelper");
const { v4: uuidv4 } = require("uuid");

const Journal_Master_Details = async (reqM, reqD) => {
  //database action
  //const newCode = await GenNewCode(user_c, "tmtb_mjrnl");
  const fsyacp = await getFiscalYearPeriod(
    reqM.user_c,
    reqM.user_b,
    reqM.mjrnl_dpart,
    reqM.mjrnl_trdat,
  );

  if (!fsyacp) {
    return {
      success: false,
      message: "No active fiscal year or accounting period found",
      data: {},
    };
  }
  if (fsyacp.length > 1) {
    return {
      success: false,
      message: "Multiple active accounting periods found. Please select one.",
      data: {},
    };
  }
  const { fsyar_id, acprd_id } = fsyacp[0];
  const newTrn = await GenNewTrn(
    reqM.user_c,
    reqM.user_b,
    "tmtb_mjrnl",
    reqM.mjrnl_trtyp,
    reqM.mjrnl_dpart,
  );
  //build scripts
  const masterId = uuidv4();
  const scripts = [];

  scripts.push({
    sql: `INSERT INTO tmtb_mjrnl(id, mjrnl_apusr, mjrnl_bsins, mjrnl_dpart, mjrnl_crncy, mjrnl_fsyar,
    mjrnl_acprd, mjrnl_trtyp, mjrnl_trnno, mjrnl_trdat, mjrnl_refno, mjrnl_narrt,
    mjrnl_drval, mjrnl_crval, mjrnl_stats, mjrnl_appid, mjrnl_apdat, mjrnl_crusr, mjrnl_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17, $18, $19)`,
    params: [
      masterId,
      reqM.user_c,
      reqM.user_b,
      reqM.mjrnl_dpart,
      reqM.mjrnl_crncy,
      fsyar_id,
      acprd_id,
      reqM.mjrnl_trtyp,
      newTrn,
      reqM.mjrnl_trdat,
      reqM.mjrnl_refno,
      reqM.mjrnl_narrt,
      reqM.mjrnl_drval,
      reqM.mjrnl_crval,
      "posted",
      "auto",
      new Date(),
      reqM.user_s,
      reqM.user_s,
    ],
    label: `create journal- ${reqM.user_c}`,
  });

  for (const det of reqD) {
    scripts.push({
      sql: `INSERT INTO tmtb_djrnl(id, djrnl_apusr, djrnl_bsins, djrnl_dpart, djrnl_mjrnl, djrnl_chtac,
        djrnl_party, djrnl_drval, djrnl_crval, djrnl_descr, djrnl_rftyp, djrnl_refid,
        djrnl_lneno, djrnl_crusr, djrnl_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15)`,
      params: [
        uuidv4(),
        reqM.user_c,
        reqM.user_b,
        reqM.mjrnl_dpart,
        masterId,
        det.djrnl_chtac,
        det.djrnl_party,
        det.djrnl_drval,
        det.djrnl_crval,
        det.djrnl_descr || "",
        det.djrnl_rftyp || "",
        det.djrnl_refid || "",
        det.djrnl_lneno,
        reqM.user_s,
        reqM.user_s,
      ],
      label: `Created jouranl detail ${newTrn}`,
    });

    return {
      success: true,
      message: `${newTrn} - Created successfully.`,
      data: { scripts },
    };
  }
};

module.exports = { Journal_Master_Details };
