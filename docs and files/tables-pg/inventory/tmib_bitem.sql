--
-- Table structure for table tmib_bitem
-- item master business

CREATE TABLE tmib_bitem (
  id varchar(50) PRIMARY KEY,

  bitem_users VARCHAR(50) NOT NULL,
  bitem_items VARCHAR(50) NOT NULL,
  bitem_bsins VARCHAR(50) NOT NULL,
  bitem_lprat decimal(20,6) DEFAULT 0.00,
  bitem_dprat decimal(20,6) DEFAULT 0.00,
  bitem_mcmrp decimal(20,6) DEFAULT 0.00,
  bitem_sddsp decimal(20,6) DEFAULT 0.00,
  bitem_snote VARCHAR(100),
  bitem_gstkq decimal(20,6) DEFAULT 0.00,
  bitem_bstkq decimal(20,6) DEFAULT 0.00,
  bitem_istkq decimal(20,6) DEFAULT 0.00,
  bitem_mnqty decimal(20,6) DEFAULT 1,
  bitem_mxqty decimal(20,6) DEFAULT 1,
  bitem_pbqty decimal(20,6) DEFAULT 0.00,
  bitem_sbqty decimal(20,6) DEFAULT 0.00,
  bitem_mpric decimal(20,6) DEFAULT 0.00,  
  bitem_jnote VARCHAR(300),
  -- default
  bitem_actve boolean NOT NULL DEFAULT true,
  bitem_crusr VARCHAR(50) NOT NULL,
  bitem_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bitem_upusr VARCHAR(50) NOT NULL,
  bitem_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bitem_rvnmr integer NOT NULL DEFAULT 1
);