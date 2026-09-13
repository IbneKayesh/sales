--
-- Table structure for table tmhb_atprc
-- Attendance Processing Runs (Batch processing execution log)
--

CREATE TABLE tmhb_atprc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  atprc_users VARCHAR(50) NOT NULL,
  atprc_bsins VARCHAR(50) NOT NULL,
  atprc_ccode VARCHAR(50) NOT NULL,

  -- custom
  atprc_prdat date NOT NULL, -- process duty date
  atprc_pfrmt date NOT NULL, -- period from date
  atprc_ptodt date NOT NULL, -- period to date
  atprc_stats VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- status [STARTED, IN_PROGRESS, COMPLETED, FAILED]
  atprc_strtm timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- started timestamp
  atprc_endtm timestamp, -- completed timestamp
  atprc_prusr VARCHAR(50) NOT NULL, -- processed by user id
  atprc_totem integer NOT NULL DEFAULT 0, -- total employees processed
  atprc_totpr integer NOT NULL DEFAULT 0, -- total present count
  atprc_totab integer NOT NULL DEFAULT 0, -- total absent count
  atprc_totlv integer NOT NULL DEFAULT 0, -- total leave count
  atprc_errct integer NOT NULL DEFAULT 0, -- error count
  atprc_notes text, -- remarks / log notes

  -- default 2
  atprc_actve boolean NOT NULL DEFAULT true,
  atprc_crusr VARCHAR(50) NOT NULL,
  atprc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atprc_upusr VARCHAR(50) NOT NULL,
  atprc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atprc_rvnmr integer NOT NULL DEFAULT 1
);
