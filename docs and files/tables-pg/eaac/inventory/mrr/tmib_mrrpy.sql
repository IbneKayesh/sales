--
-- Table structure for table tmib_mrrpy
-- mrr payments

CREATE TABLE tmib_mrrpy (
  id varchar(50) PRIMARY KEY,

  mrrpy_apusr VARCHAR(50) NOT NULL,
  mrrpy_bsins VARCHAR(50) NOT NULL,
  mrrpy_mrrmt VARCHAR(50) NOT NULL,
  mrrpy_pmode VARCHAR(50) NOT NULL,
  mrrpy_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrpy_pdamt decimal(18,6) DEFAULT 0.00,
  mrrpy_notes VARCHAR(50),
  -- default
  mrrpy_actve boolean NOT NULL DEFAULT true,
  mrrpy_crusr VARCHAR(50) NOT NULL,
  mrrpy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrpy_upusr VARCHAR(50) NOT NULL,
  mrrpy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrpy_rvnmr integer NOT NULL DEFAULT 1
);