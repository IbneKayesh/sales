--
-- Table structure for table tmib_mgrup
--

CREATE TABLE tmib_mgrup (
  id varchar(50) PRIMARY KEY,

  mgrup_apusr varchar(50) NOT NULL,
  mgrup_bsins varchar(50) NOT NULL,
  mgrup_mcode varchar(50) NOT NULL,
  mgrup_mname varchar(50) NOT NULL,
  -- optional
  -- default
  mgrup_actve boolean NOT NULL DEFAULT true,
  mgrup_crusr varchar(50) NOT NULL,
  mgrup_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mgrup_upusr varchar(50) NOT NULL,
  mgrup_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mgrup_rvnmr integer NOT NULL DEFAULT 1
);