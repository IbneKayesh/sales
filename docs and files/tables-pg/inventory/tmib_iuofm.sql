--
-- Table structure for table tmib_iuofm
--

CREATE TABLE tmib_iuofm (
  id varchar(50) PRIMARY KEY,

  iuofm_users varchar(50) NOT NULL,
  iuofm_untnm varchar(50) NOT NULL,

  -- optional
  iuofm_untgr varchar(50),

  -- default
  iuofm_actve boolean NOT NULL DEFAULT true,
  iuofm_crusr varchar(50) NOT NULL,
  iuofm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  iuofm_upusr varchar(50) NOT NULL,
  iuofm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  iuofm_rvnmr integer NOT NULL DEFAULT 1
);