--
-- Table structure for table tmcb_cntct
--

CREATE TABLE tmcb_cntct (
  -- default 1
  id varchar(50) PRIMARY KEY,
  cntct_users varchar(50) NOT NULL,
  cntct_bsins varchar(50) NOT NULL,
  cntct_ccode varchar(50) NOT NULL,

  -- custom
  cntct_ctype varchar(50) NOT NULL,
  cntct_sorce varchar(50) DEFAULT 'Local',
  cntct_cname varchar(200) NOT NULL,
  cntct_cntps varchar(50),
  cntct_cntno varchar(50) NOT NULL,
  
  -- optional 
  cntct_email varchar(50),
  cntct_tinno varchar(50),
  cntct_trade varchar(50),
  cntct_ofadr varchar(300),
  cntct_fcadr varchar(300),

  -- relations
  cntct_trtry varchar(50) DEFAULT 'DEFAULT',
  cntct_tarea varchar(50) DEFAULT 'DEFAULT',
  cntct_dzone varchar(50) DEFAULT 'DEFAULT',
  cntct_cntry varchar(50) DEFAULT 'Bangladesh',
  cntct_cntad varchar(50) DEFAULT 'DEFAULT',
  cntct_crncy varchar(50) DEFAULT 'BDT',

  -- default 2
  cntct_dspct decimal(18,6) NOT NULL DEFAULT 0,
  cntct_crlmt decimal(18,6) NOT NULL DEFAULT 0,
  cntct_crbal decimal(18,6) NOT NULL DEFAULT 0,

  cntct_pswrd varchar(50) DEFAULT 'vmart',
  cntct_recky varchar(50) DEFAULT 'vmart',
  cntct_islgn boolean NOT NULL DEFAULT false,

  -- default 3
  cntct_actve boolean NOT NULL DEFAULT true,
  cntct_crusr varchar(50) NOT NULL,
  cntct_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntct_upusr varchar(50) NOT NULL,
  cntct_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cntct_rvnmr integer NOT NULL DEFAULT 1
);