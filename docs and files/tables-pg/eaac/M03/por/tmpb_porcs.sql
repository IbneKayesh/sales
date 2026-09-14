--
-- Table structure for table tmpb_porcs
-- mrr costings

CREATE TABLE tmpb_porcs (
  id varchar(50) PRIMARY KEY,

  porcs_users VARCHAR(50) NOT NULL,
  porcs_bsins VARCHAR(50) NOT NULL,
  porcs_pordm VARCHAR(50) NOT NULL,
  porcs_party VARCHAR(50) NOT NULL,
  porcs_csmod VARCHAR(50) NOT NULL,
  porcs_clmod VARCHAR(50) NOT NULL,
  porcs_value decimal(18,6) DEFAULT 0.00,  
  porcs_notes VARCHAR(50),
  porcs_jrnlm VARCHAR(50), -- When Posted

  -- default
  porcs_actve boolean NOT NULL DEFAULT true,
  porcs_crusr VARCHAR(50) NOT NULL,
  porcs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  porcs_upusr VARCHAR(50) NOT NULL,
  porcs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  porcs_rvnmr integer NOT NULL DEFAULT 1
);