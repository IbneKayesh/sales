--
-- Table structure for table tmcb_rtlog
--

CREATE TABLE tmcb_rtlog (
  id varchar(50) PRIMARY KEY,

  rtlog_users varchar(50) NOT NULL,
  rtlog_bsins varchar(50) NOT NULL,
  rtlog_ccode varchar(50) NOT NULL,

  rtlog_route varchar(50) NOT NULL,
  rtlog_emply varchar(50) NOT NULL,
  rtlog_cntct varchar(50) NOT NULL,
  -- optional
  
  -- default
  rtlog_srial integer NOT NULL DEFAULT 1,
  rtlog_lgtim timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rtlog_notes varchar(50),
  rtlog_isodr boolean NOT NULL DEFAULT false,

  rtlog_actve boolean NOT NULL DEFAULT true,
  rtlog_crusr varchar(50) NOT NULL,
  rtlog_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rtlog_upusr varchar(50) NOT NULL,
  rtlog_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rtlog_rvnmr integer NOT NULL DEFAULT 1
);