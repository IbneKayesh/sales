--
-- Table structure for table tmbo_dlvry
-- sales delivery

CREATE TABLE tmbo_dlvry (
  -- default 1
  id varchar(50) PRIMARY KEY,
  dlvry_users VARCHAR(50) NOT NULL,
  dlvry_bsins VARCHAR(50) NOT NULL,
  dlvry_ccode VARCHAR(50) NOT NULL,
  dlvry_cntct VARCHAR(50) NOT NULL,
  dlvry_refid VARCHAR(50) NOT NULL,
  
  -- custom
  dlvry_dlvan VARCHAR(50) NOT NULL,
  dlvry_spadr VARCHAR(250) NOT NULL,
  dlvry_spdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvry_exdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvry_dldat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvry_stats VARCHAR(50) NOT NULL,
  
  -- default 2
  dlvry_actve boolean NOT NULL DEFAULT true,
  dlvry_crusr varchar(50) NOT NULL,
  dlvry_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvry_upusr varchar(50) NOT NULL,
  dlvry_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dlvry_rvnmr integer NOT NULL DEFAULT 1
);