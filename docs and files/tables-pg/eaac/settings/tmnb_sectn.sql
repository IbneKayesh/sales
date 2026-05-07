--
-- Table structure for table `tmnb_sectn`
-- short table



CREATE TABLE tmnb_sectn (
  id varchar(50) PRIMARY KEY,

  sectn_apusr varchar(50) NOT NULL,
  sectn_bsins varchar(50) NOT NULL,
  sectn_dpart varchar(50) NOT NULL,
  sectn_scode varchar(50) NOT NULL,
  sectn_sname varchar(50) NOT NULL,
  sectn_ofadr varchar(100) NOT NULL,

  -- optional  
  sectn_emcap integer NOT NULL DEFAULT 1,

  -- default
  sectn_actve boolean NOT NULL DEFAULT true,
  sectn_crusr varchar(50) NOT NULL,
  sectn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sectn_upusr varchar(50) NOT NULL,
  sectn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sectn_rvnmr integer NOT NULL DEFAULT 1
);