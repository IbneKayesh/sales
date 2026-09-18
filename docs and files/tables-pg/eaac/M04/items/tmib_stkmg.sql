--
-- Table structure for table tmib_stkmg
-- price stock merge

CREATE TABLE tmib_stkmg (
  -- default 1
  id varchar(50) PRIMARY KEY,
  stkmg_users VARCHAR(50) NOT NULL,
  stkmg_bsins VARCHAR(50) NOT NULL,
  stkmg_dpart VARCHAR(50) NOT NULL,
  stkmg_ccode VARCHAR(50) NOT NULL,

  -- custom
  stkmg_stock VARCHAR(50) NOT NULL,
  stkmg_refid VARCHAR(50) NOT NULL,
  stkmg_trdat VARCHAR(50) NOT NULL,
  stkmg_gdstk VARCHAR(50) NOT NULL,
  stkmg_bdstk VARCHAR(50) NOT NULL,
  stkmg_cprat VARCHAR(50) NOT NULL,
  stkmg_avrat VARCHAR(50) NOT NULL,
  stkmg_notes VARCHAR(50),
  
  -- default 2
  stkmg_actve boolean NOT NULL DEFAULT true,
  stkmg_crusr VARCHAR(50) NOT NULL,
  stkmg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stkmg_upusr VARCHAR(50) NOT NULL,
  stkmg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stkmg_rvnmr integer NOT NULL DEFAULT 1
);