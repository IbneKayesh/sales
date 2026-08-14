--
-- Table structure for table tmib_itmct
-- item master supplier list

CREATE TABLE tmib_itmct (
  -- default 1
  id varchar(50) PRIMARY KEY,
  itmct_users VARCHAR(50) NOT NULL,
  itmct_bsins VARCHAR(50) NOT NULL,
  itmct_ccode VARCHAR(50) NOT NULL,

  -- custom
  itmct_items VARCHAR(50) NOT NULL,
  itmct_cntct VARCHAR(50) NOT NULL,
  itmct_lprat decimal(4,2) DEFAULT 0.00,
  
  -- default 2
  itmct_actve boolean NOT NULL DEFAULT true,
  itmct_crusr VARCHAR(50) NOT NULL,
  itmct_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  itmct_upusr VARCHAR(50) NOT NULL,
  itmct_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  itmct_rvnmr integer NOT NULL DEFAULT 1
);