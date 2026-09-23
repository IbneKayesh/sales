--
-- Table structure for table tmib_trndm

CREATE TABLE tmib_trndm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  trndm_users varchar(50) NOT NULL,
  trndm_bsins varchar(50) NOT NULL,
  trndm_dpart varchar(50) NOT NULL,
  trndm_dparz varchar(50) NOT NULL,
  trndm_ttype varchar(50) NOT NULL,
  trndm_trnno varchar(50) NOT NULL,

  trndm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trndm_refno varchar(50) DEFAULT NULL,
  trndm_notes varchar(100) DEFAULT NULL,

  trndm_tramt decimal(18,6) NOT NULL DEFAULT 0,
  trndm_ecamt decimal(18,6) NOT NULL DEFAULT 0,
  trndm_stamt decimal(18,6) NOT NULL DEFAULT 0,
  trndm_csamt decimal(18,6) NOT NULL DEFAULT 0,
  trndm_vehid varchar(50),
  trndm_ispst boolean NOT NULL DEFAULT true,
  trndm_isrcv varchar(50),
  -- optional
  
  -- default
  trndm_actve boolean NOT NULL DEFAULT true,
  trndm_crusr varchar(50) NOT NULL,
  trndm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trndm_upusr varchar(50) NOT NULL,
  trndm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trndm_rvnmr integer NOT NULL DEFAULT 1
);