CREATE TABLE tmmb_prfoh (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  prfoh_users varchar(50) NOT NULL,
  prfoh_bsins varchar(50) NOT NULL,
  prfoh_promf varchar(50) NOT NULL,
  prfoh_bofoh varchar(50) NOT NULL,
  prfoh_items varchar(50) NOT NULL,
  prfoh_price varchar(50) NOT NULL,
  prfoh_units varchar(50) NOT NULL,

  -- custom
  prfoh_itype varchar(50) NOT NULL, --FOH
  prfoh_boqty decimal(18,6) DEFAULT 1,
  prfoh_borat decimal(18,6) DEFAULT 1,
  prfoh_foqty decimal(18,6) DEFAULT 1,
  prfoh_forat decimal(18,6) DEFAULT 1,
  prfoh_foval decimal(18,6) DEFAULT 1,
  prfoh_notes VARCHAR(50),
  prfoh_stock VARCHAR(50),
  prfoh_jrnlm VARCHAR(50),
  
  -- default 2
  prfoh_actve boolean NOT NULL DEFAULT true,
  prfoh_crusr varchar(50) NOT NULL,
  prfoh_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prfoh_upusr varchar(50) NOT NULL,
  prfoh_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prfoh_rvnmr integer NOT NULL DEFAULT 1
);