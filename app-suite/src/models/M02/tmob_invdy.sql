--
-- Table structure for table tmob_invdy
-- mrr payments

CREATE TABLE tmob_invdy (
  id varchar(50) PRIMARY KEY,

  invdy_users VARCHAR(50) NOT NULL,
  invdy_bsins VARCHAR(50) NOT NULL,
  invdy_invcm VARCHAR(50) NOT NULL,
  invdy_cntct VARCHAR(50) NOT NULL,
  invdy_dlvan VARCHAR(50) NOT NULL,
  invdy_spadr VARCHAR(300) NOT NULL,
  invdy_spdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invdy_exdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invdy_dldat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invdy_stats VARCHAR(50),
  invdy_notes VARCHAR(100),
  
  -- default
  invdy_actve boolean NOT NULL DEFAULT true,
  invdy_crusr VARCHAR(50) NOT NULL,
  invdy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invdy_upusr VARCHAR(50) NOT NULL,
  invdy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invdy_rvnmr integer NOT NULL DEFAULT 1
);