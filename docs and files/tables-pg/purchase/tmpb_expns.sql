--
-- Table structure for table tmpb_expns
--

CREATE TABLE tmpb_expns (
  id varchar(50) PRIMARY KEY,
  
  expns_users varchar(50) NOT NULL,
  expns_bsins varchar(50) NOT NULL,
  expns_cntct varchar(50) NOT NULL,
  expns_refid varchar(50) NOT NULL,
  expns_refno varchar(50) NOT NULL,
  expns_srcnm varchar(50) NOT NULL,
  expns_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expns_inexc boolean NOT NULL DEFAULT true,
  -- optional
  expns_notes varchar(100),

  -- default
  expns_xpamt decimal(20,6) NOT NULL DEFAULT 0,

  expns_actve boolean NOT NULL DEFAULT true,
  expns_crusr varchar(50) NOT NULL,
  expns_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expns_upusr varchar(50) NOT NULL,
  expns_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expns_rvnmr integer NOT NULL DEFAULT 1
);


-- expns_inexc [1=Including, 2=Excluding]
-- true include, false exclude