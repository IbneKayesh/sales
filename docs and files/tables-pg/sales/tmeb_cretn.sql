--
-- Table structure for table tmeb_cretn
-- sales return child list

CREATE TABLE tmeb_cretn (
  id varchar(50) PRIMARY KEY,

  cretn_mretn VARCHAR(50) NOT NULL,
  cretn_bitem VARCHAR(50) NOT NULL,
  cretn_items VARCHAR(50) NOT NULL,
  cretn_itrat decimal(20,6) NOT NULL DEFAULT 0,
  cretn_itqty decimal(20,6) NOT NULL DEFAULT 0,
  cretn_itamt decimal(20,6) NOT NULL DEFAULT 0,
  cretn_dspct decimal(20,6) NOT NULL DEFAULT 0,
  cretn_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  cretn_vtpct decimal(20,6) NOT NULL DEFAULT 0,
  cretn_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  cretn_csrat decimal(20,6) NOT NULL DEFAULT 0,
  cretn_ntamt decimal(20,6) NOT NULL DEFAULT 0,
  cretn_lprat decimal(20,6) NOT NULL DEFAULT 0,
  cretn_notes VARCHAR(50),
  cretn_attrb VARCHAR(300),
  cretn_attrn VARCHAR(300),
  cretn_srcnm VARCHAR(50) NOT NULL,
  cretn_refid VARCHAR(50) NOT NULL,

   -- default
  cretn_actve boolean NOT NULL DEFAULT true,
  cretn_crusr VARCHAR(50) NOT NULL,
  cretn_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cretn_upusr VARCHAR(50) NOT NULL,
  cretn_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cretn_rvnmr integer NOT NULL DEFAULT 1
);