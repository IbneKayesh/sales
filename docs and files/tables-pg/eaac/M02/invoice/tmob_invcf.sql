--drop table tmob_invcf;
--
-- Table structure for table tmob_invcf
-- invoice details for offer pack

CREATE TABLE tmob_invcf (
  id varchar(50) PRIMARY KEY,

  invcf_users VARCHAR(50) NOT NULL,
  invcf_bsins VARCHAR(50) NOT NULL,
  invcf_invcm VARCHAR(50) NOT NULL,
  invcf_bndlm VARCHAR(50) NOT NULL,
  invcf_pricm VARCHAR(50) NOT NULL,
  invcf_itemm VARCHAR(50) NOT NULL,
  invcf_unitm VARCHAR(50) NOT NULL,
  invcf_bnqty decimal(18,6) DEFAULT 1.00, -- Bundle Qty
  invcf_bndlc VARCHAR(50) NOT NULL,
  invcf_pricc VARCHAR(50) NOT NULL,
  invcf_itemc VARCHAR(50) NOT NULL,
  invcf_unitc VARCHAR(50) NOT NULL,
  invcf_pkqty decimal(18,6) DEFAULT 1.00, -- Pack Qty
  invcf_trqty decimal(18,6) DEFAULT 1.00, -- Purchase Qty
  invcf_ofcnt decimal(18,6) DEFAULT 1.00, -- Total Offer Count
  invcf_ofqty decimal(18,6) DEFAULT 1.00, -- Total Offer Qty
  invcf_notes VARCHAR(50),
  invcf_csrat decimal(18,6) DEFAULT 0.00, -- Cost Rate
  invcf_refid VARCHAR(50),
  
  -- default
  invcf_actve boolean NOT NULL DEFAULT true,
  invcf_crusr VARCHAR(50) NOT NULL,
  invcf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcf_upusr VARCHAR(50) NOT NULL,
  invcf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invcf_rvnmr integer NOT NULL DEFAULT 1
);