--
-- Table structure for table tmib_cnstk
-- item conversion list

CREATE TABLE tmib_cnstk (
  id varchar(50) PRIMARY KEY,

  cnstk_users VARCHAR(50) NOT NULL,
  cnstk_bsins VARCHAR(50) NOT NULL,
  cnstk_frmla VARCHAR(50) NOT NULL,
  cnstk_mitem VARCHAR(50) NOT NULL,
  cnstk_mtmqt integer NOT NULL DEFAULT 1,
  cnstk_mstkq integer NOT NULL DEFAULT 1,
  cnstk_sitem VARCHAR(50) NOT NULL,
  cnstk_stmqt decimal(4,2) DEFAULT 1.00,
  cnstk_cnqty decimal(4,2) DEFAULT 1.00,
  cnstk_sstkq decimal(4,2) DEFAULT 1.00,

  -- default
  cnstk_actve boolean NOT NULL DEFAULT true,
  cnstk_crusr VARCHAR(50) NOT NULL,
  cnstk_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cnstk_upusr VARCHAR(50) NOT NULL,
  cnstk_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cnstk_rvnmr integer NOT NULL DEFAULT 1
);