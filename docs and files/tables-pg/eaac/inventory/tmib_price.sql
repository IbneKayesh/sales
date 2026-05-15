--
-- Table structure for table tmib_price
-- item master business

CREATE TABLE tmib_price (
  id varchar(50) PRIMARY KEY,

  price_apusr VARCHAR(50) NOT NULL,
  price_bsins VARCHAR(50) NOT NULL,
  price_items VARCHAR(50) NOT NULL,
  price_pcode VARCHAR(50) NOT NULL,
  price_lprat decimal(18,6) DEFAULT 0.00,
  price_dprat decimal(18,6) DEFAULT 0.00,
  price_tprat decimal(18,6) DEFAULT 0.00,
  price_mrrat decimal(18,6) DEFAULT 0.00,
  price_dspct decimal(18,6) DEFAULT 0.00,
  price_gdstk decimal(18,6) DEFAULT 0.00,
  price_bdstk decimal(18,6) DEFAULT 0.00,
  price_mnqty decimal(18,6) DEFAULT 0.00,
  price_mxqty decimal(18,6) DEFAULT 0.00,
  price_pbqty decimal(18,6) DEFAULT 0.00,
  price_sbqty decimal(18,6) DEFAULT 0.00,
  price_notes VARCHAR(100),
  price_jnote VARCHAR(300),
  
  -- default
  price_actve boolean NOT NULL DEFAULT true,
  price_crusr VARCHAR(50) NOT NULL,
  price_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  price_upusr VARCHAR(50) NOT NULL,
  price_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  price_rvnmr integer NOT NULL DEFAULT 1
);