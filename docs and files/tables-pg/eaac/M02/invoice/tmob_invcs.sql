--drop table tmob_invcs;
--
-- Table structure for table tmob_invcs
-- sales invoice costings

CREATE TABLE tmob_invcs (
  id varchar(50) PRIMARY KEY,

  invcs_users VARCHAR(50) NOT NULL,
  invcs_bsins VARCHAR(50) NOT NULL,
  invcs_invcm VARCHAR(50) NOT NULL,
  invcs_party VARCHAR(50) NOT NULL,
  invcs_csmod VARCHAR(50) NOT NULL,
  invcs_clmod VARCHAR(50) NOT NULL,
  invcs_value decimal(18,6) DEFAULT 0.00,  
  invcs_notes VARCHAR(50),
  invcs_jrnlm VARCHAR(50), -- When Posted

  -- default
  invcs_actve boolean NOT NULL DEFAULT true,
  invcs_crusr VARCHAR(50) NOT NULL,
  invcs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcs_upusr VARCHAR(50) NOT NULL,
  invcs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcs_rvnmr integer NOT NULL DEFAULT 1
);