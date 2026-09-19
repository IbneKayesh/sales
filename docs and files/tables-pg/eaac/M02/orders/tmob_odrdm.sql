--drop table tmob_odrdm;
--
-- Table structure for table tmob_odrdm
-- mrr master

CREATE TABLE tmob_odrdm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  odrdm_users VARCHAR(50) NOT NULL,
  odrdm_bsins VARCHAR(50) NOT NULL,
  odrdm_dpart VARCHAR(50) NOT NULL,
  odrdm_cntct VARCHAR(50) NOT NULL,
  odrdm_ttype VARCHAR(50) NOT NULL,

  -- custom
  odrdm_trnno VARCHAR(50) NOT NULL,
  odrdm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdm_refno VARCHAR(50),
  odrdm_notes VARCHAR(100),
  odrdm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  odrdm_itmds decimal(18,6) DEFAULT 0.00, --item wise discount
  odrdm_dspct decimal(18,6) DEFAULT 0.00, --extra invoice discount %
  odrdm_invds decimal(18,6) DEFAULT 0.00, --extra invoice discount
  odrdm_vtamt decimal(18,6) DEFAULT 0.00, --VAT Amount
  odrdm_icamt decimal(18,6) DEFAULT 0.00, --include cost to payable //paid to supplier
  odrdm_ecamt decimal(18,6) DEFAULT 0.00, --exclude cost //pay to local vendor
  odrdm_pyamt decimal(18,6) DEFAULT 0.00, --(odrdm_tramt + odrdm_icamt )- (odrdm_itmds + odrdm_invds)
  odrdm_pdamt decimal(18,6) DEFAULT 0.00, --paid
  odrdm_duamt decimal(18,6) DEFAULT 0.00, --due
  odrdm_stamt decimal(18,6) DEFAULT 0.00, --total amount
  odrdm_csamt decimal(18,6) DEFAULT 0.00, --inventory cost amount
  odrdm_vehid VARCHAR(50),
  odrdm_pstby VARCHAR(50), --order collected by
  odrdm_ispst boolean NOT NULL DEFAULT false,
  odrdm_ispad boolean NOT NULL DEFAULT false,
  odrdm_isqcp boolean NOT NULL DEFAULT false,
  odrdm_isapp boolean NOT NULL DEFAULT false,
  
  -- default 2
  odrdm_actve boolean NOT NULL DEFAULT true,
  odrdm_crusr VARCHAR(50) NOT NULL,
  odrdm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdm_upusr VARCHAR(50) NOT NULL,
  odrdm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdm_rvnmr integer NOT NULL DEFAULT 1
);