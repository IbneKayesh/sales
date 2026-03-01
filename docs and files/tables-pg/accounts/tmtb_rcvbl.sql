--
-- Table structure for table tmtb_rcvbl
--

CREATE TABLE tmtb_rcvbl (
  id varchar(50) PRIMARY KEY,

  rcvbl_users varchar(50) NOT NULL,
  rcvbl_bsins varchar(50) NOT NULL,
  rcvbl_cntct varchar(50) NOT NULL,
  rcvbl_pymod varchar(50) NOT NULL,
  rcvbl_refid varchar(50) NOT NULL,
  rcvbl_refno varchar(50) NOT NULL,
  rcvbl_srcnm varchar(50) NOT NULL,
  rcvbl_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- optional
  rcvbl_descr varchar(100),
  
  -- default
  rcvbl_notes varchar(50) NOT NULL,
  rcvbl_dbamt decimal(20,6) NOT NULL DEFAULT 0,
  rcvbl_cramt decimal(20,6) NOT NULL DEFAULT 0,

  -- default
  rcvbl_actve boolean NOT NULL DEFAULT true,
  rcvbl_crusr varchar(50) NOT NULL,
  rcvbl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rcvbl_upusr varchar(50) NOT NULL,
  rcvbl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rcvbl_rvnmr integer NOT NULL DEFAULT 1
);