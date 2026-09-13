--
-- Table structure for table tmhb_emptp
-- Employment Types (Permanent, Contract, Casual, Daily Worker, Probation, Intern)
--

CREATE TABLE tmhb_emptp (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emptp_users VARCHAR(50) NOT NULL,
  emptp_bsins VARCHAR(50) NOT NULL,
  emptp_ccode VARCHAR(50) NOT NULL,

  -- custom
  emptp_tcode VARCHAR(50) NOT NULL, -- type code [PERMANENT, CONTRACT, CASUAL, PROBATION, INTERN]
  emptp_tname VARCHAR(100) NOT NULL, -- type name
  emptp_notes VARCHAR(255), -- description / notes

  -- default 2
  emptp_actve boolean NOT NULL DEFAULT true,
  emptp_crusr VARCHAR(50) NOT NULL,
  emptp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emptp_upusr VARCHAR(50) NOT NULL,
  emptp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emptp_rvnmr integer NOT NULL DEFAULT 1
);
