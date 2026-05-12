--drop table tmtb_fsyar;
--
-- Table structure for table tmtb_fsyar
--

CREATE TABLE tmtb_fsyar (
  id varchar(50) PRIMARY KEY,

  fsyar_apusr varchar(50) NOT NULL,
  fsyar_bsins varchar(50) NOT NULL,
  fsyar_dpart varchar(50) NOT NULL,
  fsyar_fname varchar(50) NOT NULL,
  fsyar_stdat date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_endat date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_stats varchar(50) NOT NULL,
  fsyar_iscur boolean NOT NULL DEFAULT true,
  fsyar_opbal decimal(18,6) NOT NULL DEFAULT 0,
  fsyar_clbal decimal(18,6) NOT NULL DEFAULT 0,
  
  -- default
  fsyar_actve boolean NOT NULL DEFAULT true,
  fsyar_crusr varchar(50) NOT NULL,
  fsyar_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_upusr varchar(50) NOT NULL,
  fsyar_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fsyar_rvnmr integer NOT NULL DEFAULT 1
);