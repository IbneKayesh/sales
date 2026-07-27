--
-- Table structure for table tmib_statr
-- item master business

CREATE TABLE tmib_statr (
  id varchar(50) PRIMARY KEY,

  statr_apusr VARCHAR(50) NOT NULL,
  statr_bsins VARCHAR(50) NOT NULL,
  statr_digrn VARCHAR(50) NOT NULL,
  statr_aname VARCHAR(50) NOT NULL,
  statr_value VARCHAR(50) NOT NULL,
  
  -- default
  statr_actve boolean NOT NULL DEFAULT true,
  statr_crusr VARCHAR(50) NOT NULL,
  statr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statr_upusr VARCHAR(50) NOT NULL,
  statr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statr_rvnmr integer NOT NULL DEFAULT 1
);