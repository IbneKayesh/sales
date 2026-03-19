--
-- Table structure for table tmcb_dlvan
--

CREATE TABLE tmcb_dlvan (
  id varchar(50) PRIMARY KEY,

  dlvan_users varchar(50) NOT NULL,
  dlvan_bsins varchar(50) NOT NULL,
  dlvan_distr varchar(50) NOT NULL,
  dlvan_vname varchar(50) NOT NULL,
  dlvan_dname varchar(50) DEFAULT NULL,

    -- default
  dlvan_actve boolean NOT NULL DEFAULT true,
  dlvan_crusr varchar(50) NOT NULL,
  dlvan_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvan_upusr varchar(50) NOT NULL,
  dlvan_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvan_rvnmr integer NOT NULL DEFAULT 1
);