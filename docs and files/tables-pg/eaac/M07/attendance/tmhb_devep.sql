--
-- Table structure for table tmhb_devep
-- Attendance Device Employee Mapping (Device User ID / Card ID to Employee ID)
--

CREATE TABLE tmhb_devep (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  devep_users VARCHAR(50) NOT NULL,
  devep_bsins VARCHAR(50) NOT NULL,
  devep_ccode VARCHAR(50) NOT NULL,

  -- custom
  devep_devce VARCHAR(50) NOT NULL, -- attendance device id
  devep_emply VARCHAR(50) NOT NULL, -- employee id
  devep_dcode VARCHAR(50) NOT NULL, -- user / card id in the biometric machine
  devep_crdno VARCHAR(50), -- card number / rfid badge id
  devep_notes VARCHAR(255), -- remarks

  -- default 2
  devep_actve boolean NOT NULL DEFAULT true,
  devep_crusr VARCHAR(50) NOT NULL,
  devep_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  devep_upusr VARCHAR(50) NOT NULL,
  devep_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  devep_rvnmr integer NOT NULL DEFAULT 1
);
