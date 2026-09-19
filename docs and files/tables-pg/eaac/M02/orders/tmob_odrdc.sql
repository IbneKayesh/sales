--drop table tmob_odrdc;
--
-- Table structure for table tmob_odrdc
-- mrr details

CREATE TABLE tmob_odrdc (
  id varchar(50) PRIMARY KEY,

  odrdc_users VARCHAR(50) NOT NULL,
  odrdc_bsins VARCHAR(50) NOT NULL,
  odrdc_odrdm VARCHAR(50) NOT NULL,
  odrdc_price VARCHAR(50) NOT NULL,
  odrdc_items VARCHAR(50) NOT NULL,
  odrdc_units VARCHAR(50) NOT NULL,
  odrdc_itrat decimal(18,6) DEFAULT 0.00,
  odrdc_itqty decimal(18,6) DEFAULT 0.00,
  odrdc_itamt decimal(18,6) DEFAULT 0.00,
  odrdc_dspct decimal(18,6) DEFAULT 0.00,
  odrdc_dsamt decimal(18,6) DEFAULT 0.00,
  odrdc_edamt decimal(18,6) DEFAULT 0.00,
  odrdc_vtpct decimal(18,6) DEFAULT 0.00,
  odrdc_vtamt decimal(18,6) DEFAULT 0.00,
  odrdc_vtype VARCHAR(10) DEFAULT 'EXEMPT',
  odrdc_icamt decimal(18,6) DEFAULT 0.00,
  odrdc_ecamt decimal(18,6) DEFAULT 0.00,
  odrdc_pyamt decimal(18,6) DEFAULT 0.00,
  odrdc_stamt decimal(18,6) DEFAULT 0.00,
  odrdc_notes VARCHAR(100),
  odrdc_csrat decimal(18,6) DEFAULT 0.00,
  odrdc_refid VARCHAR(50),
  odrdc_ivqty decimal(18,6) DEFAULT 0.00,
  odrdc_cnqty decimal(18,6) DEFAULT 0.00,
  
  -- default
  odrdc_actve boolean NOT NULL DEFAULT true,
  odrdc_crusr VARCHAR(50) NOT NULL,
  odrdc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdc_upusr VARCHAR(50) NOT NULL,
  odrdc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdc_rvnmr integer NOT NULL DEFAULT 1
);