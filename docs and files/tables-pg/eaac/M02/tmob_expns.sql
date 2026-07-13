--
-- Table structure for table tmob_expns
-- sales expenses charge

CREATE TABLE tmob_expns (
  -- default 1
  id varchar(50) PRIMARY KEY,
  expns_users VARCHAR(50) NOT NULL,
  expns_bsins VARCHAR(50) NOT NULL,
  expns_ccode VARCHAR(50) NOT NULL,
  expns_cntct VARCHAR(50) NOT NULL,
  expns_refid VARCHAR(50) NOT NULL,
  
  -- custom
  expns_djrnl VARCHAR(50),
  expns_refno VARCHAR(50),
  expns_sorce VARCHAR(50),
  expns_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expns_inexc boolean NOT NULL DEFAULT true,
  expns_notes VARCHAR(50),
  expns_xpamt decimal(20,6) NOT NULL DEFAULT 0,
  
  -- default 2
  expns_actve boolean NOT NULL DEFAULT true,
  expns_crusr varchar(50) NOT NULL,
  expns_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expns_upusr varchar(50) NOT NULL,
  expns_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expns_rvnmr integer NOT NULL DEFAULT 1
);