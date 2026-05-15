--
-- Table structure for table tmpb_grcst
-- item master business

CREATE TABLE tmpb_grcst (
  id varchar(50) PRIMARY KEY,

  grcst_apusr VARCHAR(50) NOT NULL,
  grcst_bsins VARCHAR(50) NOT NULL,
  grcst_migrn VARCHAR(50) NOT NULL,
  grcst_csmod VARCHAR(50) NOT NULL,
  grcst_clmod VARCHAR(50) NOT NULL,
  grcst_cname VARCHAR(50) NOT NULL,
  grcst_value decimal(18,6) DEFAULT 0.00,  
  grcst_notes VARCHAR(50),
  -- default
  grcst_actve boolean NOT NULL DEFAULT true,
  grcst_crusr VARCHAR(50) NOT NULL,
  grcst_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grcst_upusr VARCHAR(50) NOT NULL,
  grcst_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grcst_rvnmr integer NOT NULL DEFAULT 1
);