--
-- Table structure for table tmob_tripc
-- sales delivery

CREATE TABLE tmob_tripc (
  -- default 1
  id varchar(50) PRIMARY KEY,
  tripc_users VARCHAR(50) NOT NULL,
  tripc_bsins VARCHAR(50) NOT NULL,
  tripc_tripm VARCHAR(50) NOT NULL,
  
  -- custom
  tripc_refid VARCHAR(50) NOT NULL,
  tripc_sorce VARCHAR(50) NOT NULL,
  tripc_dldat timestamp NULL,
  tripc_isdlv boolean NOT NULL DEFAULT false,
  tripc_atmpt integer NOT NULL DEFAULT 0,
  tripc_inval decimal(18,6) DEFAULT 0.00,
  tripc_duval decimal(18,6) DEFAULT 0.00,
  tripc_clval decimal(18,6) DEFAULT 0.00,
  tripc_addrs varchar(300) NOT NULL,
  tripc_notes varchar(100),
  
  -- default 2
  tripc_actve boolean NOT NULL DEFAULT true,
  tripc_crusr varchar(50) NOT NULL,
  tripc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripc_upusr varchar(50) NOT NULL,
  tripc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tripc_rvnmr integer NOT NULL DEFAULT 1
);