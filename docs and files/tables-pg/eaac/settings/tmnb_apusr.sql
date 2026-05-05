--
-- Table structure for table `tmnb_apusr`
-- master registration id



CREATE TABLE tmnb_apusr (
  id varchar(50) PRIMARY KEY,

  apusr_ucode varchar(50) NOT NULL UNIQUE,
  apusr_uname varchar(50) NOT NULL UNIQUE,
  apusr_addrs varchar(50) NOT NULL,
  apusr_cntrc varchar(50) NOT NULL,
  apusr_packg varchar(50) NOT NULL,
  apusr_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apusr_endat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apusr_blval decimal(18,6) NOT NULL DEFAULT 0,
  apusr_lspad decimal(18,6) NOT NULL DEFAULT 0,
  apusr_pydat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apusr_nousr integer NOT NULL DEFAULT 1,
  apusr_nobsn integer NOT NULL DEFAULT 1,

  -- optional
  apusr_notes varchar(100),

  -- default
  apusr_actve boolean NOT NULL DEFAULT true,
  apusr_crusr varchar(50) NOT NULL,
  apusr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apusr_upusr varchar(50) NOT NULL,
  apusr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apusr_rvnmr integer NOT NULL DEFAULT 1
);