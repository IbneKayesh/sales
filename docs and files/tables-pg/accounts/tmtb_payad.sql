--
-- Table structure for table tmtb_payad
--

CREATE TABLE tmtb_payad (
  id varchar(50) PRIMARY KEY,

  payad_users varchar(50) NOT NULL,
  payad_bsins varchar(50) NOT NULL,
  payad_ledgr varchar(50) NOT NULL,
  payad_srcnm varchar(50) NOT NULL,
  payad_refid varchar(50) NOT NULL,
  payad_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- optional
  -- default
  payad_rfamt decimal(20,6) NOT NULL DEFAULT 0,
  payad_refno varchar(50) NOT NULL,
  payad_descr varchar(100) NOT NULL,

  -- default
  payad_actve boolean NOT NULL DEFAULT true,
  payad_crusr varchar(50) NOT NULL,
  payad_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payad_upusr varchar(50) NOT NULL,
  payad_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payad_rvnmr integer NOT NULL DEFAULT 1
);