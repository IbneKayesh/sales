--
-- drop table tmib_bndlm;
-- Table structure for table tmib_bndlm
-- item bundle list
-- 3 PCS - 1 PCS
-- 1 SET - 7 PCS

CREATE TABLE tmib_bndlm (

  -- default 1
  id varchar(50) PRIMARY KEY,

  bndlm_users VARCHAR(50) NOT NULL,
  bndlm_bsins VARCHAR(50) NOT NULL,
  bndlm_ccode VARCHAR(50) NOT NULL,
  bndlm_dpart VARCHAR(50) NOT NULL,

  -- custom
  bndlm_cname VARCHAR(50) NOT NULL, ---B1G1, B3G1, SET
  bndlm_itype VARCHAR(50) NOT NULL, ---SALES/PURCHASE
  bndlm_items VARCHAR(50) NOT NULL,
  bndlm_price VARCHAR(50) NOT NULL,
  bndlm_units VARCHAR(50) NOT NULL,
  bndlm_frdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bndlm_todat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bndlm_itqty decimal(18,6) DEFAULT 1,
  bndlm_itrat decimal(18,6) DEFAULT 1,
  
  -- default 2
  bndlm_actve boolean NOT NULL DEFAULT true,
  bndlm_crusr VARCHAR(50) NOT NULL,
  bndlm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bndlm_upusr VARCHAR(50) NOT NULL,
  bndlm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bndlm_rvnmr integer NOT NULL DEFAULT 1
);