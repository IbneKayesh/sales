--
-- Table structure for table `tmnb_dpart`
-- short table



CREATE TABLE tmnb_dpart (
  id varchar(50) PRIMARY KEY,

  dpart_apusr varchar(50) NOT NULL,
  dpart_bsins varchar(50) NOT NULL,
  dpart_dcode varchar(50) NOT NULL,
  dpart_dname varchar(50) NOT NULL,
  dpart_ofadr varchar(100) NOT NULL,

  -- optional  
  dpart_emcap integer NOT NULL DEFAULT 1

  -- default
  dpart_actve boolean NOT NULL DEFAULT true,
  dpart_crusr varchar(50) NOT NULL,
  dpart_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_upusr varchar(50) NOT NULL,
  dpart_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_rvnmr integer NOT NULL DEFAULT 1
);