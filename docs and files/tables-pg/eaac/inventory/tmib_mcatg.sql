--
-- Table structure for table tmib_mcatg
--

CREATE TABLE tmib_mcatg (
  id varchar(50) PRIMARY KEY,

  mcatg_apusr varchar(50) NOT NULL,
  mcatg_bsins varchar(50) NOT NULL,
  mcatg_mcode varchar(50) NOT NULL,
  mcatg_mname varchar(50) NOT NULL,
  -- optional
  -- default
  mcatg_actve boolean NOT NULL DEFAULT true,
  mcatg_crusr varchar(50) NOT NULL,
  mcatg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mcatg_upusr varchar(50) NOT NULL,
  mcatg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mcatg_rvnmr integer NOT NULL DEFAULT 1
);