--
-- Table structure for table tmhb_atnxc
-- Attendance Exceptions (Missing punch, late threshold exceeded, anomalous logs)
--

CREATE TABLE tmhb_atnxc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  atnxc_users VARCHAR(50) NOT NULL,
  atnxc_bsins VARCHAR(50) NOT NULL,
  atnxc_ccode VARCHAR(50) NOT NULL,

  -- custom
  atnxc_emply VARCHAR(50) NOT NULL, -- employee id
  atnxc_attnd VARCHAR(50), -- attendance sheet id
  atnxc_xtype VARCHAR(50) NOT NULL, -- exception type [MISSING_IN, MISSING_OUT, UNEXPECTED_ABSENCE, EXCESSIVE_LATE, SINGLE_PUNCH]
  atnxc_xdate date NOT NULL, -- exception date
  atnxc_desc VARCHAR(255), -- description
  atnxc_stats VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- status [OPEN, RESOLVED, WAIVED]
  atnxc_resby VARCHAR(50), -- resolved by user id
  atnxc_resdt timestamp, -- resolved timestamp
  atnxc_resnt VARCHAR(255), -- resolution note

  -- default 2
  atnxc_actve boolean NOT NULL DEFAULT true,
  atnxc_crusr VARCHAR(50) NOT NULL,
  atnxc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnxc_upusr VARCHAR(50) NOT NULL,
  atnxc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnxc_rvnmr integer NOT NULL DEFAULT 1
);
