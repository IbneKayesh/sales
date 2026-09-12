--
-- Table structure for table tmpb_propy
-- mrr payments

CREATE TABLE tmpb_propy (
  id varchar(50) PRIMARY KEY,

  propy_users VARCHAR(50) NOT NULL,
  propy_bsins VARCHAR(50) NOT NULL,
  propy_prodm VARCHAR(50) NOT NULL,
  propy_party VARCHAR(50) NOT NULL,
  propy_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  propy_pdamt decimal(18,6) DEFAULT 0.00,
  propy_refno VARCHAR(50),
  propy_notes VARCHAR(50),
  -- default
  propy_actve boolean NOT NULL DEFAULT true,
  propy_crusr VARCHAR(50) NOT NULL,
  propy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  propy_upusr VARCHAR(50) NOT NULL,
  propy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  propy_rvnmr integer NOT NULL DEFAULT 1
);