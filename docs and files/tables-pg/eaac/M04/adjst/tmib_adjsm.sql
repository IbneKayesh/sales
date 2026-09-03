--
-- Table structure for table tmib_adjsm
--

CREATE TABLE tmib_adjsm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  adjsm_users varchar(50) NOT NULL,
  adjsm_bsins varchar(50) NOT NULL,
  adjsm_dpart varchar(50) NOT NULL,
  adjsm_ttype varchar(50) NOT NULL,
  adjsm_trnno varchar(50) NOT NULL,
  adjsm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  adjsm_refno VARCHAR(50),
  adjsm_notes VARCHAR(100),
  adjsm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  adjsm_ispst boolean NOT NULL DEFAULT false,
  adjsm_isapp boolean NOT NULL DEFAULT false,
  
  -- optional
  
  -- default
  adjsm_actve boolean NOT NULL DEFAULT true,
  adjsm_crusr varchar(50) NOT NULL,
  adjsm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  adjsm_upusr varchar(50) NOT NULL,
  adjsm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  adjsm_rvnmr integer NOT NULL DEFAULT 1
);