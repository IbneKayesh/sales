--
-- Table structure for table tmtb_exctg
--

CREATE TABLE tmtb_exctg (
  id varchar(50) PRIMARY KEY,

  exctg_users varchar(50) NOT NULL,
  exctg_bsins varchar(50) NOT NULL,
  exctg_trhed varchar(50) NOT NULL,
  exctg_cname varchar(100) NOT NULL,

  -- optional

  -- default
  exctg_actve boolean NOT NULL DEFAULT true,
  exctg_crusr varchar(50) NOT NULL,
  exctg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exctg_upusr varchar(50) NOT NULL,
  exctg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exctg_rvnmr integer NOT NULL DEFAULT 1
);