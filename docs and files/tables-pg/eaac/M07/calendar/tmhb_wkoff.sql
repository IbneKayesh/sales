--
-- Table structure for table tmhb_wkoff
-- Weekly Off Policies (Weekend definition e.g., Friday Off, Friday-Saturday Off, Sunday Off)
--

CREATE TABLE tmhb_wkoff (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  wkoff_users VARCHAR(50) NOT NULL,
  wkoff_bsins VARCHAR(50) NOT NULL,
  wkoff_ccode VARCHAR(50) NOT NULL,

  -- custom
  wkoff_pcode VARCHAR(50) NOT NULL, -- weekly off policy code
  wkoff_pname VARCHAR(100) NOT NULL, -- policy name (e.g. Standard Friday Off)
  wkoff_notes VARCHAR(255), -- description / notes

  -- default 2
  wkoff_actve boolean NOT NULL DEFAULT true,
  wkoff_crusr VARCHAR(50) NOT NULL,
  wkoff_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkoff_upusr VARCHAR(50) NOT NULL,
  wkoff_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkoff_rvnmr integer NOT NULL DEFAULT 1
);
