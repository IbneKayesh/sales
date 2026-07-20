CREATE TABLE tmmb_bosfg (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  bosfg_users varchar(50) NOT NULL,
  bosfg_bsins varchar(50) NOT NULL,
  bosfg_bommf varchar(50) NOT NULL,
  bosfg_items varchar(50) NOT NULL,
  bosfg_units varchar(50) NOT NULL,

  -- custom
  bosfg_types varchar(50) NOT NULL, --RM/PM
  bosfg_inout varchar(50) NOT NULL,
  bosfg_group varchar(50) NOT NULL, --MAIN,CO,BY
  bosfg_rmqty decimal(18,6) DEFAULT 1,
  bosfg_rmrto decimal(18,6) DEFAULT 1,
  bosfg_rmrat decimal(18,6) DEFAULT 1,
  bosfg_rmval decimal(18,6) DEFAULT 1,
  bosfg_notes VARCHAR(50),
  
  -- default 2
  bosfg_actve boolean NOT NULL DEFAULT true,
  bosfg_crusr varchar(50) NOT NULL,
  bosfg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bosfg_upusr varchar(50) NOT NULL,
  bosfg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bosfg_rvnmr integer NOT NULL DEFAULT 1
);