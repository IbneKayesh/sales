--
-- Table structure for table tmib_trncs
-- transfer costings

CREATE TABLE tmib_trncs (
  id varchar(50) PRIMARY KEY,

  trncs_users VARCHAR(50) NOT NULL,
  trncs_bsins VARCHAR(50) NOT NULL,
  trncs_trnsm VARCHAR(50) NOT NULL,
  trncs_party VARCHAR(50) NOT NULL,
  trncs_csmod VARCHAR(50) NOT NULL,
  trncs_clmod VARCHAR(50) NOT NULL,
  trncs_value decimal(18,6) DEFAULT 0.00,  
  trncs_notes VARCHAR(50),
  trncs_jrnlm VARCHAR(50), -- When Posted

  -- default
  trncs_actve boolean NOT NULL DEFAULT true,
  trncs_crusr VARCHAR(50) NOT NULL,
  trncs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trncs_upusr VARCHAR(50) NOT NULL,
  trncs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trncs_rvnmr integer NOT NULL DEFAULT 1
);