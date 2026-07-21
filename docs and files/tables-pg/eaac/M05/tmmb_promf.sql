CREATE TABLE tmmb_promf (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  promf_users varchar(50) NOT NULL,
  promf_bsins varchar(50) NOT NULL,
  promf_ccode varchar(50) NOT NULL,
  promf_dpart varchar(50) NOT NULL,
  promf_bommf varchar(50) NOT NULL,
  promf_bkngm varchar(50), -- may null without work order

  -- custom
  promf_trnno varchar(50) NOT NULL,
  promf_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  promf_cname varchar(50) NOT NULL,
  promf_prono integer NOT NULL DEFAULT 1,
  promf_units varchar(50) NOT NULL,
  promf_bmqty decimal(18,6) DEFAULT 1,
  promf_bmval decimal(18,6) DEFAULT 1,
  promf_prqty decimal(18,6) DEFAULT 1,
  promf_prval decimal(18,6) DEFAULT 1,
  promf_frdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  promf_todat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  promf_prtim decimal(18,6) DEFAULT 1,
  promf_notes VARCHAR(50),
  
  -- default 2
  promf_actve boolean NOT NULL DEFAULT true,
  promf_crusr varchar(50) NOT NULL,
  promf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  promf_upusr varchar(50) NOT NULL,
  promf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  promf_rvnmr integer NOT NULL DEFAULT 1
);