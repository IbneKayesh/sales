--
-- Table structure for table tmpb_gratr
-- item master business

CREATE TABLE tmpb_gratr (
  id varchar(50) PRIMARY KEY,

  gratr_apusr VARCHAR(50) NOT NULL,
  gratr_bsins VARCHAR(50) NOT NULL,
  gratr_digrn VARCHAR(50) NOT NULL,
  gratr_aname VARCHAR(50) NOT NULL,
  gratr_value VARCHAR(50) NOT NULL,
  
  -- default
  gratr_actve boolean NOT NULL DEFAULT true,
  gratr_crusr VARCHAR(50) NOT NULL,
  gratr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gratr_upusr VARCHAR(50) NOT NULL,
  gratr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gratr_rvnmr integer NOT NULL DEFAULT 1
);