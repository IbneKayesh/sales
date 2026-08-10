--drop table tmob_invcc;
--
-- Table structure for table tmob_invcc
-- sales invoice details

CREATE TABLE tmob_invcc (
  id varchar(50) PRIMARY KEY,

  invcc_users VARCHAR(50) NOT NULL,
  invcc_bsins VARCHAR(50) NOT NULL,
  invcc_invcm VARCHAR(50) NOT NULL,
  invcc_price VARCHAR(50) NOT NULL,
  invcc_items VARCHAR(50) NOT NULL,
  invcc_units VARCHAR(50) NOT NULL,
  invcc_itrat decimal(18,6) DEFAULT 0.00,
  invcc_itqty decimal(18,6) DEFAULT 0.00,
  invcc_itamt decimal(18,6) DEFAULT 0.00,
  invcc_dspct decimal(18,6) DEFAULT 0.00,
  invcc_dsamt decimal(18,6) DEFAULT 0.00,
  invcc_edamt decimal(18,6) DEFAULT 0.00,
  invcc_vtpct decimal(18,6) DEFAULT 0.00,
  invcc_vtamt decimal(18,6) DEFAULT 0.00,
  invcc_icamt decimal(18,6) DEFAULT 0.00,
  invcc_ecamt decimal(18,6) DEFAULT 0.00,
  invcc_ntamt decimal(18,6) DEFAULT 0.00,
  invcc_notes VARCHAR(100),
  invcc_csrat decimal(18,6) DEFAULT 0.00,
  invcc_refid VARCHAR(50),
  invcc_stock VARCHAR(50),
  
  -- default
  invcc_actve boolean NOT NULL DEFAULT true,
  invcc_crusr VARCHAR(50) NOT NULL,
  invcc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcc_upusr VARCHAR(50) NOT NULL,
  invcc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcc_rvnmr integer NOT NULL DEFAULT 1
);