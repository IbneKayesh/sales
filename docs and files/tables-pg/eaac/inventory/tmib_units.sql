--
-- Table structure for table tmib_units
--

CREATE TABLE tmib_units (
  id varchar(50) PRIMARY KEY,

  units_apusr varchar(50) NOT NULL,
  units_bsins varchar(50) NOT NULL,
  units_ucode varchar(50) NOT NULL,
  units_uname varchar(50) NOT NULL,

  -- optional
  units_untgr varchar(50), --will be short table

  -- default
  units_actve boolean NOT NULL DEFAULT true,
  units_crusr varchar(50) NOT NULL,
  units_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  units_upusr varchar(50) NOT NULL,
  units_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  units_rvnmr integer NOT NULL DEFAULT 1
);