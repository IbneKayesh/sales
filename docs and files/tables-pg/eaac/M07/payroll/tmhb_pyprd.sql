--
-- Table structure for table tmhb_pyprd
-- Payroll Periods (Generated periods per cycle e.g., 2026-09-01 to 2026-09-30)
--

CREATE TABLE tmhb_pyprd (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pyprd_users VARCHAR(50) NOT NULL,
  pyprd_bsins VARCHAR(50) NOT NULL,
  pyprd_ccode VARCHAR(50) NOT NULL,

  -- custom
  pyprd_pycyc VARCHAR(50) NOT NULL, -- payroll cycle id
  pyprd_pcode VARCHAR(50) NOT NULL, -- period code (e.g. SEP-2026)
  pyprd_strdt date NOT NULL, -- period start date
  pyprd_enddt date NOT NULL, -- period end date
  pyprd_paydt date, -- payment date
  pyprd_stats VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- status [OPEN, PROCESSING, APPROVED, FINALIZED, LOCKED]
  pyprd_caltm timestamp, -- calculated timestamp
  pyprd_aprvm timestamp, -- approved timestamp
  pyprd_fnlzm timestamp, -- finalized/locked timestamp
  pyprd_aprby VARCHAR(50), -- approved by user id
  pyprd_notes VARCHAR(255), -- remarks

  -- default 2
  pyprd_actve boolean NOT NULL DEFAULT true,
  pyprd_crusr VARCHAR(50) NOT NULL,
  pyprd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyprd_upusr VARCHAR(50) NOT NULL,
  pyprd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyprd_rvnmr integer NOT NULL DEFAULT 1
);
