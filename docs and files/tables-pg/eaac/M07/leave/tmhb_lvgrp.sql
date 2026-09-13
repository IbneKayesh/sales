--
-- Table structure for table tmhb_lvgrp
-- Leave Groups (e.g. Factory Workers, Office Staff, Management)
--

CREATE TABLE tmhb_lvgrp (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvgrp_users VARCHAR(50) NOT NULL,
  lvgrp_bsins VARCHAR(50) NOT NULL,
  lvgrp_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvgrp_gcode VARCHAR(50) NOT NULL, -- leave group code
  lvgrp_gname VARCHAR(100) NOT NULL, -- leave group name
  lvgrp_notes VARCHAR(255), -- description / notes

  -- default 2
  lvgrp_actve boolean NOT NULL DEFAULT true,
  lvgrp_crusr VARCHAR(50) NOT NULL,
  lvgrp_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvgrp_upusr VARCHAR(50) NOT NULL,
  lvgrp_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvgrp_rvnmr integer NOT NULL DEFAULT 1
);
