--
-- Table structure for table tmhb_desig
--

CREATE TABLE tmhb_desig (
  id VARCHAR(50) PRIMARY KEY,
  -- custom
  
  desig_users VARCHAR(50) NOT NULL,
  desig_bsins VARCHAR(50) NOT NULL,
  desig_ccode VARCHAR(50) NOT NULL,
  desig_cname VARCHAR(50) NOT NULL,
  desig_level integer NOT NULL DEFAULT 1,
  desig_sname VARCHAR(50) NOT NULL,
  desig_desig VARCHAR(50),

  -- default
  desig_actve boolean NOT NULL DEFAULT true,
  desig_crusr VARCHAR(50) NOT NULL,
  desig_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  desig_upusr VARCHAR(50) NOT NULL,
  desig_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  desig_rvnmr integer NOT NULL DEFAULT 1
);