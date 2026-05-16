--
-- Table structure for table tmib_mrrmt
-- mrr master

CREATE TABLE tmib_mrrmt (
  id varchar(50) PRIMARY KEY,

  mrrmt_apusr VARCHAR(50) NOT NULL,
  mrrmt_bsins VARCHAR(50) NOT NULL,
  mrrmt_dpart VARCHAR(50) NOT NULL,
  mrrmt_cntct VARCHAR(50) NOT NULL,
  mrrmt_trnno VARCHAR(50) NOT NULL,
  mrrmt_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrmt_refno VARCHAR(50),
  mrrmt_notes VARCHAR(100),
  mrrmt_tramt decimal(18,6) DEFAULT 0.00,
  mrrmt_itmds decimal(18,6) DEFAULT 0.00,
  mrrmt_invds decimal(18,6) DEFAULT 0.00,
  mrrmt_vtamt decimal(18,6) DEFAULT 0.00,
  mrrmt_txamt decimal(18,6) DEFAULT 0.00,
  mrrmt_icamt decimal(18,6) DEFAULT 0.00,
  mrrmt_ecamt decimal(18,6) DEFAULT 0.00,
  mrrmt_pyamt decimal(18,6) DEFAULT 0.00,
  mrrmt_pdamt decimal(18,6) DEFAULT 0.00,
  mrrmt_duamt decimal(18,6) DEFAULT 0.00,
  mrrmt_ipost boolean NOT NULL DEFAULT false,
  mrrmt_ipaid boolean NOT NULL DEFAULT false,
  mrrmt_isqcp boolean NOT NULL DEFAULT false,
  
  -- default
  mrrmt_actve boolean NOT NULL DEFAULT true,
  mrrmt_crusr VARCHAR(50) NOT NULL,
  mrrmt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrmt_upusr VARCHAR(50) NOT NULL,
  mrrmt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrmt_rvnmr integer NOT NULL DEFAULT 1
);