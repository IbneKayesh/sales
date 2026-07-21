CREATE TABLE tmmb_bofoh (
  
  -- default 1
  id varchar(50) PRIMARY KEY,
  bofoh_users varchar(50) NOT NULL,
  bofoh_bsins varchar(50) NOT NULL,
  bofoh_bommf varchar(50) NOT NULL,
  bofoh_items varchar(50) NOT NULL,
  bofoh_units varchar(50) NOT NULL,

  -- custom
  bofoh_types varchar(50) NOT NULL, --FOH
  bofoh_foqty decimal(18,6) DEFAULT 1,
  bofoh_forto decimal(18,6) DEFAULT 1,
  bofoh_forat decimal(18,6) DEFAULT 1,
  bofoh_foval decimal(18,6) DEFAULT 1,
  bofoh_notes VARCHAR(50),
  
  -- default 2
  bofoh_actve boolean NOT NULL DEFAULT true,
  bofoh_crusr varchar(50) NOT NULL,
  bofoh_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bofoh_upusr varchar(50) NOT NULL,
  bofoh_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bofoh_rvnmr integer NOT NULL DEFAULT 1
);