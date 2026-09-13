--
-- Table structure for table tmhb_rstpd
-- Roster Pattern Days (Day-by-day mapping in cycle: day 1 to cycle_days)
--

CREATE TABLE tmhb_rstpd (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  rstpd_users VARCHAR(50) NOT NULL,
  rstpd_bsins VARCHAR(50) NOT NULL,
  rstpd_ccode VARCHAR(50) NOT NULL,

  -- custom
  rstpd_rstpt VARCHAR(50) NOT NULL, -- roster pattern id
  rstpd_seqno integer NOT NULL, -- day sequence in cycle (1, 2, 3...)
  rstpd_dtype VARCHAR(20) NOT NULL DEFAULT 'WORK', -- day type [WORK, OFF]
  rstpd_wkshf VARCHAR(50), -- assigned shift id (null if OFF)
  rstpd_wkmin integer NOT NULL DEFAULT 480, -- scheduled working minutes
  rstpd_notes VARCHAR(255), -- remarks

  -- default 2
  rstpd_actve boolean NOT NULL DEFAULT true,
  rstpd_crusr VARCHAR(50) NOT NULL,
  rstpd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rstpd_upusr VARCHAR(50) NOT NULL,
  rstpd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rstpd_rvnmr integer NOT NULL DEFAULT 1
);
