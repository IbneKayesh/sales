--
-- Table structure for table tmhb_empwo
-- Employee Weekly Off Policy Assignments
--

CREATE TABLE tmhb_empwo (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empwo_users VARCHAR(50) NOT NULL,
  empwo_bsins VARCHAR(50) NOT NULL,
  empwo_ccode VARCHAR(50) NOT NULL,

  -- custom
  empwo_emply VARCHAR(50) NOT NULL, -- employee id
  empwo_wkoff VARCHAR(50) NOT NULL, -- weekly off policy id
  empwo_efrmd date NOT NULL, -- effective from date
  empwo_etodt date, -- effective to date (null for ongoing)
  empwo_notes VARCHAR(255), -- remarks

  -- default 2
  empwo_actve boolean NOT NULL DEFAULT true,
  empwo_crusr VARCHAR(50) NOT NULL,
  empwo_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empwo_upusr VARCHAR(50) NOT NULL,
  empwo_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empwo_rvnmr integer NOT NULL DEFAULT 1
);
