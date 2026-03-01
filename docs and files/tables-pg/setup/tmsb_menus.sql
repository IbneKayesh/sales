
--
-- Table structure for table tmsb_menus
-- menus

CREATE TABLE tmsb_menus (
  id varchar(50) PRIMARY KEY,

  menus_mdule varchar(50) NOT NULL,
  menus_gname varchar(50) NOT NULL,
  menus_gicon varchar(50) NOT NULL,
  menus_mname varchar(50) NOT NULL,
  -- optional
  menus_pname varchar(50),
  menus_micon varchar(50),
  menus_mlink varchar(255),
  menus_notes varchar(255),
  -- default
  menus_odrby integer NOT NULL DEFAULT 0,
  menus_actve boolean NOT NULL DEFAULT true,
  menus_crusr varchar(50) NOT NULL,
  menus_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menus_upusr varchar(50) NOT NULL,
  menus_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menus_rvnmr integer NOT NULL DEFAULT 1
);