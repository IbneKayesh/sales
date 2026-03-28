--
-- Table structure for table tmhb_wksft
--

CREATE TABLE tmhb_wksft (
  id VARCHAR(50) PRIMARY KEY,

  wksft_users VARCHAR(50) NOT NULL,
  wksft_bsins VARCHAR(50) NOT NULL,
  wksft_sftnm VARCHAR(50) NOT NULL,
  wksft_btbst integer NOT NULL DEFAULT 0,
  wksft_satim time NOT NULL,
  wksft_gsmin integer NOT NULL DEFAULT 0,
  wksft_gemin integer NOT NULL DEFAULT 0,
  wksft_entim time NOT NULL,
  wksft_btand integer NOT NULL DEFAULT 0,

  wksft_wrhrs integer NOT NULL DEFAULT 0,
  wksft_mnhrs integer NOT NULL DEFAULT 0,
  wksft_crday boolean NOT NULL DEFAULT false,
  wksft_sgpnc boolean NOT NULL DEFAULT false,
  wksft_ovrtm boolean NOT NULL DEFAULT false,

   -- default
  wksft_actve boolean NOT NULL DEFAULT true,
  wksft_crusr VARCHAR(50) NOT NULL,
  wksft_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wksft_upusr VARCHAR(50) NOT NULL,
  wksft_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wksft_rvnmr integer NOT NULL DEFAULT 1
);
