--
-- Table structure for table tmhb_hlday
--

CREATE TABLE tmhb_hlday (
  id VARCHAR(50) PRIMARY KEY,

  hlday_users VARCHAR(50) NOT NULL,
  hlday_bsins VARCHAR(50) NOT NULL,
  hlday_yerid integer NOT NULL DEFAULT 0,
  hlday_hldat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlday_hldnm VARCHAR(50) NOT NULL,
  hlday_notes VARCHAR(50),
  
   -- default
  hlday_actve boolean NOT NULL DEFAULT true,
  hlday_crusr VARCHAR(50) NOT NULL,
  hlday_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlday_upusr VARCHAR(50) NOT NULL,
  hlday_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlday_rvnmr integer NOT NULL DEFAULT 1
);