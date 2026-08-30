--drop  table tmob_inrpy;
--
-- Table structure for table tmob_inrpy
-- sales invoice return payments

CREATE TABLE tmob_inrpy (
  id varchar(50) PRIMARY KEY,

  inrpy_users VARCHAR(50) NOT NULL,
  inrpy_bsins VARCHAR(50) NOT NULL,
  inrpy_invrm VARCHAR(50) NOT NULL,
  inrpy_party VARCHAR(50) NOT NULL,
  inrpy_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  inrpy_pdamt decimal(18,6) DEFAULT 0.00,
  inrpy_refno VARCHAR(50),
  inrpy_notes VARCHAR(50),
  -- default
  inrpy_actve boolean NOT NULL DEFAULT true,
  inrpy_crusr VARCHAR(50) NOT NULL,
  inrpy_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  inrpy_upusr VARCHAR(50) NOT NULL,
  inrpy_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  inrpy_rvnmr integer NOT NULL DEFAULT 1
);