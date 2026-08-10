-- menu user
-- Table structure for table `tmsb_menup`
-- user menu permissions


CREATE TABLE tmsb_menup (
  id varchar(50) PRIMARY KEY,

  menup_users varchar(50) NOT NULL,
  menup_emply varchar(50) NOT NULL,
  menup_menus varchar(50) NOT NULL,

  -- optional
  menup_extpr boolean NOT NULL DEFAULT false,
  menup_addpr boolean NOT NULL DEFAULT false,
  menup_edtpr boolean NOT NULL DEFAULT false,
  menup_delpr boolean NOT NULL DEFAULT false,
  -- relations

  -- default
  menup_actve boolean NOT NULL DEFAULT true,
  menup_crusr varchar(50) NOT NULL,
  menup_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menup_upusr varchar(50) NOT NULL,
  menup_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menup_rvnmr integer NOT NULL DEFAULT 1
);