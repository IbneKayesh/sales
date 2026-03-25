--
-- Table structure for table tmib_frmla
-- item ingredients list

CREATE TABLE tmib_frmla (
  id varchar(50) PRIMARY KEY,

  frmla_users VARCHAR(50) NOT NULL,
  frmla_mitem VARCHAR(50) NOT NULL,
  frmla_mtmqt integer NOT NULL DEFAULT 1,
  frmla_sitem VARCHAR(50) NOT NULL,
  frmla_stmqt decimal(4,2) DEFAULT 1.00,
  frmla_costp decimal(4,2) DEFAULT 1.00,
  frmla_inote VARCHAR(50),

  -- default
  frmla_actve boolean NOT NULL DEFAULT true,
  frmla_crusr VARCHAR(50) NOT NULL,
  frmla_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  frmla_upusr VARCHAR(50) NOT NULL,
  frmla_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  frmla_rvnmr integer NOT NULL DEFAULT 1
);