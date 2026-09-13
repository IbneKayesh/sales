--
-- Table structure for table tmhb_slscf
-- Salary Structure Components (Component rules in a salary structure)
--

CREATE TABLE tmhb_slscf (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  slscf_users VARCHAR(50) NOT NULL,
  slscf_bsins VARCHAR(50) NOT NULL,
  slscf_ccode VARCHAR(50) NOT NULL,

  -- custom
  slscf_slstr VARCHAR(50) NOT NULL, -- salary structure id
  slscf_pycmp VARCHAR(50) NOT NULL, -- pay component id
  slscf_cltyp VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE_OF_BASIC', -- calculation basis
  slscf_fxdvl decimal(18,4) DEFAULT 0.0000, -- fixed amount value (if fixed)
  slscf_pctvl decimal(7,4) DEFAULT 0.0000, -- percentage value (if percentage)
  slscf_seqno integer NOT NULL DEFAULT 1, -- display / calculation sequence order
  slscf_notes VARCHAR(255), -- remarks

  -- default 2
  slscf_actve boolean NOT NULL DEFAULT true,
  slscf_crusr VARCHAR(50) NOT NULL,
  slscf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  slscf_upusr VARCHAR(50) NOT NULL,
  slscf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  slscf_rvnmr integer NOT NULL DEFAULT 1
);
