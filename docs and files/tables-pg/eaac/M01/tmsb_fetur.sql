-- feature list
-- drop table tmsb_fetur;


CREATE TABLE tmsb_fetur (
      -- default 1
  id varchar(50) PRIMARY KEY,
  fetur_srial varchar(50) NOT NULL,
  fetur_fetur varchar(50) NOT NULL,

  -- custom
  fetur_cname varchar(50) NOT NULL,
  fetur_descr varchar(100),
  fetur_notes varchar(50) NULL,
  fetur_stats boolean NOT NULL DEFAULT false,

  -- default 2
  fetur_actve boolean NOT NULL DEFAULT true,
  fetur_crusr varchar(50) NOT NULL,
  fetur_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fetur_upusr varchar(50) NOT NULL,
  fetur_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fetur_rvnmr integer NOT NULL DEFAULT 1
);