--
-- Table structure for table tmib_trndc

CREATE TABLE tmib_trndc (
  -- default 1
  id varchar(50) PRIMARY KEY,

  trndc_users VARCHAR(50) NOT NULL,
  trndc_bsins VARCHAR(50) NOT NULL,
  trndc_trndm VARCHAR(50) NOT NULL,
  trndc_price VARCHAR(50) NOT NULL,
  trndc_items VARCHAR(50) NOT NULL,
  trndc_units VARCHAR(50) NOT NULL,
  trndc_itrat decimal(18,6) NOT NULL DEFAULT 0,
  trndc_itqty decimal(18,6) NOT NULL DEFAULT 0,
  trndc_itamt decimal(18,6) NOT NULL DEFAULT 0,
  trndc_ecamt decimal(18,6) NOT NULL DEFAULT 0,
  trndc_stamt decimal(18,6) NOT NULL DEFAULT 0,
  trndc_notes VARCHAR(50),
  trndc_csrat decimal(18,6) NOT NULL DEFAULT 0,
  trndc_refid VARCHAR(50) NOT NULL,

  -- default 2
  trndc_actve boolean NOT NULL DEFAULT true,
  trndc_crusr VARCHAR(50) NOT NULL,
  trndc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trndc_upusr VARCHAR(50) NOT NULL,
  trndc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trndc_rvnmr integer NOT NULL DEFAULT 1
);