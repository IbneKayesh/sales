--drop table tmib_mrrdt;
--
-- Table structure for table tmib_mrrdt
-- mrr details

CREATE TABLE tmib_mrrdt (
  id varchar(50) PRIMARY KEY,

  mrrdt_apusr VARCHAR(50) NOT NULL,
  mrrdt_bsins VARCHAR(50) NOT NULL,
  mrrdt_mrrmt VARCHAR(50) NOT NULL,
  mrrdt_price VARCHAR(50) NOT NULL,
  mrrdt_items VARCHAR(50) NOT NULL,
  mrrdt_trate decimal(18,6) DEFAULT 0.00,
  mrrdt_trqty decimal(18,6) DEFAULT 0.00,
  mrrdt_tramt decimal(18,6) DEFAULT 0.00,
  mrrdt_dspct decimal(18,6) DEFAULT 0.00,
  mrrdt_dsamt decimal(18,6) DEFAULT 0.00,
  mrrdt_sdvat decimal(18,6) DEFAULT 0.00,
  mrrdt_txpct decimal(18,6) DEFAULT 0.00,
  mrrdt_fxcst decimal(18,6) DEFAULT 0.00,
  mrrdt_otcst decimal(18,6) DEFAULT 0.00,
  mrrdt_ntamt decimal(18,6) DEFAULT 0.00,
  mrrdt_notes VARCHAR(100),
  mrrdt_csrat decimal(18,6) DEFAULT 0.00,
  mrrdt_refid VARCHAR(50),
  
  -- default
  mrrdt_actve boolean NOT NULL DEFAULT true,
  mrrdt_crusr VARCHAR(50) NOT NULL,
  mrrdt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdt_upusr VARCHAR(50) NOT NULL,
  mrrdt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdt_rvnmr integer NOT NULL DEFAULT 1
);