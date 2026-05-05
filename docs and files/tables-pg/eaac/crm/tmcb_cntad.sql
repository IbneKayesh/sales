--
-- Table structure for table tmcb_cntad
--

CREATE TABLE tmcb_cntad (
  id varchar(50) PRIMARY KEY,

  cntad_apusr varchar(50) NOT NULL,
  cntad_bsins varchar(50) NOT NULL,
  cntad_cntct varchar(50) NOT NULL,
  cntad_cntps varchar(50) NOT NULL,
  cntad_cntno varchar(50) NOT NULL,
  cntad_email varchar(50),
  cntad_ofadr varchar(300) NOT NULL,
  cntad_notes varchar(300),
  
  -- optional 
  cntad_gmaps varchar(300),

  -- relations
  -- default
  cntad_actve boolean NOT NULL DEFAULT true,
  cntad_crusr varchar(50) NOT NULL,
  cntad_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntad_upusr varchar(50) NOT NULL,
  cntad_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntad_rvnmr integer NOT NULL DEFAULT 1
);