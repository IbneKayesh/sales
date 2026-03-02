--
-- Table structure for table tmib_ctgry
--

CREATE TABLE tmib_ctgry (
  id varchar(50) PRIMARY KEY,

  ctgry_users varchar(50) NOT NULL,
  ctgry_ctgnm varchar(50) NOT NULL,
  -- optional
  -- default
  ctgry_actve boolean NOT NULL DEFAULT true,
  ctgry_crusr varchar(50) NOT NULL,
  ctgry_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ctgry_upusr varchar(50) NOT NULL,
  ctgry_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ctgry_rvnmr integer NOT NULL DEFAULT 1
);