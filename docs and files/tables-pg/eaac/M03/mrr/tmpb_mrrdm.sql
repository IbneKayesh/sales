--drop table tmpb_mrrdm;
--
-- Table structure for table tmpb_mrrdm
-- mrr master

CREATE TABLE tmpb_mrrdm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  mrrdm_users VARCHAR(50) NOT NULL,
  mrrdm_bsins VARCHAR(50) NOT NULL,
  mrrdm_dpart VARCHAR(50) NOT NULL,
  mrrdm_cntct VARCHAR(50) NOT NULL,
  mrrdm_ttype VARCHAR(50) NOT NULL,

  -- custom
  mrrdm_trnno VARCHAR(50) NOT NULL,
  mrrdm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdm_refno VARCHAR(50),
  mrrdm_notes VARCHAR(100),
  mrrdm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  mrrdm_itmds decimal(18,6) DEFAULT 0.00, --item wise discount
  mrrdm_dspct decimal(18,6) DEFAULT 0.00, --extra invoice discount %
  mrrdm_invds decimal(18,6) DEFAULT 0.00, --extra invoice discount
  mrrdm_vtamt decimal(18,6) DEFAULT 0.00, --VAT Amount
  mrrdm_icamt decimal(18,6) DEFAULT 0.00, --include cost to payable //paid to supplier
  mrrdm_ecamt decimal(18,6) DEFAULT 0.00, --exclude cost //pay to local vendor
  mrrdm_pyamt decimal(18,6) DEFAULT 0.00, --(mrrdm_tramt + mrrdm_icamt )- (mrrdm_itmds + mrrdm_invds)
  mrrdm_pdamt decimal(18,6) DEFAULT 0.00, --paid
  mrrdm_duamt decimal(18,6) DEFAULT 0.00, --due
  mrrdm_stamt decimal(18,6) DEFAULT 0.00, --total amount
  mrrdm_csamt decimal(18,6) DEFAULT 0.00, --inventory cost amount
  mrrdm_vehid VARCHAR(50),
  mrrdm_ispst boolean NOT NULL DEFAULT false,
  mrrdm_ispad boolean NOT NULL DEFAULT false,
  mrrdm_isqcp boolean NOT NULL DEFAULT false,
  mrrdm_isapp boolean NOT NULL DEFAULT false,
  
  -- default 2
  mrrdm_actve boolean NOT NULL DEFAULT true,
  mrrdm_crusr VARCHAR(50) NOT NULL,
  mrrdm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdm_upusr VARCHAR(50) NOT NULL,
  mrrdm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdm_rvnmr integer NOT NULL DEFAULT 1
);