--
-- Table structure for table tmhb_emply
-- hrms employee list

CREATE TABLE tmhb_emply (
  id varchar(50) PRIMARY KEY,

  emply_users varchar(50) NOT NULL,
  emply_bsins varchar(50) NOT NULL,


-- Office Id
  emply_ecode varchar(50),
  emply_crdno varchar(50),

-- Personal Information
  emply_ename varchar(50) NOT NULL,
  emply_econt varchar(50) NOT NULL,  

-- optional
  emply_email varchar(50),
  emply_natid varchar(50),
  emply_bdate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_prnam varchar(50),
  emply_gendr varchar(50),
  emply_mstas varchar(50),
  emply_bgrup varchar(50),
  emply_rlgon varchar(50),
  emply_edgrd varchar(50),
  emply_psadr varchar(100),
  emply_pradr varchar(100),

-- Office information
  emply_desig varchar(50),
  emply_jndat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_cndat timestamp,
  emply_rgdat timestamp,
  emply_gssal DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  emply_otrat DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  emply_etype VARCHAR(50),
  emply_pyacc VARCHAR(50),
  emply_slcyl VARCHAR(50),
  emply_wksft VARCHAR(50),
  emply_supid VARCHAR(50),
  emply_notes VARCHAR(50),
  
-- default
  emply_login boolean NOT NULL DEFAULT false,
  emply_pswrd varchar(50),
  emply_pictr varchar(50),
  emply_stats varchar(50) NOT NULL,

  emply_actve boolean NOT NULL DEFAULT true,
  emply_crusr varchar(50) NOT NULL,
  emply_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_upusr varchar(50) NOT NULL,
  emply_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_rvnmr integer NOT NULL DEFAULT 1
);