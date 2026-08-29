CREATE TABLE tmmb_prsfg (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  prsfg_users varchar(50) NOT NULL,
  prsfg_bsins varchar(50) NOT NULL,
  prsfg_promf varchar(50) NOT NULL,
  prsfg_bosfg varchar(50) NOT NULL,
  prsfg_items varchar(50) NOT NULL,
  prsfg_price varchar(50) NOT NULL,
  prsfg_units varchar(50) NOT NULL,

  -- custom
  prsfg_itype varchar(50) NOT NULL, --RM/PM
  prsfg_group varchar(50) NOT NULL, --MAIN,CO,BY
  prsfg_boqty decimal(18,6) DEFAULT 1,
  prsfg_borat decimal(18,6) DEFAULT 1, 
  prsfg_rtrto decimal(18,6) DEFAULT 1, 
  prsfg_fgqty decimal(18,6) DEFAULT 1,
  prsfg_fgrat decimal(18,6) DEFAULT 1,
  prsfg_fgval decimal(18,6) DEFAULT 1,
  prsfg_notes VARCHAR(50),
  prsfg_stock VARCHAR(50),
  prsfg_jrnlm VARCHAR(50),
  prsfg_refid VARCHAR(50),
  
  -- default 2
  prsfg_actve boolean NOT NULL DEFAULT true,
  prsfg_crusr varchar(50) NOT NULL,
  prsfg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prsfg_upusr varchar(50) NOT NULL,
  prsfg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prsfg_rvnmr integer NOT NULL DEFAULT 1
);