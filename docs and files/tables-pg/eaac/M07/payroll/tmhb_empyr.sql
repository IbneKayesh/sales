--
-- Table structure for table tmhb_empyr
-- Employee Payroll Summaries (Finalized monthly/period calculation per employee)
--

CREATE TABLE tmhb_empyr (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empyr_users VARCHAR(50) NOT NULL,
  empyr_bsins VARCHAR(50) NOT NULL,
  empyr_ccode VARCHAR(50) NOT NULL,

  -- custom
  empyr_pyrun VARCHAR(50) NOT NULL, -- payroll run id
  empyr_pyprd VARCHAR(50) NOT NULL, -- payroll period id
  empyr_emply VARCHAR(50) NOT NULL, -- employee id
  empyr_cldys integer NOT NULL DEFAULT 0, -- total calendar days in period
  empyr_schds integer NOT NULL DEFAULT 0, -- scheduled working days
  empyr_prsds decimal(5,2) NOT NULL DEFAULT 0.00, -- present days
  empyr_palds decimal(5,2) NOT NULL DEFAULT 0.00, -- paid leave days
  empyr_unpds decimal(5,2) NOT NULL DEFAULT 0.00, -- unpaid leave days
  empyr_absds decimal(5,2) NOT NULL DEFAULT 0.00, -- absent days
  empyr_wkods integer NOT NULL DEFAULT 0, -- weekly off days
  empyr_hldds integer NOT NULL DEFAULT 0, -- holiday days
  empyr_hlwds integer NOT NULL DEFAULT 0, -- holiday worked days
  empyr_payds decimal(5,2) NOT NULL DEFAULT 0.00, -- calculated total payable days
  empyr_wrkmn integer NOT NULL DEFAULT 0, -- total worked minutes
  empyr_ovtmn integer NOT NULL DEFAULT 0, -- total overtime minutes
  empyr_bascl decimal(18,4) NOT NULL DEFAULT 0.0000, -- basic salary
  empyr_grsal decimal(18,4) NOT NULL DEFAULT 0.0000, -- gross salary
  empyr_toten decimal(18,4) NOT NULL DEFAULT 0.0000, -- total earnings (basic + allowances + OT)
  empyr_totdd decimal(18,4) NOT NULL DEFAULT 0.0000, -- total deductions (absent + tax + advances)
  empyr_netpy decimal(18,4) NOT NULL DEFAULT 0.0000, -- net pay (earnings - deductions)
  empyr_stats VARCHAR(50) NOT NULL DEFAULT 'CALCULATED', -- status [CALCULATED, APPROVED, FINALIZED, PAID]
  empyr_notes VARCHAR(255), -- remarks

  -- default 2
  empyr_actve boolean NOT NULL DEFAULT true,
  empyr_crusr VARCHAR(50) NOT NULL,
  empyr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empyr_upusr VARCHAR(50) NOT NULL,
  empyr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empyr_rvnmr integer NOT NULL DEFAULT 1
);
