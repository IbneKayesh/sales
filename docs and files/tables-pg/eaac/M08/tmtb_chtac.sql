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
  chtac_chtno varchar(50) NOT NULL,
  chtac_ntype varchar(2) NOT NULL,
  chtac_child boolean NOT NULL DEFAULT false,
  chtac_ispst boolean NOT NULL DEFAULT false,
  chtac_ptype varchar(20) NOT NULL DEFAULT 'Manual',
  chtac_pcrte varchar(20) NOT NULL DEFAULT 'SINGLE',
  chtac_jvpst varchar(20) NOT NULL DEFAULT 'SINGLE',
  chtac_sglmd varchar(30) NOT NULL DEFAULT 'SYS_BLOCKED',
  chtac_pstmd varchar(30) NOT NULL DEFAULT 'SYS_BLOCKED',
  
  -- default 2
  chtac_actve boolean NOT NULL DEFAULT true,
  chtac_crusr varchar(50) NOT NULL,
  chtac_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_upusr varchar(50) NOT NULL,
  chtac_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_rvnmr integer NOT NULL DEFAULT 1
);