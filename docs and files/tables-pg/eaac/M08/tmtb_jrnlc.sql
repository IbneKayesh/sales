--drop table tmtb_jrnlc;
--
-- Table structure for table tmtb_jrnlc
--

CREATE TABLE tmtb_jrnlc (
  id varchar(50) PRIMARY KEY,

  jrnlc_users varchar(50) NOT NULL,
  jrnlc_bsins varchar(50) NOT NULL,
  jrnlc_dpart varchar(50) NOT NULL,
  jrnlc_jrnlm varchar(50) NOT NULL,
  jrnlc_chtac varchar(50) NOT NULL,
  jrnlc_party varchar(50) NOT NULL,
  jrnlc_drval decimal(18,6) NOT NULL DEFAULT 0,
  jrnlc_crval decimal(18,6) NOT NULL DEFAULT 0,
  jrnlc_descr varchar(200) NULL,
  jrnlc_sorce varchar(50) NULL,
  jrnlc_refid varchar(50) NULL,
  jrnlc_rtype varchar(50) NULL,
  jrnlc_lines integer NOT NULL DEFAULT 1,
  
  -- default
  jrnlc_actve boolean NOT NULL DEFAULT true,
  jrnlc_crusr varchar(50) NOT NULL,
  jrnlc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jrnlc_upusr varchar(50) NOT NULL,
  jrnlc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jrnlc_rvnmr integer NOT NULL DEFAULT 1
);