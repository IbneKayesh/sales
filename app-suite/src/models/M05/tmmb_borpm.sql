CREATE TABLE tmmb_borpm (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  borpm_users varchar(50) NOT NULL,
  borpm_bsins varchar(50) NOT NULL,
  borpm_bommf varchar(50) NOT NULL,
  borpm_items varchar(50) NOT NULL,
  borpm_units varchar(50) NOT NULL,

  -- custom
  borpm_types varchar(50) NOT NULL, --Type (RM/PM/SFG/FG)
  borpm_rmqty decimal(18,6) DEFAULT 1,
  borpm_rmrto decimal(18,6) DEFAULT 1,
  borpm_rmrat decimal(18,6) DEFAULT 1,
  borpm_rmval decimal(18,6) DEFAULT 1,
  borpm_notes VARCHAR(50),
  
  -- default 2
  borpm_actve boolean NOT NULL DEFAULT true,
  borpm_crusr varchar(50) NOT NULL,
  borpm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  borpm_upusr varchar(50) NOT NULL,
  borpm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  borpm_rvnmr integer NOT NULL DEFAULT 1
);