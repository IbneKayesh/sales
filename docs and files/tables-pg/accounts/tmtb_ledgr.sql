--
-- Table structure for table tmtb_ledgr
--

CREATE TABLE tmtb_ledgr (
  id varchar(50) PRIMARY KEY,

  ledgr_users varchar(50) NOT NULL,
  ledgr_bsins varchar(50) NOT NULL,
   varchar(50) NOT NULL,
  ledgr_cntct varchar(50) NOT NULL,
  ledgr_bacts varchar(50) NOT NULL,
  ledgr_pymod varchar(50) NOT NULL,
  ledgr_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ledgr_refno varchar(500) NOT NULL,

  -- optional
  ledgr_notes varchar(250),

  -- default
  
  ledgr_isref boolean NOT NULL DEFAULT false,
  ledgr_dbamt decimal(18,6) NOT NULL DEFAULT 0,
  ledgr_cramt decimal(18,6) NOT NULL DEFAULT 0,
  
  ledgr_actve boolean NOT NULL DEFAULT true,
  ledgr_crusr varchar(50) NOT NULL,
  ledgr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ledgr_upusr varchar(50) NOT NULL,
  ledgr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ledgr_rvnmr integer NOT NULL DEFAULT 1
);