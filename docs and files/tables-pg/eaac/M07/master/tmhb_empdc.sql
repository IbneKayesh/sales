--
-- Table structure for table tmhb_empdc
-- Employee Documents (NID, Passport, Certificates, Contracts, etc.)
--

CREATE TABLE tmhb_empdc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  empdc_users VARCHAR(50) NOT NULL,
  empdc_bsins VARCHAR(50) NOT NULL,
  empdc_ccode VARCHAR(50) NOT NULL,

  -- custom
  empdc_emply VARCHAR(50) NOT NULL, -- employee id
  empdc_dname VARCHAR(100) NOT NULL, -- document name / title
  empdc_dtype VARCHAR(50) NOT NULL, -- document type [NID, PASSPORT, CERTIFICATE, CONTRACT, DRIVING_LICENSE, OTHER]
  empdc_docno VARCHAR(100), -- document / registration number
  empdc_isudt date, -- issue date
  empdc_expdt date, -- expiry date
  empdc_filrf VARCHAR(255) NOT NULL, -- document file path / attachment reference
  empdc_notes VARCHAR(255), -- remarks

  -- default 2
  empdc_actve boolean NOT NULL DEFAULT true,
  empdc_crusr VARCHAR(50) NOT NULL,
  empdc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empdc_upusr VARCHAR(50) NOT NULL,
  empdc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  empdc_rvnmr integer NOT NULL DEFAULT 1
);
