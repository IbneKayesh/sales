CREATE TABLE tmtb_acprd (
  -- default 1
  id varchar(50) PRIMARY KEY,
  acprd_users varchar(50) NOT NULL,
  acprd_bsins varchar(50) NOT NULL,
  acprd_ccode varchar(50) NOT NULL,
  acprd_dpart varchar(50) NOT NULL,
  acprd_fsyar varchar(50) NOT NULL,

  -- custom
  acprd_cname varchar(50) NOT NULL,
  acprd_trnno varchar(50) NOT NULL,
  acprd_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_endat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_stats varchar(50) NOT NULL,
  acprd_iscur boolean NOT NULL DEFAULT false,
  acprd_opbal decimal(18,6) DEFAULT 0,
  acprd_clbal decimal(18,6) DEFAULT 0,

  -- default 2
  acprd_actve boolean NOT NULL DEFAULT true,
  acprd_crusr varchar(50) NOT NULL,
  acprd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_upusr varchar(50) NOT NULL,
  acprd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_rvnmr integer NOT NULL DEFAULT 1
);