--
-- Table structure for table tmhb_emphs
-- Employee Job History / Timeline (Promotions, Transfers, Status Changes)
--

CREATE TABLE tmhb_emphs (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emphs_users VARCHAR(50) NOT NULL,
  emphs_bsins VARCHAR(50) NOT NULL,
  emphs_ccode VARCHAR(50) NOT NULL,

  -- custom
  emphs_emply VARCHAR(50) NOT NULL, -- employee id
  emphs_efdat date NOT NULL, -- effective date of change
  emphs_htype VARCHAR(50) NOT NULL, -- history change type [JOIN, PROMOTION, TRANSFER, INCREMENT, STATUS_CHANGE, RESIGNATION, TERMINATION]
  emphs_dpart VARCHAR(50), -- department id
  emphs_desig VARCHAR(50), -- designation id
  emphs_emptp VARCHAR(50), -- employment type id
  emphs_empst VARCHAR(50), -- employee status id
  emphs_mngid VARCHAR(50), -- supervisor / reporting manager employee id
  emphs_notes VARCHAR(255), -- remarks / rationale

  -- default 2
  emphs_actve boolean NOT NULL DEFAULT true,
  emphs_crusr VARCHAR(50) NOT NULL,
  emphs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emphs_upusr VARCHAR(50) NOT NULL,
  emphs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emphs_rvnmr integer NOT NULL DEFAULT 1
);
