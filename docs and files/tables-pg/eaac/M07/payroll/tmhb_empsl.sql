--
-- Table structure for table tmhb_empsl
-- Employee Salary (Base compensation and assigned salary structure)
--

CREATE TABLE tmhb_empsl (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empsl_users VARCHAR(50) NOT NULL,
  empsl_bsins VARCHAR(50) NOT NULL,
  empsl_ccode VARCHAR(50) NOT NULL,

  -- custom
  empsl_emply VARCHAR(50) NOT NULL, -- employee id
  empsl_slstr VARCHAR(50) NOT NULL, -- salary structure id
  empsl_bascl decimal(18,4) NOT NULL DEFAULT 0.0000, -- basic salary
  empsl_grsal decimal(18,4) DEFAULT 0.0000, -- gross salary
  empsl_crncy VARCHAR(10) NOT NULL DEFAULT 'BDT', -- currency code
  empsl_efrmd date NOT NULL, -- effective from date
  empsl_etodt date, -- effective to date (null for current)
  empsl_notes VARCHAR(255), -- remarks

  -- default 2
  empsl_actve boolean NOT NULL DEFAULT true,
  empsl_crusr VARCHAR(50) NOT NULL,
  empsl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empsl_upusr VARCHAR(50) NOT NULL,
  empsl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empsl_rvnmr integer NOT NULL DEFAULT 1
);
