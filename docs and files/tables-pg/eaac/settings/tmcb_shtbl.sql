--
-- Table structure for table `tmcb_shtbl`
-- short table



CREATE TABLE tmcb_shtbl (
  id varchar(50) PRIMARY KEY,

  shtbl_apusr varchar(50) NOT NULL,
  shtbl_gname varchar(50) NOT NULL,
  shtbl_dtext varchar(50) NOT NULL,
  shtbl_value varchar(50) NOT NULL,
  shtbl_dvalu varchar(50) NOT NULL,

  -- optional

  -- default
  shtbl_actve boolean NOT NULL DEFAULT true,
  shtbl_crusr varchar(50) NOT NULL,
  shtbl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  shtbl_upusr varchar(50) NOT NULL,
  shtbl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  shtbl_rvnmr integer NOT NULL DEFAULT 1
);