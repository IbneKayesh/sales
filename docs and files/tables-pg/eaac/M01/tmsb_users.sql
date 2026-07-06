-- master users
-- drop table `tmsb_users`


CREATE TABLE tmsb_users (
    -- default 1
  id varchar(50) PRIMARY KEY,  

  -- custom
  users_email varchar(50) NOT NULL UNIQUE,
  users_cname varchar(50) NOT NULL,
  users_cntno varchar(50) NOT NULL,
  users_stats varchar(50) NOT NULL,
  users_regno varchar(50) NOT NULL,
  users_regdt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_expdt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_notes varchar(100),
  users_aplnk varchar(50) DEFAULT 'N',
  users_agent boolean NOT NULL DEFAULT false,
  users_nofcr decimal(18,6) NOT NULL DEFAULT 0,
  users_bsnno decimal(18,6) NOT NULL DEFAULT 0, --no of business
  users_usrno decimal(18,6) NOT NULL DEFAULT 0, --no of users
  
  users_pkgnm varchar(50) NOT NULL, --pack name
  users_cyldt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, --payment cylce date
  users_blval decimal(18,6) NOT NULL DEFAULT 0, --bill value
  users_pymdt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, --last paid date

  -- default 2
  users_actve boolean NOT NULL DEFAULT true,
  users_crusr varchar(50) NOT NULL,
  users_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_upusr varchar(50) NOT NULL,
  users_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_rvnmr integer NOT NULL DEFAULT 1
);