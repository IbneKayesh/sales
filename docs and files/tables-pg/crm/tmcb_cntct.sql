--
-- Table structure for table tmcb_cntct
--

CREATE TABLE tmcb_cntct (
  id varchar(50) PRIMARY KEY,

  cntct_users varchar(50) NOT NULL,
  cntct_bsins varchar(50) NOT NULL,
  cntct_ctype varchar(50) NOT NULL,
  cntct_sorce varchar(50) NOT NULL,
  cntct_cntnm varchar(200) NOT NULL,
  -- optional
  cntct_cntps varchar(50) DEFAULT NULL,
  cntct_cntno varchar(50) DEFAULT NULL,
  cntct_email varchar(50) DEFAULT NULL,
  cntct_tinno varchar(50) DEFAULT NULL,
  cntct_trade varchar(50) DEFAULT NULL,
  cntct_ofadr varchar(300) DEFAULT NULL,
  cntct_fcadr varchar(300) DEFAULT NULL,
  cntct_tarea varchar(50) DEFAULT NULL,  
  cntct_dzone varchar(50) DEFAULT NULL,  
  cntct_cntry varchar(50) DEFAULT NULL,  
  cntct_cntad varchar(50) DEFAULT NULL,
  -- default
  cntct_dspct decimal(18,6) NOT NULL DEFAULT 0,
  cntct_crlmt decimal(18,6) NOT NULL DEFAULT 0,
  cntct_pybln decimal(18,6) NOT NULL DEFAULT 0,
  cntct_adbln decimal(18,6) NOT NULL DEFAULT 0,
  cntct_crbln decimal(18,6) NOT NULL DEFAULT 0,

  cntct_actve boolean NOT NULL DEFAULT true,
  cntct_crusr varchar(50) NOT NULL,
  cntct_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntct_upusr varchar(50) NOT NULL,
  cntct_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntct_rvnmr integer NOT NULL DEFAULT 1
);