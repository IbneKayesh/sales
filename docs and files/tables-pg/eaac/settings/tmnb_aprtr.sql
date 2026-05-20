--
-- Table structure for table `tmnb_aprtr`
-- approval transaction



CREATE TABLE tmnb_aprtr (
  id varchar(50) PRIMARY KEY,

  aprtr_apusr varchar(50) NOT NULL,
  aprtr_bsins varchar(50) NOT NULL,
  aprtr_table varchar(50) NOT NULL,
  aprtr_refid varchar(50) NOT NULL,
  aprtr_users varchar(50) NOT NULL,
  aprtr_srlno integer NOT NULL DEFAULT 1,
  aprtr_isfnl boolean NOT NULL DEFAULT false,
  aprtr_usrfg boolean NOT NULL DEFAULT true,
  aprtr_apdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aprtr_notes varchar(50) NOT NULL,

  -- optional

  -- default
  aprtr_actve boolean NOT NULL DEFAULT true,
  aprtr_crusr varchar(50) NOT NULL,
  aprtr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aprtr_upusr varchar(50) NOT NULL,
  aprtr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aprtr_rvnmr integer NOT NULL DEFAULT 1
);