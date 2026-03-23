--
-- Table structure for table tmtb_bacts
--

CREATE TABLE tmtb_bacts (
  id varchar(50) PRIMARY KEY,

  bacts_users varchar(50) NOT NULL,
  bacts_bsins varchar(50) NOT NULL,
  bacts_bankn varchar(100) NOT NULL,

  -- optional
  bacts_brnch varchar(100),
  bacts_routn varchar(50),
  bacts_acnam varchar(100),
  bacts_acnum varchar(100),
  bacts_notes varchar(300),

  -- default
  bacts_opdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bacts_crbln decimal(18,6) NOT NULL DEFAULT 0,
  bacts_isdef  boolean NOT NULL DEFAULT false,

  bacts_actve boolean NOT NULL DEFAULT true,
  bacts_crusr varchar(50) NOT NULL,
  bacts_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bacts_upusr varchar(50) NOT NULL,
  bacts_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bacts_rvnmr integer NOT NULL DEFAULT 1
);