--
-- Table structure for table tmob_paymt
-- sales payment

CREATE TABLE tmob_paymt (
  -- default 1
  id varchar(50) PRIMARY KEY,
  paymt_users VARCHAR(50) NOT NULL,
  paymt_bsins VARCHAR(50) NOT NULL,
  paymt_ccode VARCHAR(50) NOT NULL,
  paymt_cntct VARCHAR(50) NOT NULL,
  paymt_refid VARCHAR(50) NOT NULL,
  
  -- custom
  paymt_djrnl VARCHAR(50),
  paymt_refno VARCHAR(50),
  paymt_sorce VARCHAR(50),
  paymt_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paymt_methd VARCHAR(50) NOT NULL,
  paymt_stats VARCHAR(50) NOT NULL,
  paymt_slamt decimal(20,6) NOT NULL DEFAULT 0,
  
  -- default 2
  paymt_actve boolean NOT NULL DEFAULT true,
  paymt_crusr varchar(50) NOT NULL,
  paymt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paymt_upusr varchar(50) NOT NULL,
  paymt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paymt_rvnmr integer NOT NULL DEFAULT 1
);