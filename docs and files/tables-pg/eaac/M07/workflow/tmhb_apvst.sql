--
-- Table structure for table tmhb_apvst
-- Application Statuses (Lookup of states: Draft, Submitted, Approved, Rejected, Returned)
--

CREATE TABLE tmhb_apvst (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  apvst_users VARCHAR(50) NOT NULL,
  apvst_bsins VARCHAR(50) NOT NULL,
  apvst_ccode VARCHAR(50) NOT NULL,

  -- custom
  apvst_scode VARCHAR(50) NOT NULL, -- status code [DRAFT, SUBMITTED, APPROVED, REJECTED, RETURNED, CANCELLED]
  apvst_sname VARCHAR(100) NOT NULL, -- status display name
  apvst_aptyp VARCHAR(50) NOT NULL DEFAULT 'COMMON', -- application domain [COMMON, LEAVE, ATTENDANCE, PAYROLL]
  apvst_notes VARCHAR(255), -- description / remarks

  -- default 2
  apvst_actve boolean NOT NULL DEFAULT true,
  apvst_crusr VARCHAR(50) NOT NULL,
  apvst_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apvst_upusr VARCHAR(50) NOT NULL,
  apvst_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apvst_rvnmr integer NOT NULL DEFAULT 1
);
