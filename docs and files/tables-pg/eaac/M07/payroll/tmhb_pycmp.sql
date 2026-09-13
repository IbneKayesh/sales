--
-- Table structure for table tmhb_pycmp
-- Pay Components (Basic, House Rent, Medical, Conveyance, Overtime, Absent Deduction, Tax, Advance, etc.)
--

CREATE TABLE tmhb_pycmp (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pycmp_users VARCHAR(50) NOT NULL,
  pycmp_bsins VARCHAR(50) NOT NULL,
  pycmp_ccode VARCHAR(50) NOT NULL,

  -- custom
  pycmp_ccode_cmp VARCHAR(50) NOT NULL, -- component code (e.g. BASIC, HRENT, MEDCL, CONVY, OVRTM, ABSNT_DED, TAX, ADV_DED)
  pycmp_cname VARCHAR(100) NOT NULL, -- component name
  pycmp_ctype VARCHAR(50) NOT NULL DEFAULT 'EARNING', -- component type [EARNING, DEDUCTION]
  pycmp_cltyp VARCHAR(50) NOT NULL DEFAULT 'FIXED', -- calculation basis [FIXED, PERCENTAGE_OF_BASIC, PERCENTAGE_OF_GROSS, ATTENDANCE_BASED, FORMULA]
  pycmp_istax boolean NOT NULL DEFAULT false, -- is taxable
  pycmp_notes VARCHAR(255), -- description / remarks

  -- default 2
  pycmp_actve boolean NOT NULL DEFAULT true,
  pycmp_crusr VARCHAR(50) NOT NULL,
  pycmp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pycmp_upusr VARCHAR(50) NOT NULL,
  pycmp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pycmp_rvnmr integer NOT NULL DEFAULT 1
);
