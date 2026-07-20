
-- departments

CREATE TABLE tmsb_dpart (
    -- default 1
  id varchar(50) PRIMARY KEY,
  dpart_users varchar(50) NOT NULL,
  dpart_bsins varchar(50) NOT NULL,
  dpart_ccode varchar(50) NOT NULL,

-- custom
  dpart_cname varchar(50) NOT NULL,
  dpart_ofadr varchar(50),
  dpart_emcap integer NOT NULL DEFAULT 1,

  -- default 2
  dpart_actve boolean NOT NULL DEFAULT true,
  dpart_crusr varchar(50) NOT NULL,
  dpart_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_upusr varchar(50) NOT NULL,
  dpart_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_rvnmr integer NOT NULL DEFAULT 1
);