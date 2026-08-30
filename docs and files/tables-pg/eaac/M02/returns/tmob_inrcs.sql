--drop table tmob_inrcs;
--
-- Table structure for table tmob_inrcs
-- sales invoice return costings

CREATE TABLE tmob_inrcs (
  id varchar(50) PRIMARY KEY,

  inrcs_users VARCHAR(50) NOT NULL,
  inrcs_bsins VARCHAR(50) NOT NULL,
  inrcs_invrm VARCHAR(50) NOT NULL,
  inrcs_party VARCHAR(50) NOT NULL,
  inrcs_csmod VARCHAR(50) NOT NULL,
  inrcs_clmod VARCHAR(50) NOT NULL,
  inrcs_value decimal(18,6) DEFAULT 0.00,  
  inrcs_notes VARCHAR(50),
  inrcs_jrnlm VARCHAR(50), -- When Posted

  -- default
  inrcs_actve boolean NOT NULL DEFAULT true,
  inrcs_crusr VARCHAR(50) NOT NULL,
  inrcs_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  inrcs_upusr VARCHAR(50) NOT NULL,
  inrcs_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  inrcs_rvnmr integer NOT NULL DEFAULT 1
);