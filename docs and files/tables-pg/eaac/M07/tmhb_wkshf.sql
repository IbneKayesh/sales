--
-- Table structure for table tmhb_wkshf
--

CREATE TABLE tmhb_wkshf (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,

  wkshf_users VARCHAR(50) NOT NULL,
  wkshf_bsins VARCHAR(50) NOT NULL,
  wkshf_ccode VARCHAR(50) NOT NULL,

  -- custom
  wkshf_cname VARCHAR(50) NOT NULL,
  wkshf_bbstr integer NOT NULL DEFAULT 0,
  wkshf_satim time NOT NULL,
  wkshf_gsmin integer NOT NULL DEFAULT 0,
  wkshf_gemin integer NOT NULL DEFAULT 0,
  wkshf_entim time NOT NULL,
  wkshf_baend integer NOT NULL DEFAULT 0,

  wkshf_wkhrs integer NOT NULL DEFAULT 0,
  wkshf_mnhrs integer NOT NULL DEFAULT 0,
  wkshf_crday boolean NOT NULL DEFAULT false,
  wkshf_sgpnc boolean NOT NULL DEFAULT false,
  wkshf_ovrtm boolean NOT NULL DEFAULT false,

  -- default 2
  wkshf_actve boolean NOT NULL DEFAULT true,
  wkshf_crusr VARCHAR(50) NOT NULL,
  wkshf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkshf_upusr VARCHAR(50) NOT NULL,
  wkshf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkshf_rvnmr integer NOT NULL DEFAULT 1
);
