--
-- Table structure for table tmhb_hlday
-- Holidays (List of holidays in a calendar)
--

CREATE TABLE tmhb_hlday (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  hlday_users VARCHAR(50) NOT NULL,
  hlday_bsins VARCHAR(50) NOT NULL,
  hlday_ccode VARCHAR(50) NOT NULL,

  -- custom
  hlday_hlcal VARCHAR(50) NOT NULL, -- holiday calendar id
  hlday_hldat date NOT NULL, -- holiday date
  hlday_cname VARCHAR(100) NOT NULL, -- holiday name / description
  hlday_htype VARCHAR(50) NOT NULL DEFAULT 'PUBLIC', -- holiday type [PUBLIC, RELIGIOUS, NATIONAL, COMPANY]
  hlday_ispad boolean NOT NULL DEFAULT true, -- is paid holiday
  hlday_otwrk boolean NOT NULL DEFAULT true, -- treated as overtime if worked
  hlday_notes VARCHAR(255), -- remarks

  -- default 2
  hlday_actve boolean NOT NULL DEFAULT true,
  hlday_crusr VARCHAR(50) NOT NULL,
  hlday_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlday_upusr VARCHAR(50) NOT NULL,
  hlday_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hlday_rvnmr integer NOT NULL DEFAULT 1
);
