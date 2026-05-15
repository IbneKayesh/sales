--
-- Table structure for table tmpb_digrn
-- item master business

CREATE TABLE tmpb_digrn (
  id varchar(50) PRIMARY KEY,

  digrn_apusr VARCHAR(50) NOT NULL,
  digrn_bsins VARCHAR(50) NOT NULL,
  digrn_migrn VARCHAR(50) NOT NULL,
  digrn_price VARCHAR(50) NOT NULL,
  digrn_items VARCHAR(50) NOT NULL,
  digrn_trate decimal(18,6) DEFAULT 0.00,
  digrn_trqty decimal(18,6) DEFAULT 0.00,
  digrn_tramt decimal(18,6) DEFAULT 0.00,
  digrn_dspct decimal(18,6) DEFAULT 0.00,
  digrn_dsamt decimal(18,6) DEFAULT 0.00,
  digrn_sdvat decimal(18,6) DEFAULT 0.00,
  digrn_txpct decimal(18,6) DEFAULT 0.00,
  digrn_fxcst decimal(18,6) DEFAULT 0.00,
  digrn_otcst decimal(18,6) DEFAULT 0.00,
  digrn_ntamt decimal(18,6) DEFAULT 0.00,
  digrn_notes VARCHAR(100),
  digrn_csrat decimal(18,6) DEFAULT 0.00,
  digrn_qcqty decimal(18,6) DEFAULT 0.00,
  digrn_rtqty decimal(18,6) DEFAULT 0.00,
  digrn_slqty decimal(18,6) DEFAULT 0.00,
  digrn_apqty decimal(18,6) DEFAULT 0.00,
  digrn_anqty decimal(18,6) DEFAULT 0.00,
  digrn_ohqty decimal(18,6) DEFAULT 0.00,
  digrn_dprat decimal(18,6) DEFAULT 0.00,
  digrn_tprat decimal(18,6) DEFAULT 0.00,
  digrn_mrrat decimal(18,6) DEFAULT 0.00,
  
  -- default
  digrn_actve boolean NOT NULL DEFAULT true,
  digrn_crusr VARCHAR(50) NOT NULL,
  digrn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  digrn_upusr VARCHAR(50) NOT NULL,
  digrn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  digrn_rvnmr integer NOT NULL DEFAULT 1
);