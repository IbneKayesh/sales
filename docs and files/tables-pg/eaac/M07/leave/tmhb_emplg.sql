--
-- Table structure for table tmhb_emplg
-- Employee Leave Group Assignments
--

CREATE TABLE tmhb_emplg (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emplg_users VARCHAR(50) NOT NULL,
  emplg_bsins VARCHAR(50) NOT NULL,
  emplg_ccode VARCHAR(50) NOT NULL,

  -- custom
  emplg_emply VARCHAR(50) NOT NULL, -- employee id
  emplg_lvgrp VARCHAR(50) NOT NULL, -- leave group id
  emplg_efrmd date NOT NULL, -- effective from date
  emplg_etodt date, -- effective to date (null for ongoing)
  emplg_notes VARCHAR(255), -- remarks

  -- default 2
  emplg_actve boolean NOT NULL DEFAULT true,
  emplg_crusr VARCHAR(50) NOT NULL,
  emplg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emplg_upusr VARCHAR(50) NOT NULL,
  emplg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emplg_rvnmr integer NOT NULL DEFAULT 1
);
