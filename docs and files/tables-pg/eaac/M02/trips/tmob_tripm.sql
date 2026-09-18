--
-- Table structure for table tmob_tripm
-- sales delivery

CREATE TABLE tmob_tripm (
  -- default 1
  id varchar(50) PRIMARY KEY,
  tripm_users VARCHAR(50) NOT NULL,
  tripm_bsins VARCHAR(50) NOT NULL,
  tripm_dpart VARCHAR(50) NOT NULL,
  
  -- custom
  tripm_party VARCHAR(50) NOT NULL,
  tripm_trnno VARCHAR(50) NOT NULL,
  tripm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripm_trpmv VARCHAR(50),
  tripm_trpma VARCHAR(50),
  tripm_trpmb VARCHAR(50),
  tripm_notes VARCHAR(100),
  tripm_sorce VARCHAR(50) NOT NULL,
  tripm_lsdat timestamp NULL,
  tripm_blamt decimal(18,6) DEFAULT 0.00,
  tripm_ispnd boolean NOT NULL DEFAULT false,
  
  -- default 2
  tripm_actve boolean NOT NULL DEFAULT true,
  tripm_crusr varchar(50) NOT NULL,
  tripm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripm_upusr varchar(50) NOT NULL,
  tripm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripm_rvnmr integer NOT NULL DEFAULT 1
);