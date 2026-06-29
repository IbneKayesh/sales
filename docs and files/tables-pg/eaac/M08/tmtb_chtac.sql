CREATE TABLE tmtb_chtac (
  -- default 1
  id varchar(50) PRIMARY KEY,
  chtac_users varchar(50) NOT NULL,
  chtac_bsins varchar(50) NOT NULL,
  chtac_ccode varchar(50) NOT NULL,

  -- custom
  chtac_chtac varchar(50) NOT NULL DEFAULT '-',
  chtac_cname varchar(50) NOT NULL,
  chtac_ctype varchar(50) NOT NULL,
  chtac_chtno integer NOT NULL DEFAULT 0,
  chtac_ntype varchar(2) NOT NULL,
  chtac_child boolean NOT NULL DEFAULT false,
  chtac_ispst boolean NOT NULL DEFAULT false,
  
  -- default 2
  chtac_actve boolean NOT NULL DEFAULT true,
  chtac_crusr varchar(50) NOT NULL,
  chtac_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_upusr varchar(50) NOT NULL,
  chtac_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_rvnmr integer NOT NULL DEFAULT 1
);