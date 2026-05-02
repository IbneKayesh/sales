
--
-- Table structure for table tmcb_bsins
-- business shop/warehouse/
-- Business Type Id	[Store, Warehosue, Factory]

CREATE TABLE tmcb_bsins (
  id varchar(50) PRIMARY KEY,

  bsins_bname varchar(255) NOT NULL,
  bsins_addrs varchar(255) NOT NULL,
  
    -- optional
  bsins_email varchar(255),
  bsins_cntct varchar(255),
  bsins_image varchar(255),
  bsins_binno varchar(255),
  bsins_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_notes varchar(255),
  bsins_agent boolean NOT NULL DEFAULT false,

  -- relations
  bsins_apusr varchar(50),
  bsins_cntry varchar(50),
  bsins_crncy varchar(50),
  bsins_bstyp varchar(50),

  -- default
  bsins_actve boolean NOT NULL DEFAULT true,
  bsins_crusr varchar(50) NOT NULL,
  bsins_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_upusr varchar(50) NOT NULL,
  bsins_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_rvnmr integer NOT NULL DEFAULT 1

  --CONSTRAINT ix_bsins_users_bsins_bname UNIQUE (bsins_users, bsins_bname)
);