--
-- Table structure for table tmtb_paybl
--

CREATE TABLE tmtb_paybl (
  id varchar(50) PRIMARY KEY,

  paybl_users varchar(50) NOT NULL,
  paybl_bsins varchar(50) NOT NULL,
  paybl_cntct varchar(50) NOT NULL,
  paybl_pymod varchar(50) NOT NULL,
  paybl_refid varchar(50) NOT NULL,
  paybl_refno varchar(50) NOT NULL,
  paybl_srcnm varchar(50) NOT NULL,
  paybl_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- optional
  paybl_descr varchar(100),

  -- default
  paybl_notes varchar(50) NOT NULL,
  paybl_dbamt decimal(20,6) NOT NULL DEFAULT 0,
  paybl_cramt decimal(20,6) NOT NULL DEFAULT 0,

  -- default
  paybl_actve boolean NOT NULL DEFAULT true,
  paybl_crusr varchar(50) NOT NULL,
  paybl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paybl_upusr varchar(50) NOT NULL,
  paybl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paybl_rvnmr integer NOT NULL DEFAULT 1
);