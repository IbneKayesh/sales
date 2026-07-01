-- menu user
-- Table structure for table `tmsb_mnemp`
-- user menu permissions


CREATE TABLE tmsb_mnemp (
  id varchar(50) PRIMARY KEY,

  mnemp_emply varchar(50) NOT NULL,
  mnemp_menus varchar(50) NOT NULL,

  -- optional
  mnemp_extpr boolean NOT NULL DEFAULT false,
  mnemp_addpr boolean NOT NULL DEFAULT false,
  mnemp_edtpr boolean NOT NULL DEFAULT false,
  mnemp_delpr boolean NOT NULL DEFAULT false,
  -- relations

  -- default
  mnemp_actve boolean NOT NULL DEFAULT true,
  mnemp_crusr varchar(50) NOT NULL,
  mnemp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mnemp_upusr varchar(50) NOT NULL,
  mnemp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mnemp_rvnmr integer NOT NULL DEFAULT 1
);