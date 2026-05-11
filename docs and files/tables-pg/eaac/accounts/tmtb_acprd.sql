--drop table tmtb_acprd;
--
-- Table structure for table tmtb_acprd
--

CREATE TABLE tmtb_acprd (
  id varchar(50) PRIMARY KEY,

  acprd_apusr varchar(50) NOT NULL,
  acprd_bsins varchar(50) NOT NULL,
  acprd_dpart varchar(50) NOT NULL,
  acprd_fsyar varchar(50) NOT NULL,
  acprd_pname varchar(50) NOT NULL,
  acprd_prdno varchar(50) NOT NULL,
  acprd_stdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_endat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_stats varchar(50) NOT NULL,
  acprd_iscur boolean NOT NULL DEFAULT true,
  acprd_opbal decimal(18,6) NOT NULL DEFAULT 0,
  acprd_clbal decimal(18,6) NOT NULL DEFAULT 0,
  
  -- default
  acprd_actve boolean NOT NULL DEFAULT true,
  acprd_crusr varchar(50) NOT NULL,
  acprd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_upusr varchar(50) NOT NULL,
  acprd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acprd_rvnmr integer NOT NULL DEFAULT 1
);