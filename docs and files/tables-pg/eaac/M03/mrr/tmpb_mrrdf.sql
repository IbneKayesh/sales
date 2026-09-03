--drop table tmpb_mrrdf;
--
-- Table structure for table tmpb_mrrdf
-- mrr details for offer pack

CREATE TABLE tmpb_mrrdf (
  id varchar(50) PRIMARY KEY,

  mrrdf_users VARCHAR(50) NOT NULL,
  mrrdf_bsins VARCHAR(50) NOT NULL,
  mrrdf_mrrdm VARCHAR(50) NOT NULL,
  mrrdf_bndlm VARCHAR(50) NOT NULL,
  mrrdf_pricm VARCHAR(50) NOT NULL,
  mrrdf_itemm VARCHAR(50) NOT NULL,
  mrrdf_unitm VARCHAR(50) NOT NULL,
  mrrdf_bnqty decimal(18,6) DEFAULT 1.00, -- Bundle Qty
  mrrdf_bndlc VARCHAR(50) NOT NULL,
  mrrdf_pricc VARCHAR(50) NOT NULL,
  mrrdf_itemc VARCHAR(50) NOT NULL,
  mrrdf_unitc VARCHAR(50) NOT NULL,
  mrrdf_pkqty decimal(18,6) DEFAULT 1.00, -- Pack Qty
  mrrdf_trqty decimal(18,6) DEFAULT 1.00, -- Purchase Qty
  mrrdf_ofcnt decimal(18,6) DEFAULT 1.00, -- Total Offer Count
  mrrdf_ofqty decimal(18,6) DEFAULT 1.00, -- Total Offer Qty
  mrrdf_notes VARCHAR(50),
  mrrdf_csrat decimal(18,6) DEFAULT 0.00, -- Cost Rate
  mrrdf_refid VARCHAR(50),
  
  -- default
  mrrdf_actve boolean NOT NULL DEFAULT true,
  mrrdf_crusr VARCHAR(50) NOT NULL,
  mrrdf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdf_upusr VARCHAR(50) NOT NULL,
  mrrdf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mrrdf_rvnmr integer NOT NULL DEFAULT 1
);