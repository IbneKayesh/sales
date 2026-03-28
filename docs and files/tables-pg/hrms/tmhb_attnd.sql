--
-- Table structure for table tmhb_attnd
--

CREATE TABLE tmhb_attnd (
  id VARCHAR(50) PRIMARY KEY,

  attnd_users VARCHAR(50) NOT NULL, --user
  attnd_bsins VARCHAR(50) NOT NULL, --busines
  attnd_emply VARCHAR(50) NOT NULL, --employee
  attnd_wksft VARCHAR(50) NOT NULL, --working shift
  attnd_atdat date NOT NULL DEFAULT CURRENT_TIMESTAMP, --date
  attnd_dname VARCHAR(20) NOT NULL, --day name
  attnd_intim time, --in time
  attnd_stsin VARCHAR(50), --in status
  attnd_trmni VARCHAR(50), --in terminal
  attnd_outim time, --out time
  attnd_stsou VARCHAR(50), --out staus
  attnd_trmno VARCHAR(50), --out terminal
  attnd_totwh integer NOT NULL DEFAULT 0, --total working hours
  attnd_totoh integer NOT NULL DEFAULT 0, --total overtime
  attnd_notes VARCHAR(50), --notes
  attnd_sname VARCHAR(50), --status name
  attnd_prsnt boolean NOT NULL DEFAULT false, --present
  attnd_paybl boolean NOT NULL DEFAULT false, --payable
   -- default
  attnd_actve boolean NOT NULL DEFAULT true,
  attnd_crusr VARCHAR(50) NOT NULL,
  attnd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_upusr VARCHAR(50) NOT NULL,
  attnd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_rvnmr integer NOT NULL DEFAULT 1
);