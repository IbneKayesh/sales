--
-- Table structure for table tmhb_lvapp
--

CREATE TABLE tmhb_lvapp (
  id VARCHAR(50) PRIMARY KEY,

  lvapp_users VARCHAR(50) NOT NULL,
  lvapp_bsins VARCHAR(50) NOT NULL,
  lvapp_atnst VARCHAR(50) NOT NULL,
  lvapp_emply VARCHAR(50) NOT NULL,
  lvapp_yerid integer NOT NULL DEFAULT 0,
  lvapp_frdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapp_todat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapp_today integer NOT NULL DEFAULT 0,
  lvapp_notes VARCHAR(50),
  lvapp_fsapp VARCHAR(50),
  lvapp_fsdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

   -- default
  lvapp_actve boolean NOT NULL DEFAULT true,
  lvapp_crusr VARCHAR(50) NOT NULL,
  lvapp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapp_upusr VARCHAR(50) NOT NULL,
  lvapp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvapp_rvnmr integer NOT NULL DEFAULT 1
);