--
-- Table structure for table tmob_tripn
-- sales delivery

CREATE TABLE tmob_tripn (
  -- default 1
  id varchar(50) PRIMARY KEY,
  tripn_users VARCHAR(50) NOT NULL,
  tripn_bsins VARCHAR(50) NOT NULL,
  tripn_tripc VARCHAR(50) NOT NULL,
  
  -- custom
  tripn_notes VARCHAR(100) NOT NULL,
  tripn_nodat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- default 2
  tripn_actve boolean NOT NULL DEFAULT true,
  tripn_crusr varchar(50) NOT NULL,
  tripn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripn_upusr varchar(50) NOT NULL,
  tripn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripn_rvnmr integer NOT NULL DEFAULT 1
);