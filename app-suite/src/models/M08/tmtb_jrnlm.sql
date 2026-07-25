--drop table tmtb_jrnlm;
--
-- Table structure for table tmtb_jrnlm
--

CREATE TABLE tmtb_jrnlm (
  id varchar(50) PRIMARY KEY,

  jrnlm_users varchar(50) NOT NULL,
  jrnlm_bsins varchar(50) NOT NULL,
  jrnlm_dpart varchar(50) NOT NULL,
  jrnlm_fsyar varchar(50) NOT NULL,
  jrnlm_acprd varchar(50) NOT NULL,
  jrnlm_crncy varchar(50) NOT NULL,
  jrnlm_trtyp varchar(50) NOT NULL,
  jrnlm_trnno varchar(50) NOT NULL,
  jrnlm_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jrnlm_refno varchar(50) NOT NULL,
  jrnlm_narrt varchar(200) NOT NULL,
  jrnlm_drval decimal(18,6) NOT NULL DEFAULT 0,
  jrnlm_crval decimal(18,6) NOT NULL DEFAULT 0,
  jrnlm_stats varchar(50) NOT NULL,
  jrnlm_appid varchar(50) NULL,
  jrnlm_apdat timestamp NULL,
  
  -- default
  jrnlm_actve boolean NOT NULL DEFAULT true,
  jrnlm_crusr varchar(50) NOT NULL,
  jrnlm_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jrnlm_upusr varchar(50) NOT NULL,
  jrnlm_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jrnlm_rvnmr integer NOT NULL DEFAULT 1
);