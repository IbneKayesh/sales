--
-- Table structure for table tmob_odrcs
-- mrr costings

CREATE TABLE tmob_odrcs (
  id varchar(50) PRIMARY KEY,

  odrcs_users VARCHAR(50) NOT NULL,
  odrcs_bsins VARCHAR(50) NOT NULL,
  odrcs_odrdm VARCHAR(50) NOT NULL,
  odrcs_party VARCHAR(50) NOT NULL,
  odrcs_csmod VARCHAR(50) NOT NULL,
  odrcs_clmod VARCHAR(50) NOT NULL,
  odrcs_value decimal(18,6) DEFAULT 0.00,  
  odrcs_notes VARCHAR(50),
  odrcs_jrnlm VARCHAR(50), -- When Posted

  -- default
  odrcs_actve boolean NOT NULL DEFAULT true,
  odrcs_crusr VARCHAR(50) NOT NULL,
  odrcs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrcs_upusr VARCHAR(50) NOT NULL,
  odrcs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrcs_rvnmr integer NOT NULL DEFAULT 1
);