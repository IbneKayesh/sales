--
-- Table structure for table `tmsb_sectn`

CREATE TABLE tmsb_sectn (
      -- default 1
  id varchar(50) PRIMARY KEY,

  sectn_users varchar(50) NOT NULL,
  sectn_bsins varchar(50) NOT NULL,
  sectn_ccode varchar(50) NOT NULL,
  sectn_dpart varchar(50) NOT NULL,

  -- custom
  sectn_cname varchar(50) NOT NULL,
  sectn_ofadr varchar(100) NOT NULL,
  sectn_emcap integer NOT NULL DEFAULT 1,

  -- default 2
  sectn_actve boolean NOT NULL DEFAULT true,
  sectn_crusr varchar(50) NOT NULL,
  sectn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sectn_upusr varchar(50) NOT NULL,
  sectn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sectn_rvnmr integer NOT NULL DEFAULT 1
);