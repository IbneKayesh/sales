--
-- Table structure for table tmcb_rutes
--

CREATE TABLE tmcb_rutes (
  id varchar(50) PRIMARY KEY,

  rutes_users varchar(50) NOT NULL,
  rutes_bsins varchar(50) NOT NULL,
  rutes_rname varchar(50) NOT NULL,
  rutes_dname varchar(50) NOT NULL,
  rutes_trtry varchar(50) NOT NULL,  
  -- optional
  -- default
  rutes_lvdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,


  rutes_actve boolean NOT NULL DEFAULT true,
  rutes_crusr varchar(50) NOT NULL,
  rutes_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rutes_upusr varchar(50) NOT NULL,
  rutes_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rutes_rvnmr integer NOT NULL DEFAULT 1
);