--
-- Table structure for table tmhb_slstr
-- Salary Structures (Salary structure templates e.g. Factory Worker Grade A, Executive Structure)
--

CREATE TABLE tmhb_slstr (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  slstr_users VARCHAR(50) NOT NULL,
  slstr_bsins VARCHAR(50) NOT NULL,
  slstr_ccode VARCHAR(50) NOT NULL,

  -- custom
  slstr_scode VARCHAR(50) NOT NULL, -- structure code
  slstr_sname VARCHAR(100) NOT NULL, -- structure name
  slstr_notes VARCHAR(255), -- description / remarks

  -- default 2
  slstr_actve boolean NOT NULL DEFAULT true,
  slstr_crusr VARCHAR(50) NOT NULL,
  slstr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  slstr_upusr VARCHAR(50) NOT NULL,
  slstr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  slstr_rvnmr integer NOT NULL DEFAULT 1
);
