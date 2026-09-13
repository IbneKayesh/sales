--
-- Table structure for table tmhb_pyrun
-- Payroll Runs (Batch payroll calculation execution run)
--

CREATE TABLE tmhb_pyrun (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pyrun_users VARCHAR(50) NOT NULL,
  pyrun_bsins VARCHAR(50) NOT NULL,
  pyrun_ccode VARCHAR(50) NOT NULL,

  -- custom
  pyrun_pyprd VARCHAR(50) NOT NULL, -- payroll period id
  pyrun_runno integer NOT NULL DEFAULT 1, -- run number (for recalculations/re-runs)
  pyrun_stats VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- status [STARTED, IN_PROGRESS, COMPLETED, FAILED]
  pyrun_strtm timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- started timestamp
  pyrun_endtm timestamp, -- completed timestamp
  pyrun_prusr VARCHAR(50) NOT NULL, -- processed by user id
  pyrun_totem integer NOT NULL DEFAULT 0, -- total employees processed
  pyrun_totgr decimal(18,4) DEFAULT 0.0000, -- total gross salary
  pyrun_totnt decimal(18,4) DEFAULT 0.0000, -- total net payable salary
  pyrun_notes text, -- remarks / log notes

  -- default 2
  pyrun_actve boolean NOT NULL DEFAULT true,
  pyrun_crusr VARCHAR(50) NOT NULL,
  pyrun_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyrun_upusr VARCHAR(50) NOT NULL,
  pyrun_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyrun_rvnmr integer NOT NULL DEFAULT 1
);
