--
-- Table structure for table tmhb_pyrcm
-- Employee Payroll Component Details (Itemized breakdown of earnings & deductions per employee payroll)
--

CREATE TABLE tmhb_pyrcm (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pyrcm_users VARCHAR(50) NOT NULL,
  pyrcm_bsins VARCHAR(50) NOT NULL,
  pyrcm_ccode VARCHAR(50) NOT NULL,

  -- custom
  pyrcm_empyr VARCHAR(50) NOT NULL, -- employee payroll id
  pyrcm_pycmp VARCHAR(50) NOT NULL, -- pay component id
  pyrcm_ctype VARCHAR(50) NOT NULL DEFAULT 'EARNING', -- component type [EARNING, DEDUCTION]
  pyrcm_quant decimal(10,2) DEFAULT 1.00, -- quantity / units (e.g. OT hours, absent days)
  pyrcm_rtval decimal(18,4) DEFAULT 0.0000, -- rate per unit
  pyrcm_amont decimal(18,4) NOT NULL DEFAULT 0.0000, -- calculated amount
  pyrcm_calrf VARCHAR(100), -- calculation formula / reference
  pyrcm_notes VARCHAR(255), -- remarks

  -- default 2
  pyrcm_actve boolean NOT NULL DEFAULT true,
  pyrcm_crusr VARCHAR(50) NOT NULL,
  pyrcm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyrcm_upusr VARCHAR(50) NOT NULL,
  pyrcm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pyrcm_rvnmr integer NOT NULL DEFAULT 1
);
