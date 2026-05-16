
--
-- Table structure for table tmnb_tcode
-- table data codes

CREATE TABLE tmnb_tcode (
  id varchar(50) PRIMARY KEY,

  tcode_apusr varchar(50) NOT NULL,
  tcode_tname varchar(50) NOT NULL,
  tcode_prfix varchar(50) NOT NULL,
  tcode_prlen integer NOT NULL DEFAULT 1,
  -- optional

  -- default
  tcode_actve boolean NOT NULL DEFAULT true,
  tcode_crusr varchar(50) NOT NULL,
  tcode_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tcode_upusr varchar(50) NOT NULL,
  tcode_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tcode_rvnmr integer NOT NULL DEFAULT 1
);