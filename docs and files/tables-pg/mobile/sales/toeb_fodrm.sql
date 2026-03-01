--
-- Table structure for table toeb_fodrm
-- sales order master list

CREATE TABLE toeb_fodrm (
  id varchar(50) PRIMARY KEY,
  
  fodrm_users VARCHAR(50) NOT NULL,
  fodrm_bsins VARCHAR(50) NOT NULL,
  fodrm_cntct VARCHAR(50) NOT NULL,
  fodrm_empid VARCHAR(50) NOT NULL,
  fodrm_rutes VARCHAR(50) NOT NULL,
  fodrm_trnno VARCHAR(50) NOT NULL,
  fodrm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fodrm_trnte VARCHAR(100),
  fodrm_odamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_dlamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_rnamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_ttamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_pyamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_pdamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrm_duamt decimal(20,6) NOT NULL DEFAULT 0,

  fodrm_ispad integer NOT NULL DEFAULT 0,
  fodrm_ispst boolean NOT NULL DEFAULT false,
  fodrm_iscls boolean NOT NULL DEFAULT false,
  fodrm_vatcl boolean NOT NULL DEFAULT false,
  fodrm_isdlv boolean NOT NULL DEFAULT false,
  fodrm_oshpm VARCHAR(50) NULL,
  
  -- default
  fodrm_actve boolean NOT NULL DEFAULT true,
  fodrm_crusr VARCHAR(50) NOT NULL,
  fodrm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fodrm_upusr VARCHAR(50) NOT NULL,
  fodrm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fodrm_rvnmr integer NOT NULL DEFAULT 1
);
