--
-- Table structure for table tmhb_lvapp
-- Leave Applications (Employee leave submission & status tracking)
--

CREATE TABLE tmhb_lvapp (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvapp_users VARCHAR(50) NOT NULL,
  lvapp_bsins VARCHAR(50) NOT NULL,
  lvapp_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvapp_appno VARCHAR(50) NOT NULL, -- application number
  lvapp_emply VARCHAR(50) NOT NULL, -- employee id
  lvapp_lvtyp VARCHAR(50) NOT NULL, -- leave type id
  lvapp_frmdt date NOT NULL, -- from date
  lvapp_todat date NOT NULL, -- to date
  lvapp_totds decimal(5,2) NOT NULL, -- total leave days requested
  lvapp_hdtyp VARCHAR(20) DEFAULT 'NONE', -- half day type [NONE, FIRST_HALF, SECOND_HALF]
  lvapp_reasn VARCHAR(255) NOT NULL, -- leave reason
  lvapp_attch VARCHAR(255), -- document / medical certificate attachment file reference
  lvapp_stats VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- status [DRAFT, SUBMITTED, APPROVED, REJECTED, RETURNED]
  lvapp_retre VARCHAR(255), -- returned reason from supervisor (for employee to edit & resubmit)
  lvapp_sbmtm timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- submitted timestamp
  lvapp_aprby VARCHAR(50), -- approved by employee id
  lvapp_aprvm timestamp, -- approved timestamp
  lvapp_rejby VARCHAR(50), -- rejected by employee id
  lvapp_rejtm timestamp, -- rejected timestamp
  lvapp_notes VARCHAR(255), -- remarks

  -- default 2
  lvapp_actve boolean NOT NULL DEFAULT true,
  lvapp_crusr VARCHAR(50) NOT NULL,
  lvapp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapp_upusr VARCHAR(50) NOT NULL,
  lvapp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapp_rvnmr integer NOT NULL DEFAULT 1
);
