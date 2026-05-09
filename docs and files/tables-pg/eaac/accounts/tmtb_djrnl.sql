--drop table tmtb_djrnl;
--
-- Table structure for table tmtb_djrnl
--

CREATE TABLE tmtb_djrnl (
  id varchar(50) PRIMARY KEY,

  djrnl_apusr varchar(50) NOT NULL,
  djrnl_bsins varchar(50) NOT NULL,
  djrnl_dpart varchar(50) NOT NULL,
  djrnl_mjrnl varchar(50) NOT NULL,
  djrnl_chtac varchar(50) NOT NULL,
  djrnl_party varchar(50) NOT NULL,
  djrnl_drval decimal(18,6) NOT NULL DEFAULT 0,
  djrnl_crval decimal(18,6) NOT NULL DEFAULT 0,
  djrnl_descr varchar(50) NULL,
  djrnl_rftyp varchar(50) NULL,
  djrnl_refid varchar(50) NULL,
  djrnl_lneno integer NOT NULL DEFAULT 1,
  
  -- default
  djrnl_actve boolean NOT NULL DEFAULT true,
  djrnl_crusr varchar(50) NOT NULL,
  djrnl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  djrnl_upusr varchar(50) NOT NULL,
  djrnl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  djrnl_rvnmr integer NOT NULL DEFAULT 1
);