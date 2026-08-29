CREATE TABLE tmmb_prrpm (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  prrpm_users varchar(50) NOT NULL,
  prrpm_bsins varchar(50) NOT NULL,
  prrpm_promf varchar(50) NOT NULL,
  prrpm_borpm varchar(50) NOT NULL,
  prrpm_items varchar(50) NOT NULL,
  prrpm_price varchar(50) NOT NULL,
  prrpm_units varchar(50) NOT NULL,

  -- custom
  prrpm_itype varchar(50) NOT NULL, --Type (RM/PM/SFG/FG)
  prrpm_boqty decimal(18,6) DEFAULT 1,
  prrpm_borat decimal(18,6) DEFAULT 1,
  prrpm_rmqty decimal(18,6) DEFAULT 1,
  prrpm_rmrat decimal(18,6) DEFAULT 1,
  prrpm_rmval decimal(18,6) DEFAULT 1,
  prrpm_notes VARCHAR(50),
  prrpm_stock VARCHAR(50),
  prrpm_jrnlm VARCHAR(50),
  
  -- default 2
  prrpm_actve boolean NOT NULL DEFAULT true,
  prrpm_crusr varchar(50) NOT NULL,
  prrpm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prrpm_upusr varchar(50) NOT NULL,
  prrpm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prrpm_rvnmr integer NOT NULL DEFAULT 1
);