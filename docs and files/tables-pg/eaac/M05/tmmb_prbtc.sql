CREATE TABLE tmmb_prbtc (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  prbtc_users varchar(50) NOT NULL,
  prbtc_bsins varchar(50) NOT NULL,
  prbtc_promf varchar(50) NOT NULL,
  prbtc_bosfg varchar(50) NOT NULL,
  prbtc_prsfg varchar(50) NOT NULL,
  prbtc_items varchar(50) NOT NULL,
  prbtc_units varchar(50) NOT NULL,

  -- custom
  prbtc_types varchar(50) NOT NULL, --RM/PM
  prbtc_group varchar(50) NOT NULL, --MAIN,CO,BY
  prbtc_batch varchar(50),
  prbtc_gaqty decimal(18,6) DEFAULT 0,
  prbtc_gbqty decimal(18,6) DEFAULT 0,
  prbtc_rjqty decimal(18,6) DEFAULT 0,
  prbtc_pbrat decimal(18,6) DEFAULT 1,
  prbtc_pbval decimal(18,6) DEFAULT 1,
  prbtc_dpart VARCHAR(50),
  prbtc_wkshf VARCHAR(50),
  prbtc_emply VARCHAR(50),
  prbtc_notes VARCHAR(50),
  
  -- default 2
  prbtc_actve boolean NOT NULL DEFAULT true,
  prbtc_crusr varchar(50) NOT NULL,
  prbtc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prbtc_upusr varchar(50) NOT NULL,
  prbtc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prbtc_rvnmr integer NOT NULL DEFAULT 1
);