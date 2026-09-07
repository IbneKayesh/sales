--drop table tmpb_prodm;
--
-- Table structure for table tmpb_prodm
-- mrr master

CREATE TABLE tmpb_prodm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  prodm_users VARCHAR(50) NOT NULL,
  prodm_bsins VARCHAR(50) NOT NULL,
  prodm_dpart VARCHAR(50) NOT NULL,
  prodm_cntct VARCHAR(50) NOT NULL,
  prodm_ttype VARCHAR(50) NOT NULL,

  -- custom
  prodm_trnno VARCHAR(50) NOT NULL,
  prodm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prodm_refno VARCHAR(50),
  prodm_notes VARCHAR(100),
  prodm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  prodm_itmds decimal(18,6) DEFAULT 0.00, --item wise discount
  prodm_dspct decimal(18,6) DEFAULT 0.00, --extra invoice discount %
  prodm_invds decimal(18,6) DEFAULT 0.00, --extra invoice discount
  prodm_vtamt decimal(18,6) DEFAULT 0.00, --VAT Amount
  prodm_icamt decimal(18,6) DEFAULT 0.00, --include cost to payable //paid to supplier
  prodm_ecamt decimal(18,6) DEFAULT 0.00, --exclude cost //pay to local vendor
  prodm_pyamt decimal(18,6) DEFAULT 0.00, --(prodm_tramt + prodm_icamt )- (prodm_itmds + prodm_invds)
  prodm_pdamt decimal(18,6) DEFAULT 0.00, --paid
  prodm_duamt decimal(18,6) DEFAULT 0.00, --due
  prodm_stamt decimal(18,6) DEFAULT 0.00, --total amount
  prodm_csamt decimal(18,6) DEFAULT 0.00, --inventory cost amount
  prodm_vehid VARCHAR(50),
  prodm_ispst boolean NOT NULL DEFAULT false,
  prodm_ispad boolean NOT NULL DEFAULT false,
  prodm_isqcp boolean NOT NULL DEFAULT false,
  prodm_isapp boolean NOT NULL DEFAULT false,
  
  -- default 2
  prodm_actve boolean NOT NULL DEFAULT true,
  prodm_crusr VARCHAR(50) NOT NULL,
  prodm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prodm_upusr VARCHAR(50) NOT NULL,
  prodm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prodm_rvnmr integer NOT NULL DEFAULT 1
);