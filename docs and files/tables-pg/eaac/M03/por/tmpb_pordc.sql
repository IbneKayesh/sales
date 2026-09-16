--drop table tmpb_pordc;
--
-- Table structure for table tmpb_pordc
-- mrr details

CREATE TABLE tmpb_pordc (
  id varchar(50) PRIMARY KEY,

  pordc_users VARCHAR(50) NOT NULL,
  pordc_bsins VARCHAR(50) NOT NULL,
  pordc_pordm VARCHAR(50) NOT NULL,
  pordc_price VARCHAR(50) NOT NULL,
  pordc_items VARCHAR(50) NOT NULL,
  pordc_units VARCHAR(50) NOT NULL,
  pordc_itrat decimal(18,6) DEFAULT 0.00,
  pordc_itqty decimal(18,6) DEFAULT 0.00,
  pordc_itamt decimal(18,6) DEFAULT 0.00,
  pordc_dspct decimal(18,6) DEFAULT 0.00,
  pordc_dsamt decimal(18,6) DEFAULT 0.00,
  pordc_vtpct decimal(18,6) DEFAULT 0.00,
  pordc_vtamt decimal(18,6) DEFAULT 0.00,
  pordc_vtype VARCHAR(10) DEFAULT 'EXEMPT',
  pordc_icamt decimal(18,6) DEFAULT 0.00,
  pordc_ecamt decimal(18,6) DEFAULT 0.00,
  pordc_pyamt decimal(18,6) DEFAULT 0.00,
  pordc_stamt decimal(18,6) DEFAULT 0.00,
  pordc_notes VARCHAR(100),
  pordc_csrat decimal(18,6) DEFAULT 0.00,
  pordc_refid VARCHAR(50),
  pordc_mrqty decimal(18,6) DEFAULT 0.00,
  pordc_cnqty decimal(18,6) DEFAULT 0.00,
  
  -- default
  pordc_actve boolean NOT NULL DEFAULT true,
  pordc_crusr VARCHAR(50) NOT NULL,
  pordc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordc_upusr VARCHAR(50) NOT NULL,
  pordc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordc_rvnmr integer NOT NULL DEFAULT 1
);