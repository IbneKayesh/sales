--
-- Table structure for table tmib_mgrup
--

CREATE TABLE tmib_mgrup (
  -- default 1
  id varchar(50) PRIMARY KEY,

  mgrup_users varchar(50) NOT NULL,
  mgrup_bsins varchar(50) NOT NULL,
  mgrup_ccode varchar(50) NOT NULL,
  mgrup_cname varchar(50) NOT NULL,
  -- optional
  -- default
  mgrup_actve boolean NOT NULL DEFAULT true,
  mgrup_crusr varchar(50) NOT NULL,
  mgrup_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mgrup_upusr varchar(50) NOT NULL,
  mgrup_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mgrup_rvnmr integer NOT NULL DEFAULT 1
);