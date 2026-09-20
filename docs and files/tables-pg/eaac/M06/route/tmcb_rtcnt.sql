--
-- Table structure for table tmcb_rtcnt
--

CREATE TABLE tmcb_rtcnt (
  id varchar(50) PRIMARY KEY,

  rtcnt_users varchar(50) NOT NULL,
  rtcnt_bsins varchar(50) NOT NULL,
  rtcnt_ccode varchar(50) NOT NULL,

  rtcnt_route varchar(50) NOT NULL,
  rtcnt_emply varchar(50) NOT NULL,
  rtcnt_cntct varchar(50) NOT NULL,
  -- optional
  -- default
  rtcnt_srial integer NOT NULL DEFAULT 1,

  rtcnt_actve boolean NOT NULL DEFAULT true,
  rtcnt_crusr varchar(50) NOT NULL,
  rtcnt_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rtcnt_upusr varchar(50) NOT NULL,
  rtcnt_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rtcnt_rvnmr integer NOT NULL DEFAULT 1
);