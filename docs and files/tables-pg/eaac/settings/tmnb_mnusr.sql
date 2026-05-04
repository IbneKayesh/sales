--
-- Table structure for table `tmnb_mnusr`
-- user menu permissions


CREATE TABLE tmnb_mnusr (
  id varchar(50) PRIMARY KEY,

  mnusr_users varchar(50) NOT NULL,
  mnusr_menus varchar(50) NOT NULL,

  -- optional
  mnusr_extpr boolean NOT NULL DEFAULT false,
  mnusr_addpr boolean NOT NULL DEFAULT false,
  mnusr_edtpr boolean NOT NULL DEFAULT false,
  mnusr_delpr boolean NOT NULL DEFAULT false,
  -- relations

  -- default
  mnusr_actve boolean NOT NULL DEFAULT true,
  mnusr_crusr varchar(50) NOT NULL,
  mnusr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mnusr_upusr varchar(50) NOT NULL,
  mnusr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mnusr_rvnmr integer NOT NULL DEFAULT 1
);