--
-- Table structure for table toeb_oshpm
-- sales order master list

CREATE TABLE toeb_oshpm (
  id varchar(50) PRIMARY KEY,
  
  oshpm_users VARCHAR(50) NOT NULL,
  oshpm_bsins VARCHAR(50) NOT NULL,
  oshpm_cntct VARCHAR(50) NOT NULL,
  oshpm_dlvan VARCHAR(50) NOT NULL,
  oshpm_trnno VARCHAR(50) NOT NULL,
  oshpm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oshpm_trnte VARCHAR(100),
  oshpm_odamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_dlamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_rnamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_ttamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_pyamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_pdamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpm_duamt decimal(20,6) NOT NULL DEFAULT 0,

  oshpm_ispad integer NOT NULL DEFAULT 0,
  oshpm_ispst boolean NOT NULL DEFAULT false,
  oshpm_iscls boolean NOT NULL DEFAULT false,
  oshpm_vatcl boolean NOT NULL DEFAULT false,
  oshpm_isodr boolean NOT NULL DEFAULT false,

  oshpm_actve boolean NOT NULL DEFAULT true,
  oshpm_crusr VARCHAR(50) NOT NULL,
  oshpm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oshpm_upusr VARCHAR(50) NOT NULL,
  oshpm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oshpm_rvnmr integer NOT NULL DEFAULT 1
);