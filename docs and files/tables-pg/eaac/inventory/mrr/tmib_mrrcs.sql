--
-- Table structure for table tmib_mrrcs
-- mrr costings

CREATE TABLE tmib_mrrcs (
  id varchar(50) PRIMARY KEY,

  mrrcs_apusr VARCHAR(50) NOT NULL,
  mrrcs_bsins VARCHAR(50) NOT NULL,
  mrrcs_mrrmt VARCHAR(50) NOT NULL,
  mrrcs_csmod VARCHAR(50) NOT NULL,
  mrrcs_clmod VARCHAR(50) NOT NULL,
  mrrcs_chead VARCHAR(50) NOT NULL,
  mrrcs_value decimal(18,6) DEFAULT 0.00,  
  mrrcs_notes VARCHAR(50),

  -- default
  mrrcs_actve boolean NOT NULL DEFAULT true,
  mrrcs_crusr VARCHAR(50) NOT NULL,
  mrrcs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrcs_upusr VARCHAR(50) NOT NULL,
  mrrcs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrcs_rvnmr integer NOT NULL DEFAULT 1
);