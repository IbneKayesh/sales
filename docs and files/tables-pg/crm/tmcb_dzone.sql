--
-- Table structure for table tmcb_dzone
--

CREATE TABLE tmcb_dzone (
  id varchar(50) PRIMARY KEY,

  dzone_users varchar(50) NOT NULL,
  dzone_bsins varchar(50) NOT NULL,
  dzone_cntry varchar(50) NOT NULL,
  dzone_dname varchar(50) NOT NULL,

    -- default
  dzone_actve boolean NOT NULL DEFAULT true,
  dzone_crusr varchar(50) NOT NULL,
  dzone_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dzone_upusr varchar(50) NOT NULL,
  dzone_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dzone_rvnmr integer NOT NULL DEFAULT 1
);