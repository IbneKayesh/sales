--
-- Table structure for table tmhb_lvapr
-- Leave Application Approvals (Multi-level approval log & audit history)
--

CREATE TABLE tmhb_lvapr (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvapr_users VARCHAR(50) NOT NULL,
  lvapr_bsins VARCHAR(50) NOT NULL,
  lvapr_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvapr_lvapp VARCHAR(50) NOT NULL, -- leave application id
  lvapr_aprby VARCHAR(50) NOT NULL, -- approver employee id
  lvapr_level integer NOT NULL DEFAULT 1, -- approval level (1, 2...)
  lvapr_acton VARCHAR(50) NOT NULL, -- action [APPROVE, REJECT, RETURN]
  lvapr_actdt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- action timestamp
  lvapr_notes VARCHAR(255), -- remarks / justification

  -- default 2
  lvapr_actve boolean NOT NULL DEFAULT true,
  lvapr_crusr VARCHAR(50) NOT NULL,
  lvapr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapr_upusr VARCHAR(50) NOT NULL,
  lvapr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapr_rvnmr integer NOT NULL DEFAULT 1
);
