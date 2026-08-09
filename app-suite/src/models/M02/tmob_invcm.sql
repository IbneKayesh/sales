--drop table tmob_invcm;
--
-- Table structure for table tmob_invcm
-- sales invoice master

CREATE TABLE tmob_invcm (
  -- default 1
  id varchar(50) PRIMARY KEY,

  invcm_users VARCHAR(50) NOT NULL,
  invcm_bsins VARCHAR(50) NOT NULL,
  invcm_dpart VARCHAR(50) NOT NULL,
  invcm_crncy VARCHAR(50) NOT NULL,
  invcm_cntct VARCHAR(50) NOT NULL,
  invcm_ttype VARCHAR(50) NOT NULL,

  -- custom
  invcm_trnno VARCHAR(50) NOT NULL,
  invcm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcm_refno VARCHAR(50),
  invcm_notes VARCHAR(100),
  invcm_tramt decimal(18,6) DEFAULT 0.00, --qty x price
  invcm_itmds decimal(18,6) DEFAULT 0.00, --item wise discount
  invcm_invds decimal(18,6) DEFAULT 0.00, --extra invoice discount
  invcm_lylds decimal(18,6) DEFAULT 0.00, --loyalty discount
  invcm_vtamt decimal(18,6) DEFAULT 0.00, --pay to govt
  invcm_icamt decimal(18,6) DEFAULT 0.00, --include cost to payable //paid to supplier
  invcm_ecamt decimal(18,6) DEFAULT 0.00, --exclude cost //pay to local vendor
  invcm_pyamt decimal(18,6) DEFAULT 0.00, --(invcm_tramt + invcm_icamt )- (invcm_itmds + invcm_invds + invcm_ivtmt)
  invcm_pdamt decimal(18,6) DEFAULT 0.00,
  invcm_duamt decimal(18,6) DEFAULT 0.00,
  invcm_exrat decimal(18,6) DEFAULT 0.00, --exchange rate
  invcm_ispst boolean NOT NULL DEFAULT false,
  invcm_ispad boolean NOT NULL DEFAULT false,
  invcm_isapp boolean NOT NULL DEFAULT false,
  
  -- default 2
  invcm_actve boolean NOT NULL DEFAULT true,
  invcm_crusr VARCHAR(50) NOT NULL,
  invcm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcm_upusr VARCHAR(50) NOT NULL,
  invcm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcm_rvnmr integer NOT NULL DEFAULT 1
);