--drop table tmob_invrc;
--
-- Table structure for table tmob_invrc
-- sales invoice return details

CREATE TABLE tmob_invrc (
  id varchar(50) PRIMARY KEY,

  invrc_users VARCHAR(50) NOT NULL,
  invrc_bsins VARCHAR(50) NOT NULL,
  invrc_invrm VARCHAR(50) NOT NULL,
  invrc_price VARCHAR(50) NOT NULL,
  invrc_items VARCHAR(50) NOT NULL,
  invrc_units VARCHAR(50) NOT NULL,
  invrc_itrat decimal(18,6) DEFAULT 0.00,
  invrc_itqty decimal(18,6) DEFAULT 0.00,
  invrc_itamt decimal(18,6) DEFAULT 0.00,
  invrc_dspct decimal(18,6) DEFAULT 0.00,
  invrc_dsamt decimal(18,6) DEFAULT 0.00,
  invrc_edamt decimal(18,6) DEFAULT 0.00,
  invrc_vtpct decimal(18,6) DEFAULT 0.00,
  invrc_vtamt decimal(18,6) DEFAULT 0.00,
  invrc_vtype VARCHAR(10) DEFAULT 'EXEMPT',
  invrc_icamt decimal(18,6) DEFAULT 0.00,
  invrc_ecamt decimal(18,6) DEFAULT 0.00,
  invrc_pyamt decimal(18,6) DEFAULT 0.00,
  invrc_stamt decimal(18,6) DEFAULT 0.00,
  invrc_notes VARCHAR(100),
  invrc_csrat decimal(18,6) DEFAULT 0.00,
  invrc_nsrat decimal(18,6) DEFAULT 0.00,
  invrc_refid VARCHAR(50),
  invrc_stock VARCHAR(50),
  
  -- default
  invrc_actve boolean NOT NULL DEFAULT true,
  invrc_crusr VARCHAR(50) NOT NULL,
  invrc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invrc_upusr VARCHAR(50) NOT NULL,
  invrc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invrc_rvnmr integer NOT NULL DEFAULT 1
);