/**
 * SQL Scripts Library for centralized SQL management
 * This helps reduce redundancy and maintain SQL scripts in one place.
 */

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
    },
    reset_purchase_booking_and_good_stock_qty: (businessId) => ({
      sql: `UPDATE tmib_bitem
              SET bitem_pbqty = 0,
              bitem_gstkq = 0
              WHERE bitem_bsins = ?
              AND (bitem_pbqty > 0 OR bitem_gstkq > 0)`,
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
    update_good_stock_qty: (businessId) => ({
      sql: `UPDATE tmib_bitem AS tgt
            JOIN (
              SELECT crcpt.crcpt_bitem, crcpt.crcpt_items, SUM(crcpt.crcpt_ohqty) AS bitem_gstkq
              FROM tmpb_crcpt crcpt
              JOIN tmpb_mrcpt mrcpt ON crcpt.crcpt_mrcpt = mrcpt.id
              WHERE crcpt.crcpt_ohqty > 0
              AND mrcpt.mrcpt_bsins = ?
              GROUP BY crcpt.crcpt_bitem, crcpt.crcpt_items
          ) AS src
          ON tgt.id = src.crcpt_bitem
          SET tgt.bitem_gstkq = src.bitem_gstkq`,
      params: [businessId],
      label: `Update BItems Good Stock Quantity`,
    }),
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
        params: [irefIdd],
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
  },
};

module.exports = closingSql;
