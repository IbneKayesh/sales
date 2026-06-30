
-- business
-- business shop/warehouse/
-- Business Type Id	[Store, Warehosue, Factory]

CREATE TABLE tmsb_bsins (
    -- default 1
  id varchar(50) PRIMARY KEY,
  bsins_users varchar(50) NOT NULL,
  bsins_cntry varchar(50) NOT NULL,
  bsins_crncy varchar(50) NOT NULL,
  bsins_bstyp varchar(50) NOT NULL,
  bsins_ccode varchar(50) NOT NULL,

-- custom
  bsins_cname varchar(255) NOT NULL,
  bsins_addrs varchar(255) NOT NULL,
  bsins_email varchar(255),
  bsins_cntct varchar(255),
  bsins_image varchar(255),
  bsins_binno varchar(255),
  bsins_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_notes varchar(255),
  bsins_timzn varchar(50) NOT NULL,

  -- default 2
  bsins_actve boolean NOT NULL DEFAULT true,
  bsins_crusr varchar(50) NOT NULL,
  bsins_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_upusr varchar(50) NOT NULL,
  bsins_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bsins_rvnmr integer NOT NULL DEFAULT 1
);