--
-- Table structure for table tmib_sgrup
--

CREATE TABLE tmib_sgrup (
  -- default 1
  id varchar(50) PRIMARY KEY,

  sgrup_users varchar(50) NOT NULL,
  sgrup_bsins varchar(50) NOT NULL,
  sgrup_ccode varchar(50) NOT NULL,
  sgrup_mgrup varchar(50) NOT NULL,
  sgrup_cname varchar(50) NOT NULL,
  
  -- optional

  -- default
  sgrup_actve boolean NOT NULL DEFAULT true,
  sgrup_crusr varchar(50) NOT NULL,
  sgrup_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sgrup_upusr varchar(50) NOT NULL,
  sgrup_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sgrup_rvnmr integer NOT NULL DEFAULT 1
);