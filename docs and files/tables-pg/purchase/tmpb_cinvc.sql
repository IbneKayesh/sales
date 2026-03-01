--
-- Table structure for table tmpb_cinvc
-- purchase invoice list

CREATE TABLE tmpb_cinvc (
  id varchar(50) PRIMARY KEY,

  cinvc_minvc VARCHAR(50) NOT NULL,
  cinvc_bitem VARCHAR(50) NOT NULL,
  cinvc_items VARCHAR(50) NOT NULL,
  cinvc_itrat decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_itqty decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_itamt decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_dspct decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_vtpct decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_csrat decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_ntamt decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_notes VARCHAR(50),
  cinvc_attrb VARCHAR(300),
  cinvc_attrn VARCHAR(300),
  cinvc_rtqty decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_slqty decimal(20,6) NOT NULL DEFAULT 0,
  cinvc_ohqty decimal(20,6) NOT NULL DEFAULT 0,

  -- default
  cinvc_actve boolean NOT NULL DEFAULT true,
  cinvc_crusr VARCHAR(50) NOT NULL,
  cinvc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cinvc_upusr VARCHAR(50) NOT NULL,
  cinvc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cinvc_rvnmr integer NOT NULL DEFAULT 1
);