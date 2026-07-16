CREATE TABLE tmmb_prods (
  -- default 1
  id varchar(50) PRIMARY KEY,
  prods_users varchar(50) NOT NULL,
  prods_bsins varchar(50) NOT NULL,
  prods_ccode varchar(50) NOT NULL,

  -- custom
  prods_cname varchar(50) NOT NULL,
  prods_prono integer NOT NULL DEFAULT 0,
  
  -- default 2
  prods_actve boolean NOT NULL DEFAULT true,
  prods_crusr varchar(50) NOT NULL,
  prods_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prods_upusr varchar(50) NOT NULL,
  prods_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prods_rvnmr integer NOT NULL DEFAULT 1
);