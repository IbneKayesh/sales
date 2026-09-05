CREATE TABLE tmtb_chtrt (

  -- default 1
  id varchar(50) PRIMARY KEY,

  chtrt_users varchar(50) NOT NULL,
  chtrt_bsins varchar(50) NOT NULL,
  chtrt_ccode varchar(50) NOT NULL,

  -- custom
  chtrt_trnid varchar(50) NOT NULL,
  chtrt_pegid varchar(50) NOT NULL,
  chtrt_grpid varchar(50) NOT NULL,
  chtrt_route varchar(50) NOT NULL,
  chtrt_chtno varchar(50) NOT NULL,
  chtrt_cname varchar(50) NOT NULL,
  chtrt_notes varchar(50),
  
  -- default 2
  chtrt_actve boolean NOT NULL DEFAULT true,
  chtrt_crusr varchar(50) NOT NULL,
  chtrt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtrt_upusr varchar(50) NOT NULL,
  chtrt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtrt_rvnmr integer NOT NULL DEFAULT 1
);