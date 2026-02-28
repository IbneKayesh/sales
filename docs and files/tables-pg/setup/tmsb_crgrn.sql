--
-- Table structure for table tmsb_crgrn
--

CREATE TABLE tmsb_crgrn (
  id varchar(50) PRIMARY KEY,

  crgrn_users varchar(50) NOT NULL,
  crgrn_bsins varchar(50) NOT NULL,
  crgrn_tblnm varchar(50) NOT NULL,
  -- optional
  crgrn_tbltx varchar(50),
  crgrn_refno varchar(50),
  -- default
  crgrn_dbgrn decimal(18,6) NOT NULL DEFAULT 0,
  crgrn_crgrn decimal(18,6) NOT NULL DEFAULT 0,
  crgrn_isdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crgrn_xpdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crgrn_actve boolean NOT NULL DEFAULT true,
  crgrn_crusr varchar(50) NOT NULL,
  crgrn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crgrn_upusr varchar(50) NOT NULL,
  crgrn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crgrn_rvnmr integer NOT NULL DEFAULT 1
);