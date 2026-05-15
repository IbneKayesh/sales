--
-- Table structure for table tmpb_migrn
-- item master business

CREATE TABLE tmpb_migrn (
  id varchar(50) PRIMARY KEY,

  migrn_apusr VARCHAR(50) NOT NULL,
  migrn_bsins VARCHAR(50) NOT NULL,
  migrn_dpart VARCHAR(50) NOT NULL,
  migrn_cntct VARCHAR(50) NOT NULL,
  migrn_trnno VARCHAR(50) NOT NULL,
  migrn_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migrn_refno VARCHAR(50),
  migrn_notes VARCHAR(100),
  migrn_tramt decimal(18,6) DEFAULT 0.00,
  migrn_itmds decimal(18,6) DEFAULT 0.00,
  migrn_invds decimal(18,6) DEFAULT 0.00,
  migrn_vtamt decimal(18,6) DEFAULT 0.00,
  migrn_txamt decimal(18,6) DEFAULT 0.00,
  migrn_icamt decimal(18,6) DEFAULT 0.00,
  migrn_ecamt decimal(18,6) DEFAULT 0.00,
  migrn_pyamt decimal(18,6) DEFAULT 0.00,
  migrn_pdamt decimal(18,6) DEFAULT 0.00,
  migrn_duamt decimal(18,6) DEFAULT 0.00,
  migrn_ipost boolean NOT NULL DEFAULT false,
  migrn_ipaid  boolean NOT NULL DEFAULT false,
  migrn_isqcp boolean NOT NULL DEFAULT false,
  
  -- default
  migrn_actve boolean NOT NULL DEFAULT true,
  migrn_crusr VARCHAR(50) NOT NULL,
  migrn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migrn_upusr VARCHAR(50) NOT NULL,
  migrn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migrn_rvnmr integer NOT NULL DEFAULT 1
);