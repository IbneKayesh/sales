--
-- Table structure for table `tmnb_aprvl`
-- approval setup



CREATE TABLE tmnb_aprvl (
  id varchar(50) PRIMARY KEY,

  aprvl_apusr varchar(50) NOT NULL,
  aprvl_bsins varchar(50) NOT NULL,
  aprvl_table varchar(50) NOT NULL,
  aprvl_title varchar(50) NOT NULL,
  aprvl_users varchar(50) NOT NULL,
  aprvl_srlno integer NOT NULL DEFAULT 1,
  aprvl_isfnl boolean NOT NULL DEFAULT true,

  -- optional

  -- default
  aprvl_actve boolean NOT NULL DEFAULT true,
  aprvl_crusr varchar(50) NOT NULL,
  aprvl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aprvl_upusr varchar(50) NOT NULL,
  aprvl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aprvl_rvnmr integer NOT NULL DEFAULT 1
);