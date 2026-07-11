--
-- Table structure for table tmob_bkngm
-- sales master list

CREATE TABLE tmob_bkngm (
  -- default 1
  id varchar(50) PRIMARY KEY,
  bkngm_users VARCHAR(50) NOT NULL,
  bkngm_bsins VARCHAR(50) NOT NULL,
  bkngm_ccode VARCHAR(50) NOT NULL,
  bkngm_cntct VARCHAR(50) NOT NULL,

  bkngm_trnno VARCHAR(50) NOT NULL,
  bkngm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bkngm_refno VARCHAR(50) DEFAULT NULL,
  bkngm_trnte VARCHAR(100) DEFAULT NULL,
  bkngm_odamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_incst decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_excst decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_ttamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_pyamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_pdamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_duamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngm_stats VARCHAR(50) NOT NULL,
  
  -- default 2
  bkngm_actve boolean NOT NULL DEFAULT true,
  bkngm_crusr varchar(50) NOT NULL,
  bkngm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bkngm_upusr varchar(50) NOT NULL,
  bkngm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bkngm_rvnmr integer NOT NULL DEFAULT 1
);