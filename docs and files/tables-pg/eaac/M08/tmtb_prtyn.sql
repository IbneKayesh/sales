CREATE TABLE tmtb_prtyn (
  -- default 1
  id varchar(50) PRIMARY KEY,
  prtyn_users varchar(50) NOT NULL,
  prtyn_bsins varchar(50) NOT NULL,
  prtyn_ccode varchar(50) NOT NULL,

  -- custom
  prtyn_table varchar(50) NOT NULL,
  prtyn_cname varchar(50) NOT NULL,
  prtyn_ctype varchar(50),
  prtyn_chtac varchar(50),
  prtyn_chtno varchar(50),
  prtyn_party varchar(50),
  prtyn_notes varchar(100),
  
  -- default 2
  prtyn_actve boolean NOT NULL DEFAULT true,
  prtyn_crusr varchar(50) NOT NULL,
  prtyn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prtyn_upusr varchar(50) NOT NULL,
  prtyn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prtyn_rvnmr integer NOT NULL DEFAULT 1
);