--
-- Table structure for table tmhb_atclm
-- Attendance Correction Monthly Limits (Configurable limit e.g. 5 requests per employee/month)
--

CREATE TABLE tmhb_atclm (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  atclm_users VARCHAR(50) NOT NULL,
  atclm_bsins VARCHAR(50) NOT NULL,
  atclm_ccode VARCHAR(50) NOT NULL,

  -- custom
  atclm_lmtct integer NOT NULL DEFAULT 5, -- maximum allowed correction requests per month per employee
  atclm_efrmd date NOT NULL, -- effective from date
  atclm_etodt date, -- effective to date (null for ongoing)
  atclm_notes VARCHAR(255), -- description / remarks

  -- default 2
  atclm_actve boolean NOT NULL DEFAULT true,
  atclm_crusr VARCHAR(50) NOT NULL,
  atclm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atclm_upusr VARCHAR(50) NOT NULL,
  atclm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atclm_rvnmr integer NOT NULL DEFAULT 1
);
