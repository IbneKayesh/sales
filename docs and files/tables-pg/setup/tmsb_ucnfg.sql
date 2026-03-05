--
-- Table structure for table tmsb_ucnfg
-- user configuration

CREATE TABLE tmsb_ucnfg (
  id varchar(50) PRIMARY KEY,

  ucnfg_users varchar(50) NOT NULL,
  ucnfg_bsins varchar(50) NOT NULL,

  -- optional
  ucnfg_cname varchar(50),
  ucnfg_gname varchar(50),
  ucnfg_label varchar(50),
  ucnfg_value varchar(50),
  ucnfg_notes varchar(50),

  -- default
  ucnfg_actve boolean NOT NULL DEFAULT true,
  ucnfg_crusr varchar(50) NOT NULL,
  ucnfg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ucnfg_upusr varchar(50) NOT NULL,
  ucnfg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ucnfg_rvnmr integer NOT NULL DEFAULT 1
);