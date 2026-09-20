--
-- Table structure for table tmcb_targt
--

CREATE TABLE tmcb_targt (
  id varchar(50) PRIMARY KEY,

  targt_users varchar(50) NOT NULL,
  targt_bsins varchar(50) NOT NULL,
  targt_ccode varchar(50) NOT NULL,

  targt_trtry varchar(50) NOT NULL,
  targt_route varchar(50) NOT NULL,
  targt_emply varchar(50) NOT NULL,
  targt_cntct varchar(50) NOT NULL,
  -- optional
  
  -- default
  targt_tgval decimal(18,6) NOT NULL DEFAULT 0,
  targt_acval decimal(18,6) NOT NULL DEFAULT 0,
  targt_frdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  targt_todat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  targt_notes varchar(50),

  targt_actve boolean NOT NULL DEFAULT true,
  targt_crusr varchar(50) NOT NULL,
  targt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  targt_upusr varchar(50) NOT NULL,
  targt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  targt_rvnmr integer NOT NULL DEFAULT 1
);