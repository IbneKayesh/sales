--
-- Table structure for table tmhb_wflow
-- Application Workflows (Workflows for Leave, Attendance Correction, Payroll Approval)
--

CREATE TABLE tmhb_wflow (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  wflow_users VARCHAR(50) NOT NULL,
  wflow_bsins VARCHAR(50) NOT NULL,
  wflow_ccode VARCHAR(50) NOT NULL,

  -- custom
  wflow_wcode VARCHAR(50) NOT NULL, -- workflow code
  wflow_wname VARCHAR(100) NOT NULL, -- workflow name
  wflow_aptyp VARCHAR(50) NOT NULL, -- application type [LEAVE, ATTENDANCE_CORRECTION, PAYROLL]
  wflow_notes VARCHAR(255), -- description / remarks

  -- default 2
  wflow_actve boolean NOT NULL DEFAULT true,
  wflow_crusr VARCHAR(50) NOT NULL,
  wflow_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wflow_upusr VARCHAR(50) NOT NULL,
  wflow_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wflow_rvnmr integer NOT NULL DEFAULT 1
);
