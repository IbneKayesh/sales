--drop table tmpb_pordf;
--
-- Table structure for table tmpb_pordf
-- mrr details for offer pack

CREATE TABLE tmpb_pordf (
  id varchar(50) PRIMARY KEY,

  pordf_users VARCHAR(50) NOT NULL,
  pordf_bsins VARCHAR(50) NOT NULL,
  pordf_pordm VARCHAR(50) NOT NULL,
  pordf_bndlm VARCHAR(50) NOT NULL,
  pordf_pricm VARCHAR(50) NOT NULL,
  pordf_itemm VARCHAR(50) NOT NULL,
  pordf_unitm VARCHAR(50) NOT NULL,
  pordf_bnqty decimal(18,6) DEFAULT 1.00, -- Bundle Qty
  pordf_bndlc VARCHAR(50) NOT NULL,
  pordf_pricc VARCHAR(50) NOT NULL,
  pordf_itemc VARCHAR(50) NOT NULL,
  pordf_unitc VARCHAR(50) NOT NULL,
  pordf_pkqty decimal(18,6) DEFAULT 1.00, -- Pack Qty
  pordf_trqty decimal(18,6) DEFAULT 1.00, -- Purchase Qty
  pordf_ofcnt decimal(18,6) DEFAULT 1.00, -- Total Offer Count
  pordf_ofqty decimal(18,6) DEFAULT 1.00, -- Total Offer Qty
  pordf_notes VARCHAR(50),
  pordf_csrat decimal(18,6) DEFAULT 0.00, -- Cost Rate
  pordf_refid VARCHAR(50),
  
  -- default
  pordf_actve boolean NOT NULL DEFAULT true,
  pordf_crusr VARCHAR(50) NOT NULL,
  pordf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordf_upusr VARCHAR(50) NOT NULL,
  pordf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pordf_rvnmr integer NOT NULL DEFAULT 1
);