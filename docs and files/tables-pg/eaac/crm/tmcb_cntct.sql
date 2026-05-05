--
-- Table structure for table tmcb_cntct
--

CREATE TABLE tmcb_cntct (
  id varchar(50) PRIMARY KEY,

  cntct_apusr varchar(50) NOT NULL,
  cntct_bsins varchar(50) NOT NULL,
  cntct_ctype varchar(50) NOT NULL,
  cntct_sorce varchar(50) NOT NULL,
  cntct_ccode varchar(50) NOT NULL,
  cntct_cntnm varchar(200) NOT NULL,
  cntct_cntps varchar(50) NOT NULL,
  cntct_cntno varchar(50) NOT NULL,
  
  -- optional 
  cntct_email varchar(50),
  cntct_tinno varchar(50),
  cntct_trade varchar(50),
  cntct_ofadr varchar(300),
  cntct_fcadr varchar(300),

  -- relations
  cntct_trtry varchar(50),
  cntct_tarea varchar(50),
  cntct_dzone varchar(50),
  cntct_cntry varchar(50) NOT NULL,
  cntct_cntad varchar(50),
  cntct_crncy varchar(50) NOT NULL,

  -- default
  cntct_dspct decimal(18,6) NOT NULL DEFAULT 0,
  cntct_crlmt decimal(18,6) NOT NULL DEFAULT 0,
  cntct_crbal decimal(18,6) NOT NULL DEFAULT 0,

  -- default
  cntct_actve boolean NOT NULL DEFAULT true,
  cntct_crusr varchar(50) NOT NULL,
  cntct_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntct_upusr varchar(50) NOT NULL,
  cntct_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntct_rvnmr integer NOT NULL DEFAULT 1
);