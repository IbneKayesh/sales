--
-- Table structure for table tmhb_rstpt
-- Roster Patterns (Cyclic Shift Templates e.g., 7-day, 14-day rotation)
--

CREATE TABLE tmhb_rstpt (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  rstpt_users VARCHAR(50) NOT NULL,
  rstpt_bsins VARCHAR(50) NOT NULL,
  rstpt_ccode VARCHAR(50) NOT NULL,

  -- custom
  rstpt_rcode VARCHAR(50) NOT NULL, -- roster pattern code
  rstpt_rname VARCHAR(100) NOT NULL, -- roster pattern name
  rstpt_cdays integer NOT NULL DEFAULT 7, -- cycle length in days (e.g. 7 for weekly)
  rstpt_notes VARCHAR(255), -- description / notes

  -- default 2
  rstpt_actve boolean NOT NULL DEFAULT true,
  rstpt_crusr VARCHAR(50) NOT NULL,
  rstpt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rstpt_upusr VARCHAR(50) NOT NULL,
  rstpt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rstpt_rvnmr integer NOT NULL DEFAULT 1
);
