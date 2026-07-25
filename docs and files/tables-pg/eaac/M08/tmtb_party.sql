--drop table tmtb_party;
--
-- Table structure for table tmtb_party
--

CREATE TABLE tmtb_party (
  -- default 1
  id varchar(50) PRIMARY KEY,
  party_users varchar(50) NOT NULL,
  party_bsins varchar(50) NOT NULL,
  party_ccode varchar(50) NOT NULL,

  -- custom
  party_ptype varchar(50) NOT NULL, --items,banks,customer,supplier etc
  party_chtac varchar(50) NOT NULL,
  party_vndor varchar(50) NOT NULL, --items,banks,customer,supplier etc id
  party_cname varchar(100) NOT NULL, -- --items,banks,customer,supplier etc name
  party_opbal decimal(18,6) NOT NULL DEFAULT 0,
  
  -- default
  party_actve boolean NOT NULL DEFAULT true,
  party_crusr varchar(50) NOT NULL,
  party_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  party_upusr varchar(50) NOT NULL,
  party_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  party_rvnmr integer NOT NULL DEFAULT 1
);