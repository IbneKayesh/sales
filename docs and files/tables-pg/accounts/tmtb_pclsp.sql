--drop table tmtb_pclsp;
--
-- Table structure for table tmtb_pclsp
--

CREATE TABLE tmtb_pclsp (
  id varchar(50) PRIMARY KEY,

  pclsp_apusr varchar(50) NOT NULL,
  pclsp_bsins varchar(50) NOT NULL,
  pclsp_fsyar varchar(50) NOT NULL,
  pclsp_acprd varchar(50) NOT NULL,
  pclsp_pclos varchar(50) NOT NULL,
  pclsp_chtac varchar(50) NOT NULL,
  pclsp_opbal decimal(18,6) NOT NULL DEFAULT 0,
  pclsp_drval decimal(18,6) NOT NULL DEFAULT 0,
  pclsp_crval decimal(18,6) NOT NULL DEFAULT 0,
  pclsp_clbal decimal(18,6) NOT NULL DEFAULT 0,
  
  -- default
  pclsp_actve boolean NOT NULL DEFAULT true,
  pclsp_crusr varchar(50) NOT NULL,
  pclsp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pclsp_upusr varchar(50) NOT NULL,
  pclsp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pclsp_rvnmr integer NOT NULL DEFAULT 1
);