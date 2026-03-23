--
-- Table structure for table tmtb_exptr
--

CREATE TABLE tmtb_exptr (
  id varchar(50) PRIMARY KEY,

  exptr_users varchar(50) NOT NULL,
  exptr_bsins varchar(50) NOT NULL,
  exptr_exctg varchar(50) NOT NULL,
  exptr_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exptr_trnte varchar(150) NOT NULL,
  exptr_examt decimal(18,6) NOT NULL DEFAULT 0,

  -- optional

  -- default
  exptr_actve boolean NOT NULL DEFAULT true,
  exptr_crusr varchar(50) NOT NULL,
  exptr_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exptr_upusr varchar(50) NOT NULL,
  exptr_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exptr_rvnmr integer NOT NULL DEFAULT 1
);