-- table control code
-- drop table `tmsb_ccode`


CREATE TABLE tmsb_ccode (
      -- default 1
  id varchar(50) PRIMARY KEY,
  ccode_users varchar(50) NOT NULL,  

  -- custom
  ccode_cname varchar(50) NOT NULL,
  ccode_prfix varchar(50) NOT NULL,
  ccode_prlen integer NOT NULL DEFAULT 1,
  ccode_pfdmy varchar(50) NOT NULL, --Prefix DD MM YY

  -- default 2
  ccode_actve boolean NOT NULL DEFAULT true,
  ccode_crusr varchar(50) NOT NULL,
  ccode_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ccode_upusr varchar(50) NOT NULL,
  ccode_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ccode_rvnmr integer NOT NULL DEFAULT 1
);