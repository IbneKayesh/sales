CREATE TABLE tmmb_bommf (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  bommf_users varchar(50) NOT NULL,
  bommf_bsins varchar(50) NOT NULL,
  bommf_ccode varchar(50) NOT NULL,
  bommf_dpart varchar(50) NOT NULL,
  bommf_prods varchar(50) NOT NULL,

  -- custom
  bommf_trnno varchar(50) NOT NULL,
  bommf_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bommf_cname varchar(50) NOT NULL,
  bommf_prono integer NOT NULL DEFAULT 1,
  bommf_frdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bommf_todat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bommf_estim decimal(18,6) DEFAULT 1,
  bommf_notes VARCHAR(50),
  
  -- default 2
  bommf_actve boolean NOT NULL DEFAULT true,
  bommf_crusr varchar(50) NOT NULL,
  bommf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bommf_upusr varchar(50) NOT NULL,
  bommf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bommf_rvnmr integer NOT NULL DEFAULT 1
);