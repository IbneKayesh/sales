--
-- Table structure for table toeb_fodrc
-- sales booking list

CREATE TABLE toeb_fodrc (
  id varchar(50) PRIMARY KEY,
  
  fodrc_fodrm VARCHAR(50) NOT NULL,
  fodrc_bitem VARCHAR(50) NOT NULL,
  fodrc_items VARCHAR(50) NOT NULL,
  fodrc_itrat decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_itqty decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_itamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_dspct decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_vtpct decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_csrat decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_ntamt decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_notes VARCHAR(50),
  fodrc_attrb VARCHAR(300),
  fodrc_attrn VARCHAR(300),
  fodrc_dlqty decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_dgqty decimal(20,6) NOT NULL DEFAULT 0,
  fodrc_srcnm VARCHAR(50) NOT NULL,
  fodrc_refid VARCHAR(50) NOT NULL,
  
  -- default
  fodrc_actve boolean NOT NULL DEFAULT true,
  fodrc_crusr VARCHAR(50) NOT NULL,
  fodrc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fodrc_upusr VARCHAR(50) NOT NULL,
  fodrc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fodrc_rvnmr integer NOT NULL DEFAULT 1
);

