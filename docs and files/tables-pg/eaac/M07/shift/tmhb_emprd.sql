--
-- Table structure for table tmhb_emprd
-- Employee Daily Duty Roster / Schedule (Generated / Published daily duty)
--

CREATE TABLE tmhb_emprd (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emprd_users VARCHAR(50) NOT NULL,
  emprd_bsins VARCHAR(50) NOT NULL,
  emprd_ccode VARCHAR(50) NOT NULL,

  -- custom
  emprd_emply VARCHAR(50) NOT NULL, -- employee id
  emprd_ddate date NOT NULL, -- duty date
  emprd_wkshf VARCHAR(50), -- assigned shift id (null if OFF)
  emprd_dtype VARCHAR(20) NOT NULL DEFAULT 'WORK', -- duty type [WORK, OFF, GENERAL]
  emprd_stype VARCHAR(20) NOT NULL DEFAULT 'ROSTER', -- source type [ROSTER, DEFAULT_SHIFT, MANUAL]
  emprd_srcid VARCHAR(50), -- source reference id
  emprd_ispbl boolean NOT NULL DEFAULT false, -- is published (published duty cannot be arbitrarily modified)
  emprd_pbdat timestamp, -- published timestamp
  emprd_notes VARCHAR(255), -- remarks

  -- default 2
  emprd_actve boolean NOT NULL DEFAULT true,
  emprd_crusr VARCHAR(50) NOT NULL,
  emprd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emprd_upusr VARCHAR(50) NOT NULL,
  emprd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emprd_rvnmr integer NOT NULL DEFAULT 1
);
