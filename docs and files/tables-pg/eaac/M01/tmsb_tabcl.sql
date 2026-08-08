--
-- Table structure for table `tmsb_tabcl`

CREATE TABLE tmsb_tabcl (
  id varchar(50) PRIMARY KEY,

  tabcl_users varchar(50) NOT NULL,
  tabcl_bsins varchar(50) NOT NULL,
  tabcl_ccode varchar(50) NOT NULL,
  tabcl_emply varchar(50),
  tabcl_cname varchar(50) NOT NULL,
  tabcl_table varchar(50) NOT NULL,
  tabcl_colmn varchar(50) NOT NULL,
  tabcl_title varchar(50) NOT NULL,
  tabcl_visbl  boolean NOT NULL DEFAULT true,
  tabcl_visbu  boolean NOT NULL DEFAULT true,

  -- default
  tabcl_actve boolean NOT NULL DEFAULT true,
  tabcl_crusr varchar(50) NOT NULL,
  tabcl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tabcl_upusr varchar(50) NOT NULL,
  tabcl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tabcl_rvnmr integer NOT NULL DEFAULT 1
);