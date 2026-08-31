--
-- Table structure for table tmib_bndlc
-- item bundle list
-- 3 PCS - 1 PCS
-- 1 SET - 7 PCS

CREATE TABLE tmib_bndlc (

  -- default 1
  id varchar(50) PRIMARY KEY,

  bndlc_users VARCHAR(50) NOT NULL,
  bndlc_bsins VARCHAR(50) NOT NULL,
  bndlc_bndlm VARCHAR(50) NOT NULL,

  -- custom
  bndlc_items VARCHAR(50) NOT NULL,
  bndlc_price VARCHAR(50) NOT NULL,
  bndlc_itqty decimal(18,6) DEFAULT 1,
  bndlc_itrat decimal(18,6) DEFAULT 1,
  
  -- default 2
  bndlc_actve boolean NOT NULL DEFAULT true,
  bndlc_crusr VARCHAR(50) NOT NULL,
  bndlc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bndlc_upusr VARCHAR(50) NOT NULL,
  bndlc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bndlc_rvnmr integer NOT NULL DEFAULT 1
);