CREATE TABLE tmtb_crncy (
  -- default 1
  id varchar(50) PRIMARY KEY,
  crncy_users varchar(50) NOT NULL,
  crncy_bsins varchar(50) NOT NULL,
  crncy_ccode varchar(50) NOT NULL,

  -- custom
  crncy_fcrnc varchar(50) NOT NULL,
  crncy_exrat decimal(18,6) NOT NULL DEFAULT 1,
  crncy_tcrnc varchar(50) NOT NULL,
  
  -- default 2
  crncy_actve boolean NOT NULL DEFAULT true,
  crncy_crusr varchar(50) NOT NULL,
  crncy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crncy_upusr varchar(50) NOT NULL,
  crncy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crncy_rvnmr integer NOT NULL DEFAULT 1
);