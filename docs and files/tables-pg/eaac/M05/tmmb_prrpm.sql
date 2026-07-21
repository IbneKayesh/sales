CREATE TABLE tmmb_borpm (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  prrpm_users varchar(50) NOT NULL,
  prrpm_bsins varchar(50) NOT NULL,
  prrpm_promf varchar(50) NOT NULL,
  prrpm_borpm varchar(50) NOT NULL,
  prrpm_items varchar(50) NOT NULL,
  prrpm_units varchar(50) NOT NULL,

  -- custom
  prrpm_types varchar(50) NOT NULL, --Type (RM/PM/SFG/FG)
  prrpm_rmqty decimal(18,6) DEFAULT 1,
  prrpm_rmrto decimal(18,6) DEFAULT 1,
  prrpm_rmrat decimal(18,6) DEFAULT 1,
  prrpm_rmval decimal(18,6) DEFAULT 1,
  prrpm_prqty decimal(18,6) DEFAULT 1,
  prrpm_prrto decimal(18,6) DEFAULT 1,
  prrpm_prrat decimal(18,6) DEFAULT 1,
  prrpm_prval decimal(18,6) DEFAULT 1,
  prrpm_ispst boolean NOT NULL DEFAULT false,
  prrpm_dpart VARCHAR(50),
  prrpm_notes VARCHAR(50),
  
  -- default 2
  prrpm_actve boolean NOT NULL DEFAULT true,
  prrpm_crusr varchar(50) NOT NULL,
  prrpm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prrpm_upusr varchar(50) NOT NULL,
  prrpm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prrpm_rvnmr integer NOT NULL DEFAULT 1
);