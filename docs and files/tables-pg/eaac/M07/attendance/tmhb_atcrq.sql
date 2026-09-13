--
-- Table structure for table tmhb_atcrq
-- Attendance Correction Requests (Employee missing punch / time correction application)
--

CREATE TABLE tmhb_atcrq (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  atcrq_users VARCHAR(50) NOT NULL,
  atcrq_bsins VARCHAR(50) NOT NULL,
  atcrq_ccode VARCHAR(50) NOT NULL,

  -- custom
  atcrq_emply VARCHAR(50) NOT NULL, -- employee id
  atcrq_reqno VARCHAR(50) NOT NULL, -- request application number
  atcrq_rqdat date NOT NULL, -- request submission date
  atcrq_atdat date NOT NULL, -- attendance target date
  atcrq_rtype VARCHAR(50) NOT NULL DEFAULT 'MISSING_PUNCH', -- request type [MISSING_IN, MISSING_OUT, BOTH_PUNCH, LATE_ADJUSTMENT]
  atcrq_reqin timestamp, -- requested actual IN datetime
  atcrq_reqou timestamp, -- requested actual OUT datetime
  atcrq_reasn VARCHAR(255) NOT NULL, -- employee reason
  atcrq_attch VARCHAR(255), -- supporting document attachment reference
  atcrq_stats VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- status [DRAFT, SUBMITTED, APPROVED, REJECTED, RETURNED]
  atcrq_retre VARCHAR(255), -- returned reason (for employee to edit & resubmit)
  atcrq_sbmtm timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- submitted timestamp
  atcrq_aprvm timestamp, -- approved timestamp
  atcrq_aprby VARCHAR(50), -- approved by employee id
  atcrq_notes VARCHAR(255), -- remarks

  -- default 2
  atcrq_actve boolean NOT NULL DEFAULT true,
  atcrq_crusr VARCHAR(50) NOT NULL,
  atcrq_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atcrq_upusr VARCHAR(50) NOT NULL,
  atcrq_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atcrq_rvnmr integer NOT NULL DEFAULT 1
);
