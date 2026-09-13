--
-- Table structure for table tmhb_emphc
-- Employee Holiday Calendar Assignments
--

CREATE TABLE tmhb_emphc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emphc_users VARCHAR(50) NOT NULL,
  emphc_bsins VARCHAR(50) NOT NULL,
  emphc_ccode VARCHAR(50) NOT NULL,

  -- custom
  emphc_emply VARCHAR(50) NOT NULL, -- employee id
  emphc_hlcal VARCHAR(50) NOT NULL, -- holiday calendar id
  emphc_efrmd date NOT NULL, -- effective from date
  emphc_etodt date, -- effective to date (null for ongoing)
  emphc_notes VARCHAR(255), -- remarks

  -- default 2
  emphc_actve boolean NOT NULL DEFAULT true,
  emphc_crusr VARCHAR(50) NOT NULL,
  emphc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emphc_upusr VARCHAR(50) NOT NULL,
  emphc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emphc_rvnmr integer NOT NULL DEFAULT 1
);
