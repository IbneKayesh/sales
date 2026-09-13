--
-- Table structure for table tmhb_emprs
-- Employee Roster Assignments (Assigning pattern to employee with start date)
--

CREATE TABLE tmhb_emprs (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emprs_users VARCHAR(50) NOT NULL,
  emprs_bsins VARCHAR(50) NOT NULL,
  emprs_ccode VARCHAR(50) NOT NULL,

  -- custom
  emprs_emply VARCHAR(50) NOT NULL, -- employee id
  emprs_rstpt VARCHAR(50) NOT NULL, -- roster pattern id
  emprs_efrmd date NOT NULL, -- effective from date
  emprs_etodt date, -- effective to date (null for indefinite)
  emprs_notes VARCHAR(255), -- remarks

  -- default 2
  emprs_actve boolean NOT NULL DEFAULT true,
  emprs_crusr VARCHAR(50) NOT NULL,
  emprs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emprs_upusr VARCHAR(50) NOT NULL,
  emprs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emprs_rvnmr integer NOT NULL DEFAULT 1
);
