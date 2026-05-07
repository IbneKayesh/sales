--
-- Table structure for table tmib_scatg
--

CREATE TABLE tmib_scatg (
  id varchar(50) PRIMARY KEY,

  scatg_apusr varchar(50) NOT NULL,
  scatg_bsins varchar(50) NOT NULL,
  scatg_mcatg varchar(50) NOT NULL,
  scatg_scode varchar(50) NOT NULL,
  scatg_sname varchar(50) NOT NULL,
  
  -- optional

  -- default
  scatg_actve boolean NOT NULL DEFAULT true,
  scatg_crusr varchar(50) NOT NULL,
  scatg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scatg_upusr varchar(50) NOT NULL,
  scatg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scatg_rvnmr integer NOT NULL DEFAULT 1
);