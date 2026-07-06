--employee list

CREATE TABLE tmhb_emply (
  -- default 1
  id varchar(50) PRIMARY KEY,
  emply_users varchar(50) NOT NULL,
  emply_bsins varchar(50) NOT NULL,
  emply_ccode varchar(50) NOT NULL,

  -- custom
  emply_cname varchar(50) NOT NULL,
  emply_cntno varchar(50) NOT NULL,
  emply_email varchar(50) NOT NULL,
  emply_pswrd varchar(50) NOT NULL,
  emply_recky varchar(50) NOT NULL,
  emply_ltokn varchar(50) NOT NULL,
  emply_lstgn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_lstpd timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_isprm boolean NOT NULL DEFAULT false,
  emply_urole varchar(50) NOT NULL DEFAULT 'USER',
  -- add more columns for employees
  emply_crdno varchar(50) NOT NULL,
  
  -- default 2
  emply_actve boolean NOT NULL DEFAULT true,
  emply_crusr varchar(50) NOT NULL,
  emply_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_upusr varchar(50) NOT NULL,
  emply_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_rvnmr integer NOT NULL DEFAULT 1
);