--
-- Table structure for table tmhb_atnlg
-- Raw Attendance Logs (Biometric punch logs received from machines)
--

CREATE TABLE tmhb_atnlg (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  atnlg_users VARCHAR(50) NOT NULL,
  atnlg_bsins VARCHAR(50) NOT NULL,
  atnlg_ccode VARCHAR(50) NOT NULL,

  -- custom
  atnlg_emply VARCHAR(50), -- employee id (resolved from device employee mapping)
  atnlg_devce VARCHAR(50), -- device id
  atnlg_dcode VARCHAR(50), -- device employee code / machine user id
  atnlg_crdno VARCHAR(50), -- card number (if RFID punch)
  atnlg_lgtim timestamp NOT NULL, -- punch datetime from machine
  atnlg_rcvtm timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- server received timestamp
  atnlg_trmnl VARCHAR(50), -- terminal identifier / source
  atnlg_rawdt text, -- raw payload from device
  atnlg_ispst boolean NOT NULL DEFAULT false, -- is processed into attendance sheet

  -- default 2
  atnlg_actve boolean NOT NULL DEFAULT true,
  atnlg_crusr VARCHAR(50) NOT NULL,
  atnlg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnlg_upusr VARCHAR(50) NOT NULL,
  atnlg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnlg_rvnmr integer NOT NULL DEFAULT 1
);
