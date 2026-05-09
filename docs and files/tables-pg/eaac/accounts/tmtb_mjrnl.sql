--drop table tmtb_mjrnl;
--
-- Table structure for table tmtb_mjrnl
--

CREATE TABLE tmtb_mjrnl (
  id varchar(50) PRIMARY KEY,

  mjrnl_apusr varchar(50) NOT NULL,
  mjrnl_bsins varchar(50) NOT NULL,
  mjrnl_dpart varchar(50) NOT NULL,
  mjrnl_crncy varchar(50) NOT NULL,
  mjrnl_fsyar varchar(50) NOT NULL,
  mjrnl_acprd varchar(50) NOT NULL,
  mjrnl_trtyp varchar(50) NOT NULL,
  mjrnl_trnno varchar(50) NOT NULL,
  mjrnl_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mjrnl_refno varchar(50) NOT NULL,
  mjrnl_narrt varchar(100) NOT NULL,
  mjrnl_drval decimal(18,6) NOT NULL DEFAULT 0,
  mjrnl_crval decimal(18,6) NOT NULL DEFAULT 0,
  mjrnl_stats varchar(50) NOT NULL,
  mjrnl_appid varchar(50) NULL,
  mjrnl_apdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- default
  mjrnl_actve boolean NOT NULL DEFAULT true,
  mjrnl_crusr varchar(50) NOT NULL,
  mjrnl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mjrnl_upusr varchar(50) NOT NULL,
  mjrnl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mjrnl_rvnmr integer NOT NULL DEFAULT 1
);