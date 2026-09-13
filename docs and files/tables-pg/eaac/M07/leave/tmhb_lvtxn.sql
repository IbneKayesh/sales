--
-- Table structure for table tmhb_lvtxn
-- Leave Balance Transactions (Full audit ledger: Accrual, Used, Adjustment, Carry Forward, Expiry, Cancellation)
--

CREATE TABLE tmhb_lvtxn (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvtxn_users VARCHAR(50) NOT NULL,
  lvtxn_bsins VARCHAR(50) NOT NULL,
  lvtxn_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvtxn_emply VARCHAR(50) NOT NULL, -- employee id
  lvtxn_lvtyp VARCHAR(50) NOT NULL, -- leave type id
  lvtxn_lyear integer NOT NULL, -- leave year
  lvtxn_ttype VARCHAR(50) NOT NULL, -- transaction type [OPENING, ACCRUAL, USED, CARRY_FORWARD, ADJUSTMENT, EXPIRY, CANCELLED]
  lvtxn_txdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- transaction timestamp
  lvtxn_txnum decimal(5,2) NOT NULL, -- transaction amount (+ for credit, - for debit)
  lvtxn_reftp VARCHAR(50), -- reference type [LEAVE_APPLICATION, YEAR_CLOSE, MANUAL_ADJUSTMENT]
  lvtxn_refid VARCHAR(50), -- reference id
  lvtxn_notes VARCHAR(255), -- remarks

  -- default 2
  lvtxn_actve boolean NOT NULL DEFAULT true,
  lvtxn_crusr VARCHAR(50) NOT NULL,
  lvtxn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvtxn_upusr VARCHAR(50) NOT NULL,
  lvtxn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvtxn_rvnmr integer NOT NULL DEFAULT 1
);
