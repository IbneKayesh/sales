--
-- Table structure for table `tmsb_ustal`


CREATE TABLE tmsb_ustal (
  id varchar(50) PRIMARY KEY,
  
  ustal_users varchar(50) NOT NULL,
  ustal_bsins varchar(50) NOT NULL,
  ustal_scode varchar(50) NOT NULL,
  -- default
  ustal_actve boolean NOT NULL DEFAULT true,
  ustal_crusr varchar(50) NOT NULL,
  ustal_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ustal_upusr varchar(50) NOT NULL,
  ustal_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ustal_rvnmr integer NOT NULL DEFAULT 1
);