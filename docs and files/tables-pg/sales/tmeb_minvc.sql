--
-- Table structure for table tmeb_minvc
-- sales invoice master list

CREATE TABLE tmeb_minvc (
  id varchar(50) PRIMARY KEY,
  
  minvc_users VARCHAR(50) NOT NULL,
  minvc_bsins VARCHAR(50) NOT NULL,
  minvc_cntct VARCHAR(50) NOT NULL,
  minvc_trnno VARCHAR(50) NOT NULL,
  minvc_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  minvc_refno VARCHAR(50),
  minvc_trnte VARCHAR(100),
  minvc_odamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_vatpy boolean NOT NULL DEFAULT false,
  minvc_incst decimal(20,6) NOT NULL DEFAULT 0,
  minvc_excst decimal(20,6) NOT NULL DEFAULT 0,
  minvc_rnamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_ttamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_pyamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_pdamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_duamt decimal(20,6) NOT NULL DEFAULT 0,
  minvc_rtamt decimal(20,6) NOT NULL DEFAULT 0,

  minvc_ispad integer NOT NULL DEFAULT 0,
  minvc_ispst boolean NOT NULL DEFAULT false,
  minvc_iscls boolean NOT NULL DEFAULT false,
  minvc_vatcl boolean NOT NULL DEFAULT false,
  minvc_hscnl boolean NOT NULL DEFAULT false,

   -- default
  minvc_actve boolean NOT NULL DEFAULT true,
  minvc_crusr VARCHAR(50) NOT NULL,
  minvc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  minvc_upusr VARCHAR(50) NOT NULL,
  minvc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  minvc_rvnmr integer NOT NULL DEFAULT 1
);