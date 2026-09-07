--drop table tmtb_pclos;
--
-- Table structure for table tmtb_pclos
--

CREATE TABLE tmtb_pclos (
  id varchar(50) PRIMARY KEY,

  pclos_apusr varchar(50) NOT NULL,
  pclos_bsins varchar(50) NOT NULL,
  pclos_fsyar varchar(50) NOT NULL,
  pclos_acprd varchar(50) NOT NULL,
  pclos_stats varchar(50) NOT NULL,
  
  -- default
  pclos_actve boolean NOT NULL DEFAULT true,
  pclos_crusr varchar(50) NOT NULL,
  pclos_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pclos_upusr varchar(50) NOT NULL,
  pclos_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pclos_rvnmr integer NOT NULL DEFAULT 1
);