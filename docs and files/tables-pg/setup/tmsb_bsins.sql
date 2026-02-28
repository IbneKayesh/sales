
--
-- Table structure for table tmsb_bsins
-- business shop/warehouse/

CREATE TABLE tmsb_bsins (
  id varchar(50) PRIMARY KEY,

  bsins_users varchar(255) NOT NULL,
  bsins_bname varchar(255) NOT NULL,

  -- optional
  bsins_addrs varchar(255),
  bsins_email varchar(255),
  bsins_cntct varchar(255),
  bsins_image varchar(255),
  bsins_binno varchar(255),
  bsins_btags varchar(255),
  bsins_cntry varchar(50),
  bsins_bstyp varchar(50),

  bsins_tstrn boolean NOT NULL DEFAULT true,
  bsins_prtrn boolean NOT NULL DEFAULT true,
  bsins_sltrn boolean NOT NULL DEFAULT true,

  -- default
  bsins_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_pbviw boolean NOT NULL DEFAULT false,
  bsins_actve boolean NOT NULL DEFAULT true,

  bsins_crusr varchar(50) NOT NULL,
  bsins_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_upusr varchar(50) NOT NULL,
  bsins_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_rvnmr integer NOT NULL DEFAULT 1,

  CONSTRAINT ix_bsins_users_bsins_bname UNIQUE (bsins_users, bsins_bname)
);