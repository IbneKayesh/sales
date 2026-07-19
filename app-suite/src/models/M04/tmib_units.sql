--
-- Table structure for table tmib_units
--

CREATE TABLE tmib_units (
  -- default 1
  id varchar(50) PRIMARY KEY,

  units_users varchar(50) NOT NULL,
  units_bsins varchar(50) NOT NULL,
  units_ccode varchar(50) NOT NULL,
  units_cname varchar(50) NOT NULL,

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

