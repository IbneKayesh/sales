--drop table tmpb_mrrdc;
--
-- Table structure for table tmpb_mrrdc
-- mrr details

CREATE TABLE tmpb_mrrdc (
  id varchar(50) PRIMARY KEY,

  mrrdc_users VARCHAR(50) NOT NULL,
  mrrdc_bsins VARCHAR(50) NOT NULL,
  mrrdc_mrrdm VARCHAR(50) NOT NULL,
  mrrdc_price VARCHAR(50) NOT NULL,
  mrrdc_items VARCHAR(50) NOT NULL,
  mrrdc_trate decimal(18,6) DEFAULT 0.00,
  mrrdc_trqty decimal(18,6) DEFAULT 0.00,
  mrrdc_tramt decimal(18,6) DEFAULT 0.00,
  mrrdc_dspct decimal(18,6) DEFAULT 0.00,
  mrrdc_dsamt decimal(18,6) DEFAULT 0.00,
  mrrdc_sdvat decimal(18,6) DEFAULT 0.00,
  mrrdc_txpct decimal(18,6) DEFAULT 0.00,
  mrrdc_fxcst decimal(18,6) DEFAULT 0.00,
  mrrdc_otcst decimal(18,6) DEFAULT 0.00,
  mrrdc_ntamt decimal(18,6) DEFAULT 0.00,
  mrrdc_notes VARCHAR(100),
  mrrdc_csrat decimal(18,6) DEFAULT 0.00,
  mrrdc_refid VARCHAR(50),
  
  -- default
  mrrdc_actve boolean NOT NULL DEFAULT true,
  mrrdc_crusr VARCHAR(50) NOT NULL,
  mrrdc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdc_upusr VARCHAR(50) NOT NULL,
  mrrdc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdc_rvnmr integer NOT NULL DEFAULT 1
);