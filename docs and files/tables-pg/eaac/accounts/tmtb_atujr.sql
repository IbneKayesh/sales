--drop table tmtb_atujr;
--
-- Table structure for table tmtb_atujr
--

CREATE TABLE tmtb_atujr (
  id varchar(50) PRIMARY KEY,

  atujr_apusr varchar(50) NOT NULL,
  atujr_bsins varchar(50) NOT NULL,
  atujr_iface varchar(50) NOT NULL,
  atujr_rokey varchar(50) NOT NULL,
  atujr_jcrdr varchar(50) NOT NULL,
  atujr_setup varchar(50) NOT NULL,
  atujr_party varchar(50) NOT NULL,
  
  -- default
  atujr_actve boolean NOT NULL DEFAULT true,
  atujr_crusr varchar(50) NOT NULL,
  atujr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atujr_upusr varchar(50) NOT NULL,
  atujr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atujr_rvnmr integer NOT NULL DEFAULT 1
);