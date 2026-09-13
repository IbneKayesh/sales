--
-- Table structure for table tmhb_atnpl
-- Attendance Policies (Grace rules, late deduction rules, rounding rules)
--

CREATE TABLE tmhb_atnpl (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  atnpl_users VARCHAR(50) NOT NULL,
  atnpl_bsins VARCHAR(50) NOT NULL,
  atnpl_ccode VARCHAR(50) NOT NULL,

  -- custom
  atnpl_pcode VARCHAR(50) NOT NULL, -- policy code
  atnpl_pname VARCHAR(100) NOT NULL, -- policy name
  atnpl_islate boolean NOT NULL DEFAULT true, -- late tracking enabled
  atnpl_isearl boolean NOT NULL DEFAULT true, -- early out tracking enabled
  atnpl_ismspn boolean NOT NULL DEFAULT true, -- missing punch tracking enabled
  atnpl_mfdmn integer NOT NULL DEFAULT 480, -- default minimum full day minutes
  atnpl_mhdmn integer NOT NULL DEFAULT 240, -- default minimum half day minutes
  atnpl_rndrl VARCHAR(50) DEFAULT 'EXACT', -- rounding rule [EXACT, 15_MIN_ROUND, 30_MIN_ROUND]
  atnpl_ovtrl VARCHAR(50) DEFAULT 'STANDARD', -- overtime rule
  atnpl_notes VARCHAR(255), -- description / notes

  -- default 2
  atnpl_actve boolean NOT NULL DEFAULT true,
  atnpl_crusr VARCHAR(50) NOT NULL,
  atnpl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnpl_upusr VARCHAR(50) NOT NULL,
  atnpl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnpl_rvnmr integer NOT NULL DEFAULT 1
);
