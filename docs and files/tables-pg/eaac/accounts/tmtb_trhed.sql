--drop table tmtb_ached;
--
-- Table structure for table tmtb_ached
--

CREATE TABLE tmtb_ached (
  id varchar(50) PRIMARY KEY,

  ached_apusr varchar(50) NOT NULL,
  ached_bsins varchar(50) NOT NULL,
  ached_ached varchar(50) NOT NULL DEFAULT '-',
  ached_hcode varchar(50) NOT NULL,
  ached_hname varchar(50) NOT NULL,
  ached_htype varchar(50) NOT NULL,
  ached_hedno integer NOT NULL DEFAULT 0,
  ached_child boolean NOT NULL DEFAULT false,
  ached_alpst boolean NOT NULL DEFAULT false,
  ached_level integer NOT NULL DEFAULT 0,
  
  -- default
  ached_actve boolean NOT NULL DEFAULT true,
  ached_crusr varchar(50) NOT NULL,
  ached_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ached_upusr varchar(50) NOT NULL,
  ached_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ached_rvnmr integer NOT NULL DEFAULT 1
);