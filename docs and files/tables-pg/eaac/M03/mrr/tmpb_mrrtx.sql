--
-- Table structure for table tmpb_mrrtx
-- mrr costings

CREATE TABLE tmpb_mrrtx (
  id varchar(50) PRIMARY KEY,

  mrrtx_users VARCHAR(50) NOT NULL,
  mrrtx_bsins VARCHAR(50) NOT NULL,
  mrrtx_mrrdm VARCHAR(50) NOT NULL,
  mrrtx_mrrdc VARCHAR(50),
  mrrtx_txcod VARCHAR(50) NOT NULL,
  mrrtx_txtyp VARCHAR(50) NOT NULL,
  mrrtx_txmod VARCHAR(50) NOT NULL,
  mrrtx_txbse decimal(18,6) DEFAULT 0.00,  
  mrrtx_txrat decimal(18,6) DEFAULT 0.00,  
  mrrtx_txamt decimal(18,6) DEFAULT 0.00,  
  mrrtx_rcamt decimal(18,6) DEFAULT 0.00,  
  mrrtx_nramt decimal(18,6) DEFAULT 0.00,  
  mrrtx_notes VARCHAR(50),

  -- default
  mrrtx_actve boolean NOT NULL DEFAULT true,
  mrrtx_crusr VARCHAR(50) NOT NULL,
  mrrtx_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrtx_upusr VARCHAR(50) NOT NULL,
  mrrtx_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrtx_rvnmr integer NOT NULL DEFAULT 1
);