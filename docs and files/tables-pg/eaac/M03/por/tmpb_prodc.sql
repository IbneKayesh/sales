--drop table tmpb_prodc;
--
-- Table structure for table tmpb_prodc
-- mrr details

CREATE TABLE tmpb_prodc (
  id varchar(50) PRIMARY KEY,

  prodc_users VARCHAR(50) NOT NULL,
  prodc_bsins VARCHAR(50) NOT NULL,
  prodc_prodm VARCHAR(50) NOT NULL,
  prodc_price VARCHAR(50) NOT NULL,
  prodc_items VARCHAR(50) NOT NULL,
  prodc_units VARCHAR(50) NOT NULL,
  prodc_itrat decimal(18,6) DEFAULT 0.00,
  prodc_itqty decimal(18,6) DEFAULT 0.00,
  prodc_itamt decimal(18,6) DEFAULT 0.00,
  prodc_dspct decimal(18,6) DEFAULT 0.00,
  prodc_dsamt decimal(18,6) DEFAULT 0.00,
  prodc_edamt decimal(18,6) DEFAULT 0.00,
  prodc_vtpct decimal(18,6) DEFAULT 0.00,
  prodc_vtamt decimal(18,6) DEFAULT 0.00,
  prodc_vtype VARCHAR(10) DEFAULT 'EXEMPT',
  prodc_icamt decimal(18,6) DEFAULT 0.00,
  prodc_ecamt decimal(18,6) DEFAULT 0.00,
  prodc_pyamt decimal(18,6) DEFAULT 0.00,
  prodc_stamt decimal(18,6) DEFAULT 0.00,
  prodc_notes VARCHAR(100),
  prodc_csrat decimal(18,6) DEFAULT 0.00,
  prodc_refid VARCHAR(50),
  
  -- default
  prodc_actve boolean NOT NULL DEFAULT true,
  prodc_crusr VARCHAR(50) NOT NULL,
  prodc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prodc_upusr VARCHAR(50) NOT NULL,
  prodc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prodc_rvnmr integer NOT NULL DEFAULT 1
);