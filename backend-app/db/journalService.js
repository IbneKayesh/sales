const { v4: uuidv4 } = require("uuid");
const { dbRunAll, dbGet, dbGetAll } = require("./sqlManagerpg");
const { GenNewTrn, getCurrentPeriod, getCurrencyRate } = require("./genHelper");

/**
 * Creates journal master + detail INSERT scripts.
 * Returns { scripts, masterId, trnNo } — caller pushes more scripts and calls dbRunAll.
 *
 * @param {Object} opts
 * @param {string} opts.user_c      - business user
 * @param {string} opts.user_b      - business instance
 * @param {string} opts.user_s      - session user (for crusr/upusr)
 * @param {string} opts.dpart       - department ID
 * @param {string} opts.trtyp       - transaction type (e.g. "Purchase Invoice")
 * @param {Date|string} opts.trdat  - transaction date
 * @param {string} opts.refno       - reference number
 * @param {string} opts.narrt       - narrative / description
 * @param {number} opts.drval       - total debit (usually 0 initially)
 * @param {number} opts.crval       - total credit (usually 0 initially)
 * @param {Array}  opts.details     - array of { chtac, party, drval, crval, descr, sorce, refid, rtype? }
 */
async function buildJournalScripts({
  user_c,
  user_b,
  user_s,
  dpart,
  trtyp,
  trdat,
  refno,
  narrt,
  drval = 0,
  crval = 0,
  details = [],
}) {
  // 1. Fiscal year & period
  const acprd = await getCurrentPeriod(user_c, user_b, dpart);
  if (!acprd || acprd.length === 0) {
    throw new Error("No active fiscal year or accounting period found");
  }
  if (acprd.length > 1) {
    throw new Error(
      "Multiple active accounting periods found. Please active one.",
    );
  }
  const { acprd_id, fsyar_id } = acprd[0];

  // 2. Currency rate
  const crncy = await getCurrencyRate(user_c, user_b);
  if (!crncy) {
    throw new Error("No active currency rate found");
  }

  // 3. Journal Transaction number
  const masterId = uuidv4();
  const trnNo = await GenNewTrn(user_c, user_b, "tmtb_jrnlm", trtyp, dpart);

  // 4. Build scripts
  const scripts = [];

  // Master INSERT
  scripts.push({
    sql: `INSERT INTO tmtb_jrnlm(id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
      jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
      jrnlm_drval, jrnlm_crval, jrnlm_exrat, jrnlm_stats, jrnlm_crusr, jrnlm_upusr)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    params: [
      masterId,
      user_c,
      user_b,
      dpart,
      fsyar_id,
      acprd_id,
      crncy.crncy_tcrnc,
      trtyp,
      trnNo,
      trdat,
      refno,
      narrt,
      drval,
      crval,
      crncy.crncy_exrat,
      "Posted",
      user_s,
      user_s,
    ],
    label: `journal master - ${trnNo}`,
  });

  // Detail INSERTs
  let line = 1;
  for (const det of details) {
    scripts.push({
      sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        dpart,
        masterId,
        det.chtac,
        det.party,
        det.drval || 0,
        det.crval || 0,
        det.descr,
        det.sorce,
        det.refid,
        det.rtype || "MASTER",
        line++,
        user_s,
        user_s,
      ],
      label: `journal detail - ${det.descr}`,
    });
  }

  return { scripts, masterId, trnNo };
}

/**
 * High-level: build journal scripts AND execute them in one call.
 * Returns { masterId, trnNo }.
 */
// async function createJournalEntry(opts) {
//   const { scripts, masterId, trnNo } = await buildJournalScripts(opts);
//   await dbRunAll(scripts);
//   return { masterId, trnNo };
// }

// ─── CENTRALIZED JOURNAL QUERIES ───

/**
 * Get journal data for a specific fiscal year / accounting period.
 */
// async function getJournalData(user_c, user_b, user_d, fsyar, acprd) {
//   const sql = `SELECT jnm.jrnlm_crncy, jnm.jrnlm_trtyp, jnm.jrnlm_trdat, jnm.jrnlm_refno, jnm.jrnlm_narrt, jnm.jrnlm_drval,
//       jnm.jrnlm_crval, jnc.jrnlc_drval, jnc.jrnlc_crval, jnc.jrnlc_descr, jnc.jrnlc_sorce,
//       jnc.jrnlc_chtac, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno, cht.chtac_ntype,
//       jnc.jrnlc_party, pty.party_ptype, pty.party_cname
//       FROM tmtb_jrnlm jnm
//       JOIN tmtb_jrnlc jnc ON jnm.id = jnc.jrnlc_jrnlm
//       JOIN tmtb_chtac cht ON jnc.jrnlc_chtac = cht.id
//       JOIN tmtb_party pty ON jnc.jrnlc_party = pty.id
//       WHERE jnm.jrnlm_users = $1
//       AND jnm.jrnlm_bsins = $2
//       AND jnm.jrnlm_dpart = $3
//       AND jnm.jrnlm_fsyar = $4
//       AND jnm.jrnlm_acprd = $5
//       ORDER BY jnm.jrnlm_trdat ASC`;
//   return dbGetAll(sql, [user_c, user_b, user_d, fsyar, acprd], `get journal data- ${user_c}`);
// }

/**
 * Get ledger for a specific contact (joins through party → journal).
 */
// async function getContactsLedger(cntct_id, user_c) {
//   const sql = `SELECT cnt.cntct_ccode, cnt.cntct_ctype, cnt.cntct_cname, cnt.cntct_cntps, cnt.cntct_cntno, cnt.cntct_email,
//       cnt.cntct_ofadr, cnt.cntct_cntry, pty.party_ccode, jnc.jrnlc_drval, jnc.jrnlc_crval, jnc.jrnlc_descr,
//       jnc.jrnlc_sorce, TO_CHAR(jnm.jrnlm_trdat, 'YYYY-MM-DD') jrnlm_trdat, jnm.jrnlm_refno
//       FROM tmtb_jrnlc jnc
//       JOIN tmtb_party pty ON jnc.jrnlc_party = pty.id
//       JOIN tmcb_cntct cnt ON pty.party_vndor = cnt.id
//       JOIN tmtb_jrnlm jnm ON jnc.jrnlc_jrnlm = jnm.id
//       WHERE cnt.id = $1
//       AND cnt.cntct_users = $2
//       ORDER BY TO_CHAR(jnm.jrnlm_trdat, 'YYYY-MM-DD'), jnm.jrnlm_refno`;
//   return dbGetAll(sql, [cntct_id, user_c], `get contacts ledger- ${cntct_id}`);
// }

/**
 * Get ledger for a specific party (joins through party → journal).
 */
// async function getPartyLedger(party_id, user_c) {
//   const sql = `SELECT
//       COALESCE(cnt.cntct_ccode, pty.party_ccode) cntct_ccode,
//       COALESCE(cnt.cntct_ctype, cht.chtac_ctype) cntct_ctype,
//       COALESCE(cnt.cntct_cname, pty.party_cname) cntct_cname,
//       cnt.cntct_cntps, cnt.cntct_cntno, cnt.cntct_email, cnt.cntct_ofadr,
//       COALESCE(cnt.cntct_cntry, jnm.jrnlm_crncy) cntct_cntry,
//       pty.party_ccode, jnc.jrnlc_drval, jnc.jrnlc_crval, jnc.jrnlc_descr,
//       COALESCE(NULLIF(jnc.jrnlc_sorce, ''), jnm.jrnlm_trtyp) AS jrnlc_sorce,
//       TO_CHAR(jnm.jrnlm_trdat, 'YYYY-MM-DD') jrnlm_trdat, jnm.jrnlm_refno
//       FROM tmtb_jrnlc jnc
//       JOIN tmtb_party pty ON jnc.jrnlc_party = pty.id
//       LEFT JOIN tmcb_cntct cnt ON pty.party_vndor = cnt.id
//       JOIN tmtb_jrnlm jnm ON jnc.jrnlc_jrnlm = jnm.id
//       JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
//       WHERE pty.id = $1
//       AND pty.party_users = $2
//       ORDER BY TO_CHAR(jnm.jrnlm_trdat, 'YYYY-MM-DD'), jnm.jrnlm_refno`;
//   return dbGetAll(sql, [party_id, user_c], `get party ledger- ${party_id}`);
// }

module.exports = {
  buildJournalScripts,
  // createJournalEntry,
  // getJournalData,
  // getContactsLedger,
  // getPartyLedger,
};
