--
-- Table structure for table `tmsb_istal`

CREATE TABLE tmsb_istal (
  id varchar(50) PRIMARY KEY,

  istal_scode varchar(50) NOT NULL UNIQUE,
  istal_sname varchar(50) NOT NULL,  
  istal_level integer NOT NULL DEFAULT 0,
  istal_notes varchar(255),
  istal_usrbs varchar(10) DEFAULT 'USER',

  -- default
  istal_actve boolean NOT NULL DEFAULT true,
  istal_crusr varchar(50) NOT NULL,
  istal_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  istal_upusr varchar(50) NOT NULL,
  istal_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  istal_rvnmr integer NOT NULL DEFAULT 1
);