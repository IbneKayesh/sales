--
-- Table structure for table tmib_trnsc

CREATE TABLE tmib_trnsc (
  -- default 1
  id varchar(50) PRIMARY KEY,

  trnsc_users VARCHAR(50) NOT NULL,
  trnsc_bsins VARCHAR(50) NOT NULL,
  trnsc_trnsm VARCHAR(50) NOT NULL,
  trnsc_price VARCHAR(50) NOT NULL,
  trnsc_items VARCHAR(50) NOT NULL,
  trnsc_units VARCHAR(50) NOT NULL,
  trnsc_itrat decimal(18,6) NOT NULL DEFAULT 0,
  trnsc_itqty decimal(18,6) NOT NULL DEFAULT 0,
  trnsc_itamt decimal(18,6) NOT NULL DEFAULT 0,
  trnsc_ecamt decimal(18,6) NOT NULL DEFAULT 0,
  trnsc_stamt decimal(18,6) NOT NULL DEFAULT 0,
  trnsc_notes VARCHAR(50),
  trnsc_csrat decimal(18,6) NOT NULL DEFAULT 0,
  trnsc_refid VARCHAR(50) NOT NULL,

  -- default 2
  trnsc_actve boolean NOT NULL DEFAULT true,
  trnsc_crusr VARCHAR(50) NOT NULL,
  trnsc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trnsc_upusr VARCHAR(50) NOT NULL,
  trnsc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trnsc_rvnmr integer NOT NULL DEFAULT 1
);