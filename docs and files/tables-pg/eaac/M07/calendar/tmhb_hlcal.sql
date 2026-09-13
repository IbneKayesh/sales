--
-- Table structure for table tmhb_hlcal
-- Holiday Calendars (Yearly holiday calendar e.g., Calendar 2026)
--

CREATE TABLE tmhb_hlcal (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  hlcal_users VARCHAR(50) NOT NULL,
  hlcal_bsins VARCHAR(50) NOT NULL,
  hlcal_ccode VARCHAR(50) NOT NULL,

  -- custom
  hlcal_ccode_cal VARCHAR(50) NOT NULL, -- calendar code
  hlcal_cname VARCHAR(100) NOT NULL, -- calendar name
  hlcal_yrval integer NOT NULL, -- calendar year (e.g. 2026)
  hlcal_notes VARCHAR(255), -- description / remarks

  -- default 2
  hlcal_actve boolean NOT NULL DEFAULT true,
  hlcal_crusr VARCHAR(50) NOT NULL,
  hlcal_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlcal_upusr VARCHAR(50) NOT NULL,
  hlcal_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlcal_rvnmr integer NOT NULL DEFAULT 1
);
