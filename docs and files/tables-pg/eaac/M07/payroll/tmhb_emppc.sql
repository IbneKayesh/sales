--
-- Table structure for table tmhb_emppc
-- Employee Payroll Cycle Assignments
--

CREATE TABLE tmhb_emppc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emppc_users VARCHAR(50) NOT NULL,
  emppc_bsins VARCHAR(50) NOT NULL,
  emppc_ccode VARCHAR(50) NOT NULL,

  -- custom
  emppc_emply VARCHAR(50) NOT NULL, -- employee id
  emppc_pycyc VARCHAR(50) NOT NULL, -- payroll cycle id
  emppc_efrmd date NOT NULL, -- effective from date
  emppc_etodt date, -- effective to date (null for ongoing)
  emppc_notes VARCHAR(255), -- remarks

  -- default 2
  emppc_actve boolean NOT NULL DEFAULT true,
  emppc_crusr VARCHAR(50) NOT NULL,
  emppc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emppc_upusr VARCHAR(50) NOT NULL,
  emppc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emppc_rvnmr integer NOT NULL DEFAULT 1
);
