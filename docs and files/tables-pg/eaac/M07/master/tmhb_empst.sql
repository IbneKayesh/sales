--
-- Table structure for table tmhb_empst
-- Employee Statuses (Active, Probation, Suspended, Resigned, Terminated, Retired, On Leave)
--

CREATE TABLE tmhb_empst (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empst_users VARCHAR(50) NOT NULL,
  empst_bsins VARCHAR(50) NOT NULL,
  empst_ccode VARCHAR(50) NOT NULL,

  -- custom
  empst_scode VARCHAR(50) NOT NULL, -- status code [ACTIVE, PROBATION, SUSPENDED, RESIGNED, TERMINATED, RETIRED]
  empst_sname VARCHAR(100) NOT NULL, -- status name
  empst_iswrk boolean NOT NULL DEFAULT true, -- is eligible for duty/work
  empst_notes VARCHAR(255), -- description / notes

  -- default 2
  empst_actve boolean NOT NULL DEFAULT true,
  empst_crusr VARCHAR(50) NOT NULL,
  empst_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empst_upusr VARCHAR(50) NOT NULL,
  empst_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empst_rvnmr integer NOT NULL DEFAULT 1
);
