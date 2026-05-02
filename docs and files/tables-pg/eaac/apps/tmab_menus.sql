
--
-- Table structure for table tmab_menus
-- menus
-- menus_pname [basic], menus_aname [web, mobile], menus_color [default], menus_mlink [-]

CREATE TABLE tmab_menus (
  id varchar(50) PRIMARY KEY,

  menus_pname varchar(50) NOT NULL,
  menus_aname varchar(50) NOT NULL,
  menus_mname varchar(50) NOT NULL,
  menus_color varchar(50) NOT NULL,
  menus_micon varchar(50) NOT NULL,
  menus_odrby integer NOT NULL DEFAULT 0,

  -- optional
  menus_notes varchar(255),
  menus_mlink varchar(100) NULL DEFAULT 'NA',
  menus_menus varchar(50) NULL DEFAULT 'NA',

  -- default
  menus_actve boolean NOT NULL DEFAULT true,
  menus_crusr varchar(50) NOT NULL,
  menus_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menus_upusr varchar(50) NOT NULL,
  menus_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menus_rvnmr integer NOT NULL DEFAULT 1
);