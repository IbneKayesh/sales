-- master users
-- drop table `tmsb_files`


CREATE TABLE tmsb_files (
  -- default 1
  id varchar(50) PRIMARY KEY,
  files_users VARCHAR(50) NOT NULL,
  files_bsins VARCHAR(50) NOT NULL,
  files_ccode VARCHAR(50) NOT NULL,
  files_sorce VARCHAR(50) NOT NULL,
  files_refid VARCHAR(50) NOT NULL,
  
  -- custom
  files_cname VARCHAR(100) NOT NULL,
  files_ftype VARCHAR(50) NOT NULL,
  files_fsize VARCHAR(50) NOT NULL,
  files_links VARCHAR(350) NOT NULL,
  
  -- default 2
  files_actve boolean NOT NULL DEFAULT true,
  files_crusr varchar(50) NOT NULL,
  files_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  files_upusr varchar(50) NOT NULL,
  files_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  files_rvnmr integer NOT NULL DEFAULT 1
);