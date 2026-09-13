--
-- Table structure for table tmhb_pyadj
-- Payroll Adjustments (One-off bonuses, penalties, advance deductions, arrears)
--

CREATE TABLE tmhb_pyadj (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pyadj_users VARCHAR(50) NOT NULL,
  pyadj_bsins VARCHAR(50) NOT NULL,
  pyadj_ccode VARCHAR(50) NOT NULL,

  -- custom
  pyadj_empyr VARCHAR(50), -- employee payroll id (linked once payroll run created)
  pyadj_emply VARCHAR(50) NOT NULL, -- employee id
  pyadj_pyprd VARCHAR(50) NOT NULL, -- payroll period id
  pyadj_pycmp VARCHAR(50) NOT NULL, -- pay component id
  pyadj_atype VARCHAR(50) NOT NULL DEFAULT 'ADDITION', -- adjustment type [ADDITION, DEDUCTION]
  pyadj_amont decimal(18,4) NOT NULL DEFAULT 0.0000, -- adjustment amount
  pyadj_reasn VARCHAR(255) NOT NULL, -- reason / description
  pyadj_aprby VARCHAR(50), -- approved by user id
  pyadj_aprvm timestamp, -- approved timestamp
  pyadj_notes VARCHAR(255), -- remarks

  -- default 2
  pyadj_actve boolean NOT NULL DEFAULT true,
  pyadj_crusr VARCHAR(50) NOT NULL,
  pyadj_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyadj_upusr VARCHAR(50) NOT NULL,
  pyadj_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyadj_rvnmr integer NOT NULL DEFAULT 1
);
