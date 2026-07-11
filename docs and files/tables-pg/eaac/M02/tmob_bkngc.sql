--
-- Table structure for table tmob_bkngc
-- sales booking list

CREATE TABLE tmob_bkngc (
  -- default 1
  id varchar(50) PRIMARY KEY,
  bkngc_users VARCHAR(50) NOT NULL,
  bkngc_bsins VARCHAR(50) NOT NULL,
  bkngc_bkngm VARCHAR(50) NOT NULL,
  bkngc_items VARCHAR(50) NOT NULL,
  bkngc_price VARCHAR(50) NOT NULL,
  
  -- custom
  bkngc_itrat decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_itqty decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_itamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_dspct decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_vtpct decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_stamt decimal(20,6) NOT NULL DEFAULT 0,
  bkngc_notes VARCHAR(50) DEFAULT NULL,
  bkngc_attrb VARCHAR(300) DEFAULT NULL,
  
  -- default 2
  bkngc_actve boolean NOT NULL DEFAULT true,
  bkngc_crusr varchar(50) NOT NULL,
  bkngc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bkngc_upusr varchar(50) NOT NULL,
  bkngc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bkngc_rvnmr integer NOT NULL DEFAULT 1
);