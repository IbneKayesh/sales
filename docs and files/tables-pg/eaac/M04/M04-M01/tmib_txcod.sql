--
-- Table structure for table tmib_txcod
-- tax list

CREATE TABLE tmib_txcod (
  -- default 1
  id varchar(50) PRIMARY KEY,
  txcod_users VARCHAR(50) NOT NULL,
  txcod_bsins VARCHAR(50) NOT NULL,
  txcod_ccode VARCHAR(50) NOT NULL,

  -- custom
  txcod_txtyp VARCHAR(50) NOT NULL,
  txcod_txmod VARCHAR(50) NOT NULL,  
  txcod_txrat decimal(18,6) DEFAULT 0.00,
  txcod_trcod VARCHAR(50) NOT NULL,
  
  -- default 2
  txcod_actve boolean NOT NULL DEFAULT true,
  txcod_crusr VARCHAR(50) NOT NULL,
  txcod_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  txcod_upusr VARCHAR(50) NOT NULL,
  txcod_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  txcod_rvnmr integer NOT NULL DEFAULT 1
);