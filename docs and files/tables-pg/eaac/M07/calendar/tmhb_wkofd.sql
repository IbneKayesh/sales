--
-- Table structure for table tmhb_wkofd
-- Weekly Off Policy Days (Specific days of week: 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday)
--

CREATE TABLE tmhb_wkofd (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  wkofd_users VARCHAR(50) NOT NULL,
  wkofd_bsins VARCHAR(50) NOT NULL,
  wkofd_ccode VARCHAR(50) NOT NULL,

  -- custom
  wkofd_wkoff VARCHAR(50) NOT NULL, -- weekly off policy id
  wkofd_dayno integer NOT NULL, -- day of week number (1 to 7)
  wkofd_dname VARCHAR(20) NOT NULL, -- day name (e.g. FRIDAY, SATURDAY)
  wkofd_notes VARCHAR(255), -- remarks

  -- default 2
  wkofd_actve boolean NOT NULL DEFAULT true,
  wkofd_crusr VARCHAR(50) NOT NULL,
  wkofd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkofd_upusr VARCHAR(50) NOT NULL,
  wkofd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkofd_rvnmr integer NOT NULL DEFAULT 1
);
