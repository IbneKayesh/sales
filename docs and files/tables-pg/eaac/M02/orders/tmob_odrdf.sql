--drop table tmob_odrdf;
--
-- Table structure for table tmob_odrdf
-- mrr details for offer pack

CREATE TABLE tmob_odrdf (
  id varchar(50) PRIMARY KEY,

  odrdf_users VARCHAR(50) NOT NULL,
  odrdf_bsins VARCHAR(50) NOT NULL,
  odrdf_odrdm VARCHAR(50) NOT NULL,
  odrdf_bndlm VARCHAR(50) NOT NULL,
  odrdf_pricm VARCHAR(50) NOT NULL,
  odrdf_itemm VARCHAR(50) NOT NULL,
  odrdf_unitm VARCHAR(50) NOT NULL,
  odrdf_bnqty decimal(18,6) DEFAULT 1.00, -- Bundle Qty
  odrdf_bndlc VARCHAR(50) NOT NULL,
  odrdf_pricc VARCHAR(50) NOT NULL,
  odrdf_itemc VARCHAR(50) NOT NULL,
  odrdf_unitc VARCHAR(50) NOT NULL,
  odrdf_pkqty decimal(18,6) DEFAULT 1.00, -- Pack Qty
  odrdf_trqty decimal(18,6) DEFAULT 1.00, -- Purchase Qty
  odrdf_ofcnt decimal(18,6) DEFAULT 1.00, -- Total Offer Count
  odrdf_ofqty decimal(18,6) DEFAULT 1.00, -- Total Offer Qty
  odrdf_notes VARCHAR(50),
  odrdf_csrat decimal(18,6) DEFAULT 0.00, -- Cost Rate
  odrdf_refid VARCHAR(50),
  
  -- default
  odrdf_actve boolean NOT NULL DEFAULT true,
  odrdf_crusr VARCHAR(50) NOT NULL,
  odrdf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdf_upusr VARCHAR(50) NOT NULL,
  odrdf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  odrdf_rvnmr integer NOT NULL DEFAULT 1
);