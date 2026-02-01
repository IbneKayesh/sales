/**
 * SQL Scripts Library for centralized SQL management
 * This helps reduce redundancy and maintain SQL scripts in one place.
 **/

const closingSql = {
  inventory: {
    tmib_bitem: {
      reset_purchase_booking_qty: (businessId) => ({
        sql: `UPDATE tmib_bitem
        SET bitem_pbqty = 0
        WHERE bitem_bsins = ?
        AND bitem_pbqty > 0`,
        params: [businessId],
        label: `Reset BItems Purchase Booking Quantity`,
      }),
      reset_purchase_booking_and_good_stock_qty: (businessId) => ({
        sql: `UPDATE tmib_bitem
                SET bitem_pbqty = 0,
                bitem_gstkq = 0,
                bitem_istkq = 0
                WHERE bitem_bsins = ?
                AND (bitem_pbqty > 0 OR bitem_gstkq > 0 OR bitem_istkq > 0)`,
        params: [businessId],
        label: `Reset BItems Purchase Booking and Good Stock Quantity`,
      }),
      update_purchase_booking_qty: (businessId) => ({
        sql: `UPDATE tmib_bitem AS tgt
          JOIN (
            SELECT cbkg.cbkng_bitem, SUM(cbkg.cbkng_pnqty) AS cbkng_pnqty
            FROM tmpb_cbkng cbkg
            JOIN tmpb_mbkng bkg ON cbkg.cbkng_mbkng = bkg.id
            WHERE cbkg.cbkng_pnqty > 0
            AND bkg.mbkng_ispst = 1
            AND bkg.mbkng_bsins = ?
            GROUP BY cbkg.cbkng_bitem
            )AS src
          ON tgt.id = src.cbkng_bitem
          SET tgt.bitem_pbqty = src.cbkng_pnqty`,
        params: [businessId],
        label: `Update BItems Purchase Booking Quantity`,
      }),
      update_good_stock_qty_v1: (businessId) => ({
        //invoice, receipt, transfer
        sql: `UPDATE tmib_bitem tgt
                JOIN (
                  SELECT bitem_id, SUM(bitem_gstkq) AS bitem_gstkq, SUM(bitem_istkq) AS bitem_istkq
                  FROM (
                      SELECT cinv.cinvc_bitem AS bitem_id, 
                      CASE WHEN itm.items_trcks = 0 THEN
                      SUM(cinv.cinvc_itqty - cinv.cinvc_slqty)
                      ELSE 0
                      END AS bitem_gstkq,
                      CASE WHEN itm.items_trcks = 1 THEN
                      SUM(cinv.cinvc_itqty - cinv.cinvc_slqty)
                      ELSE 0
                      END AS bitem_istkq
                      FROM tmpb_cinvc cinv
                      JOIN tmpb_minvc minv ON cinv.cinvc_minvc = minv.id
                      JOIN tmib_items itm ON cinv.cinvc_items = itm.id
                      WHERE minv.minvc_bsins = ?
                      GROUP BY cinv.cinvc_bitem
                  UNION ALL
                      SELECT crpt.crcpt_bitem, 
                      CASE WHEN itm.items_trcks = 0 THEN
                      SUM(crpt.crcpt_itqty - crpt.crcpt_slqty)
                      ELSE 0
                      END AS bitem_gstkq,
                      CASE WHEN itm.items_trcks = 1 THEN
                      SUM(crpt.crcpt_itqty - crpt.crcpt_slqty)
                      ELSE 0
                      END AS bitem_istkq
                      FROM tmpb_crcpt crpt
                      JOIN tmpb_mrcpt mrpt ON crpt.crcpt_mrcpt = mrpt.id
                      JOIN tmib_items itm ON crpt.crcpt_items = itm.id
                      WHERE mrpt.mrcpt_bsins = ? 
                      GROUP BY crpt.crcpt_bitem
                  UNION ALL
                      SELECT cts.ctrsf_bitem,
                      CASE WHEN cts.ctrsf_srcnm = 'Inventory Stock' THEN
                      0 - SUM(cts.ctrsf_itqty)
                      ELSE 0
                      END AS bitem_gstkq,
                      CASE WHEN cts.ctrsf_srcnm != 'Inventory Stock' THEN
                      0 - SUM(cts.ctrsf_itqty)
                      ELSE 0
                      END AS bitem_istkq
                      FROM tmib_ctrsf cts
                      JOIN tmib_mtrsf mts ON cts.ctrsf_mtrsf = mts.id
                      WHERE mts.mtrsf_bsins = ?
                      GROUP BY cts.ctrsf_bitem
                  )src
                  GROUP BY bitem_id
                )src
                ON tgt.id = src.bitem_id
                SET tgt.bitem_gstkq = src.bitem_gstkq,
                tgt.bitem_istkq = src.bitem_istkq`,
        params: [businessId, businessId, businessId],
        label: `Update BItems Good Stock Quantity, [Receipt, Invoice, Transfer]`,
      }),
    },
  },

  accounts: {
    tmtb_bacts: {
      update_current_balance: (userId) => ({
        sql: `UPDATE tmtb_bacts AS b
      JOIN (
          SELECT 
              ledgr_bacts  AS id,
              ledgr_users  AS bacts_users,
              SUM(ledgr_cramt - ledgr_dbamt) AS bacts_crbln
          FROM tmtb_ledgr
          WHERE ledgr_users = ?
          GROUP BY ledgr_bacts, ledgr_users
      ) AS bl
        ON bl.id = b.id
      AND bl.bacts_users = b.bacts_users
      SET b.bacts_crbln = bl.bacts_crbln`,
        params: [userId],
        label: `Account balance generated for ${userId}`,
      }),
    },
  },

  purchase: {
    tmpb_mbkng: {
      update_payment_status: (businessId) => ({
        sql: `UPDATE tmpb_mbkng
        SET mbkng_ispad = 1
        WHERE mbkng_ispad IN (0,2)
        AND mbkng_duamt = 0
        AND mbkng_bsins = ?`,
        params: [businessId],
        label: `Update Purchase Booking payment status`,
      }),
      update_payment_status_by_refId: (refId) => ({
        sql: `UPDATE tmpb_mbkng
        SET mbkng_ispad = 1
        WHERE mbkng_ispad IN (0,2)
        AND mbkng_duamt = 0
        AND id = ?`,
        params: [refId],
        label: `Update Purchase Booking payment status`,
      }),
      update_payble_dues: (refId) => ({
        sql: `UPDATE tmpb_mbkng tgt
        JOIN (
          SELECT paybl_refid, SUM(paybl_dbamt) AS paybl_pyamt
          FROM tmtb_paybl
          WHERE paybl_refid = ?
          GROUP BY paybl_refid
        )src
        ON tgt.id = src.paybl_refid
        SET tgt.mbkng_pdamt = src.paybl_pyamt,
        tgt.mbkng_duamt = tgt.mbkng_pyamt - src.paybl_pyamt`,
        params: [refId],
        label: `Update Payable Due`,
      }),
    },

    tmpb_cbkng: {
      update_received_and_pending_qty: (businessId) => ({
        sql: `UPDATE tmpb_cbkng AS tgt
            JOIN (
              SELECT cbkg.id, SUM(crpt.crcpt_itqty) AS cbkng_rcqty
              FROM tmpb_cbkng cbkg
              JOIN tmpb_crcpt crpt ON cbkg.id = crpt.crcpt_cbkng
              JOIN tmpb_mbkng bkg ON cbkg.cbkng_mbkng = bkg.id
              WHERE cbkg.cbkng_pnqty > 0
              AND bkg.mbkng_bsins = ?
              GROUP BY cbkg.id
            )AS src
            ON tgt.id = src.id
            SET tgt.cbkng_rcqty = src.cbkng_rcqty,
            tgt.cbkng_pnqty = tgt.cbkng_itqty - (tgt.cbkng_cnqty + src.cbkng_rcqty)`,
        params: [businessId],
        label: `Update Purchase Booking Received and Pending Quantity`,
      }),
    },

    tmpb_minvc: {
      update_payment_status_by_refId: (refId) => ({
        sql: `UPDATE tmpb_minvc
        SET minvc_ispad = 1
        WHERE minvc_ispad IN (0,2)
        AND minvc_duamt = 0
        AND id = ?`,
        params: [refId],
        label: `Update Purchase Invoice payment status`,
      }),
      update_payble_dues: (refId) => ({
        sql: `UPDATE tmpb_minvc tgt
        JOIN (
          SELECT paybl_refid, SUM(paybl_dbamt) AS paybl_pyamt
          FROM tmtb_paybl
          WHERE paybl_refid = ?
          GROUP BY paybl_refid
        )src
        ON tgt.id = src.paybl_refid
        SET tgt.minvc_pdamt = src.paybl_pyamt,
        tgt.minvc_duamt = tgt.minvc_pyamt - src.paybl_pyamt`,
        params: [refId],
        label: `Update Payable Due`,
      }),
    },

    tmpb_crcpt: {
      update_sold_ohqty: (businessId) => ({
        sql: `UPDATE tmpb_crcpt tgt
            JOIN (
              SELECT cts.ctrsf_srcnm, cts.ctrsf_refid, SUM(cts.ctrsf_itqty) AS ctrsf_itqty
              FROM tmib_ctrsf cts
              JOIN tmib_mtrsf mts ON cts.ctrsf_mtrsf = mts.id
              WHERE cts.ctrsf_srcnm = 'Purchase Receipt'
              GROUP BY cts.ctrsf_srcnm, cts.ctrsf_refid
            )src
            ON tgt.id = src.ctrsf_refid
            SET tgt.crcpt_slqty = src.ctrsf_itqty,
            tgt.crcpt_ohqty = tgt.crcpt_itqty - (tgt.crcpt_rtqty + src.ctrsf_itqty)`,
        params: [],
        label: `Update Purchase Receipt`,
      }),
    },

    tmpb_cinvc: {
      update_sold_ohqty: (businessId) => ({
        sql: `UPDATE tmpb_cinvc tgt
            JOIN (
              SELECT cts.ctrsf_srcnm, cts.ctrsf_refid, SUM(cts.ctrsf_itqty) AS ctrsf_itqty
              FROM tmib_ctrsf cts
              JOIN tmib_mtrsf mts ON cts.ctrsf_mtrsf = mts.id
              WHERE cts.ctrsf_srcnm = 'Purchase Invoice'
              GROUP BY cts.ctrsf_srcnm, cts.ctrsf_refid
            )src
            ON tgt.id = src.ctrsf_refid
            SET tgt.cinvc_slqty = src.ctrsf_itqty,
            tgt.cinvc_ohqty = tgt.cinvc_itqty - (tgt.cinvc_rtqty + src.ctrsf_itqty)`,
        params: [],
        label: `Update Purchase Receipt`,
      }),
    },
  },
};

module.exports = closingSql;
