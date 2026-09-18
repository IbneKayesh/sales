--
-- Table structure for table tmob_odrpy
-- mrr payments

CREATE TABLE tmob_odrpy (
  id varchar(50) PRIMARY KEY,

  odrpy_users VARCHAR(50) NOT NULL,
  odrpy_bsins VARCHAR(50) NOT NULL,
  odrpy_odrdm VARCHAR(50) NOT NULL,
  odrpy_party VARCHAR(50) NOT NULL,
  odrpy_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrpy_pdamt decimal(18,6) DEFAULT 0.00,
  odrpy_refno VARCHAR(50),
  odrpy_notes VARCHAR(50),
  -- default
  odrpy_actve boolean NOT NULL DEFAULT true,
  odrpy_crusr VARCHAR(50) NOT NULL,
  odrpy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrpy_upusr VARCHAR(50) NOT NULL,
  odrpy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrpy_rvnmr integer NOT NULL DEFAULT 1
);