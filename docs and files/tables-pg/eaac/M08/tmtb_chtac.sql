CREATE TABLE tmtb_chtac (
  -- default 1
  id varchar(50) PRIMARY KEY,
  chtac_users varchar(50) NOT NULL,
  chtac_bsins varchar(50) NOT NULL,
  chtac_ccode varchar(50) NOT NULL,

  -- custom
  chtac_chtac varchar(50) NOT NULL DEFAULT '-',
  chtac_cname varchar(50) NOT NULL,
  chtac_ctype varchar(50) NOT NULL,
  chtac_chtno varchar(50) NOT NULL,
  chtac_ntype varchar(2) NOT NULL,
  chtac_child boolean NOT NULL DEFAULT false,
  chtac_ispst boolean NOT NULL DEFAULT false,
  chtac_ptype varchar(20) NOT NULL DEFAULT 'Manual',
  
  -- default 2
  chtac_actve boolean NOT NULL DEFAULT true,
  chtac_crusr varchar(50) NOT NULL,
  chtac_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_upusr varchar(50) NOT NULL,
  chtac_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_rvnmr integer NOT NULL DEFAULT 1
);


create table tmtb_chtac_bk
as
select *
from tmtb_chtac;

drop table tmtb_chtac;

CREATE TABLE tmtb_chtac (
  -- default 1
  id varchar(50) PRIMARY KEY,
  chtac_users varchar(50) NOT NULL,
  chtac_bsins varchar(50) NOT NULL,
  chtac_ccode varchar(50) NOT NULL,

  -- custom
  chtac_chtac varchar(50) NOT NULL DEFAULT '-',
  chtac_cname varchar(50) NOT NULL,
  chtac_ctype varchar(50) NOT NULL,
  chtac_chtno varchar(50) NOT NULL,
  chtac_ntype varchar(2) NOT NULL,
  chtac_child boolean NOT NULL DEFAULT false,
  chtac_ispst boolean NOT NULL DEFAULT false,
  chtac_ptype varchar(20) NOT NULL DEFAULT 'Manual',
  
  -- default 2
  chtac_actve boolean NOT NULL DEFAULT true,
  chtac_crusr varchar(50) NOT NULL,
  chtac_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_upusr varchar(50) NOT NULL,
  chtac_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chtac_rvnmr integer NOT NULL DEFAULT 1
);

insert into tmtb_chtac
select id, chtac_users, chtac_bsins, chtac_ccode, chtac_chtac, chtac_cname, chtac_ctype, chtac_chtno, chtac_ntype, chtac_child, chtac_ispst, 'Manual', chtac_actve, chtac_crusr, chtac_crdat, chtac_upusr, chtac_updat, chtac_rvnmr
FROM tmtb_chtac_bk;

drop table tmtb_chtac_bk;