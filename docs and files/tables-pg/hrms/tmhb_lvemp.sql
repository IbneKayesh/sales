--
-- Table structure for table tmhb_lvemp
--

CREATE TABLE tmhb_lvemp (
  id VARCHAR(50) PRIMARY KEY,

  lvemp_users VARCHAR(50) NOT NULL,
  lvemp_bsins VARCHAR(50) NOT NULL,
  lvemp_atnst VARCHAR(50) NOT NULL,
  lvemp_emply VARCHAR(50) NOT NULL,
  lvemp_yerid integer NOT NULL DEFAULT 0,
  lvemp_nmbol integer NOT NULL DEFAULT 0,
  lvemp_cnsum integer NOT NULL DEFAULT 0,
  lvemp_blnce integer NOT NULL DEFAULT 0,

   -- default
  lvemp_actve boolean NOT NULL DEFAULT true,
  lvemp_crusr VARCHAR(50) NOT NULL,
  lvemp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvemp_upusr VARCHAR(50) NOT NULL,
  lvemp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvemp_rvnmr integer NOT NULL DEFAULT 1
);