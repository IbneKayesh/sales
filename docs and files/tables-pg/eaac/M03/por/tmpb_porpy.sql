--
-- Table structure for table tmpb_porpy
-- mrr payments

CREATE TABLE tmpb_porpy (
  id varchar(50) PRIMARY KEY,

  porpy_users VARCHAR(50) NOT NULL,
  porpy_bsins VARCHAR(50) NOT NULL,
  porpy_pordm VARCHAR(50) NOT NULL,
  porpy_party VARCHAR(50) NOT NULL,
  porpy_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  porpy_pdamt decimal(18,6) DEFAULT 0.00,
  porpy_refno VARCHAR(50),
  porpy_notes VARCHAR(50),
  -- default
  porpy_actve boolean NOT NULL DEFAULT true,
  porpy_crusr VARCHAR(50) NOT NULL,
  porpy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  porpy_upusr VARCHAR(50) NOT NULL,
  porpy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  porpy_rvnmr integer NOT NULL DEFAULT 1
);