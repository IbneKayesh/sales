--
-- Table structure for table tmhb_empdf
-- Employee Default Shifts (for fixed/general schedule employees without roster)
--

CREATE TABLE tmhb_empdf (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empdf_users VARCHAR(50) NOT NULL,
  empdf_bsins VARCHAR(50) NOT NULL,
  empdf_ccode VARCHAR(50) NOT NULL,

  -- custom
  empdf_emply VARCHAR(50) NOT NULL, -- employee id
  empdf_wkshf VARCHAR(50) NOT NULL, -- default shift id
  empdf_efrmd date NOT NULL, -- effective from date
  empdf_etodt date, -- effective to date (null for ongoing)
  empdf_notes VARCHAR(255), -- remarks

  -- default 2
  empdf_actve boolean NOT NULL DEFAULT true,
  empdf_crusr VARCHAR(50) NOT NULL,
  empdf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empdf_upusr VARCHAR(50) NOT NULL,
  empdf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empdf_rvnmr integer NOT NULL DEFAULT 1
);
