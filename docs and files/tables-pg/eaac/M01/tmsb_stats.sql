--
-- Table structure for table `tmsb_stats`
-- status table



CREATE TABLE tmsb_stats (
  id varchar(50) PRIMARY KEY,

  stats_table varchar(50) NOT NULL,
  stats_stats varchar(50) NOT NULL,
  stats_descr varchar(50),

  -- default
  stats_actve boolean NOT NULL DEFAULT true,
  stats_crusr varchar(50) NOT NULL,
  stats_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stats_upusr varchar(50) NOT NULL,
  stats_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stats_rvnmr integer NOT NULL DEFAULT 1
);