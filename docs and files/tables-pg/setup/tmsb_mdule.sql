
--
-- Table structure for table tmsb_mdule
-- application modules

CREATE TABLE tmsb_mdule (
  id varchar(50) PRIMARY KEY,

  mdule_mname varchar(50) NOT NULL,
  mdule_pname varchar(50) NOT NULL,

  -- optional
  mdule_micon varchar(50),
  mdule_color varchar(50),
  mdule_bcolr varchar(50),
  mdule_notes varchar(50),
  mdule_odrby integer NOT NULL DEFAULT 0,
  mdule_mview varchar(50) DEFAULT 'Web',

  -- default
  mdule_actve boolean NOT NULL DEFAULT true,
  mdule_crusr varchar(50) NOT NULL,
  mdule_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mdule_upusr varchar(50) NOT NULL,
  mdule_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mdule_rvnmr integer NOT NULL DEFAULT 1
);