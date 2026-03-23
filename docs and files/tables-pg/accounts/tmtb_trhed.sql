--drop table tmtb_trhed;
--
-- Table structure for table tmtb_trhed
--

CREATE TABLE tmtb_trhed (
  id varchar(50) PRIMARY KEY,

  trhed_users varchar(50) NOT NULL,
  trhed_hednm varchar(50) NOT NULL,
  trhed_grpnm varchar(50) NOT NULL,
  trhed_descr varchar(100),
  trhed_grtyp varchar(50) NOT NULL,
  trhed_cntyp varchar(50) NOT NULL,
  trhed_advic boolean NOT NULL DEFAULT false,
  
  -- default
  trhed_actve boolean NOT NULL DEFAULT true,
  trhed_crusr varchar(50) NOT NULL,
  trhed_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trhed_upusr varchar(50) NOT NULL,
  trhed_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trhed_rvnmr integer NOT NULL DEFAULT 1
);