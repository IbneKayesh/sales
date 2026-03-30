--
-- Table structure for table tmhb_scyle
--

CREATE TABLE tmhb_scyle (
  id VARCHAR(50) PRIMARY KEY,

  scyle_users VARCHAR(50) NOT NULL,
  scyle_bsins VARCHAR(50) NOT NULL,
  scyle_yerid integer NOT NULL DEFAULT 0,
  scyle_gname VARCHAR(50) NOT NULL,
  scyle_cname VARCHAR(50) NOT NULL,
  scyle_frdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scyle_todat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scyle_today integer NOT NULL DEFAULT 1,
  scyle_notes VARCHAR(50),
  scyle_iscmp boolean NOT NULL DEFAULT false,

   -- default
  scyle_actve boolean NOT NULL DEFAULT true,
  scyle_crusr VARCHAR(50) NOT NULL,
  scyle_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scyle_upusr VARCHAR(50) NOT NULL,
  scyle_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scyle_rvnmr integer NOT NULL DEFAULT 1
);