--
-- Table structure for table tmcb_trtry
--

CREATE TABLE tmcb_trtry (
  -- default 1
  id varchar(50) PRIMARY KEY,

  trtry_users varchar(50) NOT NULL,
  trtry_bsins varchar(50) NOT NULL,
  trtry_ccode varchar(50) NOT NULL,
  trtry_tarea varchar(50) NOT NULL,
  trtry_cname varchar(50) NOT NULL,

  -- default
  trtry_actve boolean NOT NULL DEFAULT true,
  trtry_crusr varchar(50) NOT NULL,
  trtry_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trtry_upusr varchar(50) NOT NULL,
  trtry_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trtry_rvnmr integer NOT NULL DEFAULT 1
);