--drop table tmtb_banks;
--
-- Table structure for table tmtb_banks
--

CREATE TABLE tmtb_banks (
  -- default 1
  id varchar(50) PRIMARY KEY,
  banks_users varchar(50) NOT NULL,
  banks_bsins varchar(50) NOT NULL,
  banks_ccode varchar(50) NOT NULL,

  -- custom
  banks_cname varchar(50) NOT NULL, --Bank Account, MFS, Cash Counter
  banks_actno varchar(50) NOT NULL, --Account No.
  banks_bname varchar(50), --Name
  banks_rname varchar(100), --Branch
  banks_addrs varchar(100), --Address
  banks_route varchar(20), --Routing No.
  banks_swift varchar(20), --SWIFT
  banks_opdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, --Opening Date
  banks_opbal decimal(18,6) NOT NULL DEFAULT 0, --Opening Balance
  banks_crbal decimal(18,6) NOT NULL DEFAULT 0, --Current Balance
  banks_chtno varchar(50) NOT NULL, --Chart of Account No.
  
  -- default
  banks_actve boolean NOT NULL DEFAULT true,
  banks_crusr varchar(50) NOT NULL,
  banks_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  banks_upusr varchar(50) NOT NULL,
  banks_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  banks_rvnmr integer NOT NULL DEFAULT 1
);