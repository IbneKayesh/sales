--
-- Table structure for table tmhb_dpart
-- Departments
--

CREATE TABLE tmhb_dpart (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  dpart_users VARCHAR(50) NOT NULL,
  dpart_bsins VARCHAR(50) NOT NULL,
  dpart_ccode VARCHAR(50) NOT NULL,

  -- custom
  dpart_cname VARCHAR(100) NOT NULL, -- department name
  dpart_dcode VARCHAR(50), -- department code
  dpart_prntd VARCHAR(50), -- parent department id
  dpart_headm VARCHAR(50), -- department head employee id
  dpart_notes VARCHAR(255), -- description / remarks

  -- default 2
  dpart_actve boolean NOT NULL DEFAULT true,
  dpart_crusr VARCHAR(50) NOT NULL,
  dpart_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_upusr VARCHAR(50) NOT NULL,
  dpart_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_rvnmr integer NOT NULL DEFAULT 1
);
