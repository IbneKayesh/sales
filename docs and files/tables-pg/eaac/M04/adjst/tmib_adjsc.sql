--drop table tmib_adjsc;
--
-- Table structure for table tmib_adjsc
--

CREATE TABLE tmib_adjsc (
  -- default 1
  id varchar(50) PRIMARY KEY,

  adjsc_users varchar(50) NOT NULL,
  adjsc_bsins varchar(50) NOT NULL,
  adjsc_adjsm varchar(50) NOT NULL,
  adjsc_price varchar(50) NOT NULL,
  adjsc_items varchar(50) NOT NULL,
  adjsc_units varchar(50) NOT NULL,
  adjsc_itrat decimal(18,6) DEFAULT 0.00,
  adjsc_itqty decimal(18,6) DEFAULT 0.00,
  adjsc_itamt decimal(18,6) DEFAULT 0.00,
  adjsc_notes VARCHAR(100),
  adjsc_refid VARCHAR(50),
  
  -- optional
  
  -- default
  adjsc_actve boolean NOT NULL DEFAULT true,
  adjsc_crusr varchar(50) NOT NULL,
  adjsc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  adjsc_upusr varchar(50) NOT NULL,
  adjsc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  adjsc_rvnmr integer NOT NULL DEFAULT 1
);