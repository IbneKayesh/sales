--drop table tmtb_chtac;
--
-- Table structure for table tmtb_chtac
--

CREATE TABLE tmtb_chtac (
  id varchar(50) PRIMARY KEY,

  chtac_apusr varchar(50) NOT NULL,
  chtac_bsins varchar(50) NOT NULL,
  chtac_chtac varchar(50) NOT NULL DEFAULT '-',
  chtac_ccode varchar(50) NOT NULL,
  chtac_cname varchar(50) NOT NULL,
  chtac_ctype varchar(50) NOT NULL,
  chtac_chtno integer NOT NULL DEFAULT 0,
  chtac_ntype varchar(2) NOT NULL,
  chtac_child boolean NOT NULL DEFAULT false,
  chtac_alpst boolean NOT NULL DEFAULT false,
  
  -- default
  chtac_actve boolean NOT NULL DEFAULT true,
  chtac_crusr varchar(50) NOT NULL,
  chtac_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_upusr varchar(50) NOT NULL,
  chtac_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_rvnmr integer NOT NULL DEFAULT 1
);