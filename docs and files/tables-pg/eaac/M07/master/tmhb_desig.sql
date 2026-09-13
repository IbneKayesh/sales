--
-- Table structure for table tmhb_desig
-- Designations
--

CREATE TABLE tmhb_desig (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  desig_users VARCHAR(50) NOT NULL,
  desig_bsins VARCHAR(50) NOT NULL,
  desig_ccode VARCHAR(50) NOT NULL,

  -- custom
  desig_cname VARCHAR(100) NOT NULL, -- designation name
  desig_sname VARCHAR(50), -- short name / code
  desig_level integer NOT NULL DEFAULT 1, -- hierarchy level
  desig_notes VARCHAR(255), -- description / notes

  -- default 2
  desig_actve boolean NOT NULL DEFAULT true,
  desig_crusr VARCHAR(50) NOT NULL,
  desig_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  desig_upusr VARCHAR(50) NOT NULL,
  desig_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  desig_rvnmr integer NOT NULL DEFAULT 1
);
