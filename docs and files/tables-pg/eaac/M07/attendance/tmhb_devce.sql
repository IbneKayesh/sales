--
-- Table structure for table tmhb_devce
-- Biometric / Time Attendance Devices
--

CREATE TABLE tmhb_devce (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  devce_users VARCHAR(50) NOT NULL,
  devce_bsins VARCHAR(50) NOT NULL,
  devce_ccode VARCHAR(50) NOT NULL,

  -- custom
  devce_dcode VARCHAR(50) NOT NULL, -- device code
  devce_dname VARCHAR(100) NOT NULL, -- device name / location description
  devce_dtype VARCHAR(50) NOT NULL DEFAULT 'BIOMETRIC', -- device type [FINGERPRINT, FACIAL, RFID_CARD, MOBILE]
  devce_ipadr VARCHAR(50), -- device IP address
  devce_portn integer, -- port number
  devce_apiur VARCHAR(255), -- API endpoint URL
  devce_apiid VARCHAR(100), -- API identifier / serial number
  devce_lsync timestamp, -- last sync timestamp
  devce_notes VARCHAR(255), -- remarks

  -- default 2
  devce_actve boolean NOT NULL DEFAULT true,
  devce_crusr VARCHAR(50) NOT NULL,
  devce_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  devce_upusr VARCHAR(50) NOT NULL,
  devce_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  devce_rvnmr integer NOT NULL DEFAULT 1
);
