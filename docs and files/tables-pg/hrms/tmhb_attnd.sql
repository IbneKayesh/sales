--
-- Table structure for table tmhb_attnd
--

CREATE TABLE tmhb_attnd (
  id VARCHAR(50) PRIMARY KEY,

  attnd_users VARCHAR(50) NOT NULL,
  attnd_bsins VARCHAR(50) NOT NULL,
  attnd_emply VARCHAR(50) NOT NULL,
  attnd_wksft VARCHAR(50) NOT NULL,
  attnd_atdat date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_dname VARCHAR(20) NOT NULL,
  attnd_intim time,
  attnd_stsin VARCHAR(50),
  attnd_trmni VARCHAR(50),
  attnd_outim time,
  attnd_stsou VARCHAR(50),
  attnd_trmno VARCHAR(50),
  attnd_totwh integer NOT NULL DEFAULT 0,
  attnd_totoh integer NOT NULL DEFAULT 0,
  attnd_notes VARCHAR(50),
  attnd_sname VARCHAR(50),
  attnd_prsnt boolean NOT NULL DEFAULT false,
  attnd_paybl boolean NOT NULL DEFAULT false,
   -- default
  attnd_actve boolean NOT NULL DEFAULT true,
  attnd_crusr VARCHAR(50) NOT NULL,
  attnd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_upusr VARCHAR(50) NOT NULL,
  attnd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_rvnmr integer NOT NULL DEFAULT 1
);