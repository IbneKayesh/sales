--
-- Table structure for table tmob_invpy
-- mrr payments

CREATE TABLE tmob_invpy (
  id varchar(50) PRIMARY KEY,

  invpy_users VARCHAR(50) NOT NULL,
  invpy_bsins VARCHAR(50) NOT NULL,
  invpy_invcm VARCHAR(50) NOT NULL,
  invpy_party VARCHAR(50) NOT NULL,
  invpy_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invpy_pdamt decimal(18,6) DEFAULT 0.00,
  invpy_refno VARCHAR(50),
  invpy_notes VARCHAR(50),
  -- default
  invpy_actve boolean NOT NULL DEFAULT true,
  invpy_crusr VARCHAR(50) NOT NULL,
  invpy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invpy_upusr VARCHAR(50) NOT NULL,
  invpy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invpy_rvnmr integer NOT NULL DEFAULT 1
);