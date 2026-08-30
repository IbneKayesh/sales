--
-- Table structure for table tmib_pcost
-- costing list

CREATE TABLE tmib_pcost (
  -- default 1
  id varchar(50) PRIMARY KEY,
  pcost_users VARCHAR(50) NOT NULL,
  pcost_bsins VARCHAR(50) NOT NULL,
  pcost_ccode VARCHAR(50) NOT NULL,

  -- custom
  pcost_mcatg VARCHAR(50) NOT NULL,
  pcost_party VARCHAR(50) NOT NULL,  
  pcost_csamt decimal(18,6) DEFAULT 0.00,
  pcost_csrto decimal(18,6) DEFAULT 0.00,
  pcost_notes VARCHAR(50),
  
  -- default 2
  pcost_actve boolean NOT NULL DEFAULT true,
  pcost_crusr VARCHAR(50) NOT NULL,
  pcost_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pcost_upusr VARCHAR(50) NOT NULL,
  pcost_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pcost_rvnmr integer NOT NULL DEFAULT 1
);