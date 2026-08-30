--drop table tmob_invrm;
--
-- Table structure for table tmob_invrm
-- sales invoice return master

CREATE TABLE tmob_invrm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  invrm_users VARCHAR(50) NOT NULL,
  invrm_bsins VARCHAR(50) NOT NULL,
  invrm_dpart VARCHAR(50) NOT NULL,
  invrm_cntct VARCHAR(50) NOT NULL,
  invrm_ttype VARCHAR(50) NOT NULL,

  -- custom
  invrm_trnno VARCHAR(50) NOT NULL,
  invrm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invrm_refno VARCHAR(50) NOT NULL,
  invrm_notes VARCHAR(100),
  invrm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  invrm_itmds decimal(18,6) DEFAULT 0.00, --item wise discount
  invrm_dspct decimal(18,6) DEFAULT 0.00, --extra invoice discount %
  invrm_invds decimal(18,6) DEFAULT 0.00, --extra invoice discount
  invrm_lylds decimal(18,6) DEFAULT 0.00, --loyalty discount
  invrm_vtamt decimal(18,6) DEFAULT 0.00, --pay to govt
  invrm_icamt decimal(18,6) DEFAULT 0.00, --include cost to payable //paid to supplier
  invrm_ecamt decimal(18,6) DEFAULT 0.00, --exclude cost //pay to local vendor
  invrm_pyamt decimal(18,6) DEFAULT 0.00, --(invrm_tramt + invrm_icamt )- (invrm_itmds + invrm_invds + invrm_ivtmt)
  invrm_pdamt decimal(18,6) DEFAULT 0.00,
  invrm_duamt decimal(18,6) DEFAULT 0.00,
  invrm_stamt decimal(18,6) DEFAULT 0.00, --sub total
  invrm_csamt decimal(18,6) DEFAULT 0.00, --cost amount
  invrm_nsamt decimal(18,6) DEFAULT 0.00, --new cost amount
  invrm_vehid VARCHAR(50),
  invrm_ispst boolean NOT NULL DEFAULT false,
  invrm_ispad boolean NOT NULL DEFAULT false,
  invrm_isapp boolean NOT NULL DEFAULT false,
  
  -- default 2
  invrm_actve boolean NOT NULL DEFAULT true,
  invrm_crusr VARCHAR(50) NOT NULL,
  invrm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invrm_upusr VARCHAR(50) NOT NULL,
  invrm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invrm_rvnmr integer NOT NULL DEFAULT 1
);