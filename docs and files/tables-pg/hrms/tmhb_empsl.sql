--
-- Table structure for table tmhb_empsl
--

CREATE TABLE tmhb_empsl (
  id VARCHAR(50) PRIMARY KEY,

  empsl_users VARCHAR(50) NOT NULL,
  empsl_bsins VARCHAR(50) NOT NULL,
  empsl_emply VARCHAR(50) NOT NULL,
  empsl_slcat VARCHAR(50) NOT NULL,
  empsl_cramt DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  empsl_dbamt DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  empsl_notes VARCHAR(50),

   -- default
  empsl_actve boolean NOT NULL DEFAULT true,
  empsl_crusr VARCHAR(50) NOT NULL,
  empsl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empsl_upusr VARCHAR(50) NOT NULL,
  empsl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empsl_rvnmr integer NOT NULL DEFAULT 1
);