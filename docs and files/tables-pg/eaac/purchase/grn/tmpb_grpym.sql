--
-- Table structure for table tmpb_grpym
-- item master business

CREATE TABLE tmpb_grpym (
  id varchar(50) PRIMARY KEY,

  grpym_apusr VARCHAR(50) NOT NULL,
  grpym_bsins VARCHAR(50) NOT NULL,
  grpym_migrn VARCHAR(50) NOT NULL,
  grpym_pmode VARCHAR(50) NOT NULL,
  grpym_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grpym_pdamt decimal(18,6) DEFAULT 0.00,
  grpym_notes VARCHAR(50),
  -- default
  grpym_actve boolean NOT NULL DEFAULT true,
  grpym_crusr VARCHAR(50) NOT NULL,
  grpym_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grcst_upusr VARCHAR(50) NOT NULL,
  grcst_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grcst_rvnmr integer NOT NULL DEFAULT 1
);