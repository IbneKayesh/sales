--
-- Table structure for table tmhb_lvtyp
-- Leave Types (Casual, Sick, Annual/Earned, Maternity, Paternity, Unpaid/LWP)
--

CREATE TABLE tmhb_lvtyp (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvtyp_users VARCHAR(50) NOT NULL,
  lvtyp_bsins VARCHAR(50) NOT NULL,
  lvtyp_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvtyp_lcode VARCHAR(50) NOT NULL, -- leave type code [CASUAL, SICK, EARNED, MATERNITY, PATERNITY, UNPAID, COMPENSATORY]
  lvtyp_lname VARCHAR(100) NOT NULL, -- leave type name
  lvtyp_categ VARCHAR(50) NOT NULL DEFAULT 'ANNUAL', -- leave category [ANNUAL, LIFETIME, SPECIAL]
  lvtyp_ispad boolean NOT NULL DEFAULT true, -- is paid leave
  lvtyp_reqat boolean NOT NULL DEFAULT false, -- requires medical certificate / attachment
  lvtyp_reqrs boolean NOT NULL DEFAULT true, -- requires reason
  lvtyp_alwhd boolean NOT NULL DEFAULT true, -- allow half day leave
  lvtyp_alwcf boolean NOT NULL DEFAULT false, -- allow carry forward to next year
  lvtyp_alwmc boolean NOT NULL DEFAULT false, -- allow encashment
  lvtyp_gndrl VARCHAR(20) NOT NULL DEFAULT 'ALL', -- gender applicability [ALL, MALE, FEMALE]
  lvtyp_islft boolean NOT NULL DEFAULT false, -- lifetime based leave (e.g. Maternity 180 days, Paternity 90 days)
  lvtyp_notes VARCHAR(255), -- description / remarks

  -- default 2
  lvtyp_actve boolean NOT NULL DEFAULT true,
  lvtyp_crusr VARCHAR(50) NOT NULL,
  lvtyp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvtyp_upusr VARCHAR(50) NOT NULL,
  lvtyp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvtyp_rvnmr integer NOT NULL DEFAULT 1
);
