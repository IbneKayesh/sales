--
-- Table structure for table tmib_itmtx
-- item tax list

CREATE TABLE tmib_itmtx (
  -- default 1
  id varchar(50) PRIMARY KEY,
  itmtx_users VARCHAR(50) NOT NULL,
  itmtx_bsins VARCHAR(50) NOT NULL,
  itmtx_ccode VARCHAR(50) NOT NULL,

  -- custom
  itmtx_items VARCHAR(50) NOT NULL,
  itmtx_txcod VARCHAR(50) NOT NULL,
  
  -- default 2
  itmtx_actve boolean NOT NULL DEFAULT true,
  itmtx_crusr VARCHAR(50) NOT NULL,
  itmtx_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  itmtx_upusr VARCHAR(50) NOT NULL,
  itmtx_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  itmtx_rvnmr integer NOT NULL DEFAULT 1
);