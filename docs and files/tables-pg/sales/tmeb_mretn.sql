--
-- Table structure for table tmeb_mretn
-- sales return master list

CREATE TABLE tmeb_mretn (
  id varchar(50) PRIMARY KEY,
  
  mretn_users VARCHAR(50) NOT NULL,
  mretn_bsins VARCHAR(50) NOT NULL,
  mretn_cntct VARCHAR(50) NOT NULL,
  mretn_trnno VARCHAR(50) NOT NULL,
  mretn_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mretn_refno VARCHAR(50),
  mretn_trnte VARCHAR(100),
  mretn_odamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_vatpy boolean NOT NULL DEFAULT false,
  mretn_incst decimal(20,6) NOT NULL DEFAULT 0,
  mretn_excst decimal(20,6) NOT NULL DEFAULT 0,
  mretn_rnamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_ttamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_pyamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_pdamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_duamt decimal(20,6) NOT NULL DEFAULT 0,
  mretn_rtamt decimal(20,6) NOT NULL DEFAULT 0,

  mretn_ispad integer NOT NULL DEFAULT 0,
  mretn_ispst boolean NOT NULL DEFAULT false,
  mretn_iscls boolean NOT NULL DEFAULT false,
  mretn_vatcl boolean NOT NULL DEFAULT false,
  mretn_hscnl boolean NOT NULL DEFAULT false,
  mretn_refid VARCHAR(50) NOT NULL,

   -- default
  mretn_actve boolean NOT NULL DEFAULT true,
  mretn_crusr VARCHAR(50) NOT NULL,
  mretn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mretn_upusr VARCHAR(50) NOT NULL,
  mretn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mretn_rvnmr integer NOT NULL DEFAULT 1
);