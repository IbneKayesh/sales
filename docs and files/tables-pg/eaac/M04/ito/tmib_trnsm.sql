--
-- Table structure for table tmib_trnsm

CREATE TABLE tmib_trnsm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  trnsm_users varchar(50) NOT NULL,
  trnsm_bsins varchar(50) NOT NULL,
  trnsm_dpart varchar(50) NOT NULL,
  trnsm_bsinz varchar(50) NOT NULL,
  trnsm_dparz varchar(50) NOT NULL,
  trnsm_ttype varchar(50) NOT NULL,
  trnsm_trnno varchar(50) NOT NULL,

  trnsm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trnsm_refno varchar(50) DEFAULT NULL,
  trnsm_notes varchar(100) DEFAULT NULL,

  trnsm_tramt decimal(18,6) NOT NULL DEFAULT 0,
  trnsm_ecamt decimal(18,6) NOT NULL DEFAULT 0,
  trnsm_stamt decimal(18,6) NOT NULL DEFAULT 0,
  trnsm_vehid varchar(50),
  trnsm_ispst boolean NOT NULL DEFAULT true,
  trnsm_isrcv varchar(50),
  -- optional
  
  -- default
  trnsm_actve TINYINT(1) NOT NULL DEFAULT 1,
  trnsm_crusr varchar(50) NOT NULL,
  trnsm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trnsm_upusr varchar(50) NOT NULL,
  trnsm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trnsm_rvnmr integer NOT NULL DEFAULT 1
);