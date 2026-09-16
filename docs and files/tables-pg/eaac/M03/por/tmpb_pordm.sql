--drop table tmpb_pordm;
--
-- Table structure for table tmpb_pordm
-- mrr master

CREATE TABLE tmpb_pordm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  pordm_users VARCHAR(50) NOT NULL,
  pordm_bsins VARCHAR(50) NOT NULL,
  pordm_dpart VARCHAR(50) NOT NULL,
  pordm_cntct VARCHAR(50) NOT NULL,
  pordm_ttype VARCHAR(50) NOT NULL,

  -- custom
  pordm_trnno VARCHAR(50) NOT NULL,
  pordm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordm_refno VARCHAR(50),
  pordm_notes VARCHAR(100),
  pordm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  pordm_itmds decimal(18,6) DEFAULT 0.00, --item wise discount
  pordm_vtamt decimal(18,6) DEFAULT 0.00, --VAT Amount
  pordm_icamt decimal(18,6) DEFAULT 0.00, --include cost to payable //paid to supplier
  pordm_ecamt decimal(18,6) DEFAULT 0.00, --exclude cost //pay to local vendor
  pordm_pyamt decimal(18,6) DEFAULT 0.00, --(pordm_tramt + pordm_icamt )- (pordm_itmds + pordm_invds)
  pordm_pdamt decimal(18,6) DEFAULT 0.00, --paid
  pordm_duamt decimal(18,6) DEFAULT 0.00, --due
  pordm_stamt decimal(18,6) DEFAULT 0.00, --total amount
  pordm_csamt decimal(18,6) DEFAULT 0.00, --inventory cost amount
  pordm_dlvry VARCHAR(100),
  pordm_ispst boolean NOT NULL DEFAULT false,
  pordm_ispad boolean NOT NULL DEFAULT false,
  pordm_ispnd boolean NOT NULL DEFAULT true, --is pending MRR
  pordm_isapp boolean NOT NULL DEFAULT false,
  
  --cancel
  pordm_iscnl boolean NOT NULL DEFAULT false, --is cancelled
  pordm_cndat timestamp NULL, --cancel date and time
  pordm_cnusr VARCHAR(50) NULL, --cancelled user
  pordm_cnrsn VARCHAR(50) NULL, --cancelled reason
  pordm_cnval decimal(18,6) DEFAULT 0.00, --cancelled value
  pordm_cnjrn VARCHAR(50) NULL, --cancelled journal
  

  
  -- default 2
  pordm_actve boolean NOT NULL DEFAULT true,
  pordm_crusr VARCHAR(50) NOT NULL,
  pordm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordm_upusr VARCHAR(50) NOT NULL,
  pordm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordm_rvnmr integer NOT NULL DEFAULT 1
);