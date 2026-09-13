--
-- Table structure for table tmhb_wfstp
-- Application Workflow Steps (Sequence of approvers: Reporting Manager, HR, Dept Head)
--

CREATE TABLE tmhb_wfstp (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  wfstp_users VARCHAR(50) NOT NULL,
  wfstp_bsins VARCHAR(50) NOT NULL,
  wfstp_ccode VARCHAR(50) NOT NULL,

  -- custom
  wfstp_wflow VARCHAR(50) NOT NULL, -- workflow id
  wfstp_stpno integer NOT NULL, -- step sequence number (1, 2, 3...)
  wfstp_aprty VARCHAR(50) NOT NULL DEFAULT 'REPORTING_MANAGER', -- approver type [REPORTING_MANAGER, DEPARTMENT_HEAD, SPECIFIC_ROLE, SPECIFIC_USER]
  wfstp_aprrl VARCHAR(50), -- approver role code (if SPECIFIC_ROLE)
  wfstp_aprus VARCHAR(50), -- specific user id (if SPECIFIC_USER)
  wfstp_isreq boolean NOT NULL DEFAULT true, -- is mandatory step
  wfstp_notes VARCHAR(255), -- remarks

  -- default 2
  wfstp_actve boolean NOT NULL DEFAULT true,
  wfstp_crusr VARCHAR(50) NOT NULL,
  wfstp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wfstp_upusr VARCHAR(50) NOT NULL,
  wfstp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wfstp_rvnmr integer NOT NULL DEFAULT 1
);
