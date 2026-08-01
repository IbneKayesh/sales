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
  mrrdc_units VARCHAR(50) NOT NULL,
  mrrdc_itrat decimal(18,6) DEFAULT 0.00,
  mrrdc_itqty decimal(18,6) DEFAULT 0.00,
  mrrdc_itamt decimal(18,6) DEFAULT 0.00,
  mrrdc_dspct decimal(18,6) DEFAULT 0.00,
  mrrdc_dsamt decimal(18,6) DEFAULT 0.00,
  mrrdc_edamt decimal(18,6) DEFAULT 0.00,
  mrrdc_ivpct decimal(18,6) DEFAULT 0.00,
  mrrdc_ivamt decimal(18,6) DEFAULT 0.00,
  mrrdc_vtpct decimal(18,6) DEFAULT 0.00,
  mrrdc_vtamt decimal(18,6) DEFAULT 0.00,
  mrrdc_txpct decimal(18,6) DEFAULT 0.00,
  mrrdc_txamt decimal(18,6) DEFAULT 0.00,
  mrrdc_fcpct decimal(18,6) DEFAULT 0.00,
  mrrdc_fcamt decimal(18,6) DEFAULT 0.00,
  mrrdc_icamt decimal(18,6) DEFAULT 0.00,
  mrrdc_ecamt decimal(18,6) DEFAULT 0.00,
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