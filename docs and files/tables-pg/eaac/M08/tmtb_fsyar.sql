CREATE TABLE tmtb_fsyar (
  -- default 1
  id varchar(50) PRIMARY KEY,
  fsyar_users varchar(50) NOT NULL,
  fsyar_bsins varchar(50) NOT NULL,
  fsyar_ccode varchar(50) NOT NULL,
  fsyar_dpart varchar(50) NOT NULL,

  -- custom
  fsyar_cname varchar(50) NOT NULL,
  fsyar_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_endat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_stats varchar(50) NOT NULL,
  fsyar_iscur boolean NOT NULL DEFAULT false,
  fsyar_opbal decimal(18,6) DEFAULT 0,
  fsyar_clbal decimal(18,6) DEFAULT 0,
  
  -- default 2
  fsyar_actve boolean NOT NULL DEFAULT true,
  fsyar_crusr varchar(50) NOT NULL,
  fsyar_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_upusr varchar(50) NOT NULL,
  fsyar_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_rvnmr integer NOT NULL DEFAULT 1
);