--
-- Table structure for table `tmsb_users`
-- master users and workstation users


CREATE TABLE tmsb_users (
  id varchar(50) PRIMARY KEY,

  users_email varchar(50) NOT NULL UNIQUE,
  users_pswrd varchar(50) NOT NULL,
  users_recky varchar(50) NOT NULL,
  users_oname varchar(255) NOT NULL,

  -- optional
  users_cntct varchar(50),
  users_bsins varchar(50),
  users_drole varchar(50),
  users_users varchar(50),

  users_stats integer NOT NULL DEFAULT 0,
  users_regno varchar(50),

  users_regdt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_ltokn varchar(50),

  users_lstgn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_lstpd timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  users_wctxt varchar(100),
  users_notes varchar(100),

  users_nofcr decimal(16,2) NOT NULL DEFAULT 0.00,
  users_isrgs boolean NOT NULL DEFAULT true,

  -- default
  users_actve boolean NOT NULL DEFAULT true,
  users_crusr varchar(50) NOT NULL,
  users_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_upusr varchar(50) NOT NULL,
  users_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  users_rvnmr integer NOT NULL DEFAULT 1
);