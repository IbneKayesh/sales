-- drop TABLE tmib_attrb;
--
-- Table structure for table tmib_attrb
-- item attributes

CREATE TABLE tmib_attrb (
  id VARCHAR(50) PRIMARY KEY,

  attrb_apusr VARCHAR(50) NOT NULL,
  attrb_bsins VARCHAR(50) NOT NULL,
  attrb_mcatg VARCHAR(50) NOT NULL,
  attrb_acode VARCHAR(50) NOT NULL,
  attrb_aname VARCHAR(50) NOT NULL,
  attrb_dtype VARCHAR(50) NOT NULL,
  attrb_dvalu VARCHAR(300) NOT NULL,

  -- default
  attrb_actve boolean NOT NULL DEFAULT true,
  attrb_crusr VARCHAR(50) NOT NULL,
  attrb_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attrb_upusr VARCHAR(50) NOT NULL,
  attrb_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attrb_rvnmr integer NOT NULL DEFAULT 1
);