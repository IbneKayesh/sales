--
-- Table structure for table tmcb_cntrt
--

CREATE TABLE tmcb_cntrt (
  id varchar(50) PRIMARY KEY,

  cnrut_users varchar(50) NOT NULL,
  cnrut_bsins varchar(50) NOT NULL,
  cnrut_cntct varchar(50) NOT NULL,
  cnrut_rutes varchar(50) NOT NULL,
  cnrut_empid varchar(50) NOT NULL,
  -- optional
  -- default
  cnrut_srlno integer NOT NULL DEFAULT 1,
  cnrut_lvdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  cnrut_actve boolean NOT NULL DEFAULT true,
  cnrut_crusr varchar(50) NOT NULL,
  cnrut_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cnrut_upusr varchar(50) NOT NULL,
  cnrut_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cnrut_rvnmr integer NOT NULL DEFAULT 1
);