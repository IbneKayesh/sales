--
-- Table structure for table tmhb_pslip
-- Payslips (Generated payslip records with reference and generation audit)
--

CREATE TABLE tmhb_pslip (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  pslip_users VARCHAR(50) NOT NULL,
  pslip_bsins VARCHAR(50) NOT NULL,
  pslip_ccode VARCHAR(50) NOT NULL,

  -- custom
  pslip_empyr VARCHAR(50) NOT NULL, -- employee payroll id
  pslip_emply VARCHAR(50) NOT NULL, -- employee id
  pslip_pyprd VARCHAR(50) NOT NULL, -- payroll period id
  pslip_psnum VARCHAR(50) NOT NULL, -- payslip number (e.g. PSL-202609-001)
  pslip_gendt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- generated datetime
  pslip_filrf VARCHAR(255), -- generated PDF/document file reference
  pslip_isiss boolean NOT NULL DEFAULT true, -- is issued / published to employee
  pslip_notes VARCHAR(255), -- remarks

  -- default 2
  pslip_actve boolean NOT NULL DEFAULT true,
  pslip_crusr VARCHAR(50) NOT NULL,
  pslip_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pslip_upusr VARCHAR(50) NOT NULL,
  pslip_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pslip_rvnmr integer NOT NULL DEFAULT 1
);
