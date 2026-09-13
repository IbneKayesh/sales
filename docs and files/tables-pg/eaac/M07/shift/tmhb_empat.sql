--
-- Table structure for table tmhb_empat
-- Employee Attendance Policy Assignments
--

CREATE TABLE tmhb_empat (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empat_users VARCHAR(50) NOT NULL,
  empat_bsins VARCHAR(50) NOT NULL,
  empat_ccode VARCHAR(50) NOT NULL,

  -- custom
  empat_emply VARCHAR(50) NOT NULL, -- employee id
  empat_atnpl VARCHAR(50) NOT NULL, -- attendance policy id
  empat_efrmd date NOT NULL, -- effective from date
  empat_etodt date, -- effective to date (null for ongoing)
  empat_notes VARCHAR(255), -- remarks

  -- default 2
  empat_actve boolean NOT NULL DEFAULT true,
  empat_crusr VARCHAR(50) NOT NULL,
  empat_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empat_upusr VARCHAR(50) NOT NULL,
  empat_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empat_rvnmr integer NOT NULL DEFAULT 1
);
