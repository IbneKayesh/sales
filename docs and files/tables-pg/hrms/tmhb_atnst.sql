--
-- Table structure for table tmhb_atnst
--

CREATE TABLE tmhb_atnst (
  id VARCHAR(50) PRIMARY KEY,

  atnst_users VARCHAR(50) NOT NULL,
  atnst_bsins VARCHAR(50) NOT NULL,
  atnst_sname VARCHAR(50) NOT NULL,
  atnst_prsnt boolean NOT NULL DEFAULT true,
  atnst_paybl boolean NOT NULL DEFAULT true,
  atnst_nappl integer NOT NULL DEFAULT 0,
  atnst_color VARCHAR(50),

   -- default
  atnst_actve boolean NOT NULL DEFAULT true,
  atnst_crusr VARCHAR(50) NOT NULL,
  atnst_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnst_upusr VARCHAR(50) NOT NULL,
  atnst_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnst_rvnmr integer NOT NULL DEFAULT 1
);