--
-- Table structure for table tmib_stock
-- item master business

CREATE TABLE tmib_stock (
  id varchar(50) PRIMARY KEY,

  stock_apusr VARCHAR(50) NOT NULL,
  stock_bsins VARCHAR(50) NOT NULL,
  stock_dpart VARCHAR(50) NOT NULL,
  stock_refnm VARCHAR(50) NOT NULL,
  stock_refid VARCHAR(50) NOT NULL,
  stock_trnno VARCHAR(50) NOT NULL,
  stock_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stock_items VARCHAR(50) NOT NULL,
  stock_price VARCHAR(50) NOT NULL,
  stock_brcod VARCHAR(50),
  stock_batch VARCHAR(50),
  stock_srial VARCHAR(50),
  stock_wrdat DATE,
  stock_fgdat DATE,
  stock_exdat DATE,
  stock_trqty decimal(18,6) DEFAULT 0.00,
  stock_rtqty decimal(18,6) DEFAULT 0.00,
  stock_slqty decimal(18,6) DEFAULT 0.00,
  stock_isqty decimal(18,6) DEFAULT 0.00,
  stock_rcqty decimal(18,6) DEFAULT 0.00,
  stock_cnqty decimal(18,6) DEFAULT 0.00,
  stock_dmqty decimal(18,6) DEFAULT 0.00,
  stock_aiqty decimal(18,6) DEFAULT 0.00,
  stock_aoqty decimal(18,6) DEFAULT 0.00,
  stock_ohqty decimal(18,6) DEFAULT 0.00,
  stock_cprat decimal(18,6) DEFAULT 0.00,
  stock_dprat decimal(18,6) DEFAULT 0.00,
  stock_tprat decimal(18,6) DEFAULT 0.00,
  stock_mrrat decimal(18,6) DEFAULT 0.00,
  stock_lprat decimal(18,6) DEFAULT 0.00,
  stock_notes VARCHAR(100),
  
  -- default
  stock_actve boolean NOT NULL DEFAULT true,
  stock_crusr VARCHAR(50) NOT NULL,
  stock_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stock_upusr VARCHAR(50) NOT NULL,
  stock_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stock_rvnmr integer NOT NULL DEFAULT 1
);