--
-- Table structure for table tmhb_pycyc
-- Payroll Cycles (Pay cycle definition: Monthly 1st-30th, 16th-15th, Bi-weekly, Weekly)
--

CREATE TABLE tmhb_pycyc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pycyc_users VARCHAR(50) NOT NULL,
  pycyc_bsins VARCHAR(50) NOT NULL,
  pycyc_ccode VARCHAR(50) NOT NULL,

  -- custom
  pycyc_ccode_cyc VARCHAR(50) NOT NULL, -- cycle code (e.g. MONTHLY_STD, MID_MONTH, WEEKLY_FACTORY)
  pycyc_cname VARCHAR(100) NOT NULL, -- cycle name
  pycyc_freqn VARCHAR(50) NOT NULL DEFAULT 'MONTHLY', -- frequency [MONTHLY, SEMI_MONTHLY, BI_WEEKLY, WEEKLY]
  pycyc_strul VARCHAR(50) NOT NULL DEFAULT '1', -- period start day rule (e.g. 1, 16, or day of week)
  pycyc_enrul VARCHAR(50) NOT NULL DEFAULT 'LAST_DAY', -- period end day rule (e.g. LAST_DAY, 15, etc.)
  pycyc_notes VARCHAR(255), -- description / remarks

  -- default 2
  pycyc_actve boolean NOT NULL DEFAULT true,
  pycyc_crusr VARCHAR(50) NOT NULL,
  pycyc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pycyc_upusr VARCHAR(50) NOT NULL,
  pycyc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pycyc_rvnmr integer NOT NULL DEFAULT 1
);
