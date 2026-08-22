CREATE TABLE tmtb_prtyr (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  prtyr_users varchar(50) NOT NULL,
  prtyr_bsins varchar(50) NOT NULL,
  prtyr_ccode varchar(50) NOT NULL,

  -- custom
  prtyr_cname varchar(50) NOT NULL,
  prtyr_mgrup varchar(50) NOT NULL,
  prtyr_sgrup varchar(50),
  prtyr_chtno varchar(50) NOT NULL,
  prtyr_party varchar(50),
  prtyr_notes varchar(100),

  -- default 2
  prtyr_actve boolean NOT NULL DEFAULT true,
  prtyr_crusr varchar(50) NOT NULL,
  prtyr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prtyr_upusr varchar(50) NOT NULL,
  prtyr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prtyr_rvnmr integer NOT NULL DEFAULT 1
);