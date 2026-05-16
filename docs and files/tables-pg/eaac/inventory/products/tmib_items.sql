--
-- Table structure for table tmib_items
-- item master list

CREATE TABLE tmib_items (
  id varchar(50) PRIMARY KEY,

  items_apusr VARCHAR(50) NOT NULL,
  items_bsins VARCHAR(50) NOT NULL,
  items_icode VARCHAR(50) NOT NULL,
  items_iname VARCHAR(100) NOT NULL,
  items_brcod VARCHAR(50) DEFAULT NULL,
  items_hscod VARCHAR(50) DEFAULT NULL,
  items_notes VARCHAR(50) DEFAULT NULL,
  items_runit VARCHAR(50) NOT NULL,
  items_pkqty integer NOT NULL DEFAULT 1,
  items_punit VARCHAR(50) NOT NULL,
  items_sgrup VARCHAR(50) NOT NULL,
  items_scatg VARCHAR(50) NOT NULL,
  items_itype VARCHAR(2) NOT NULL,
  items_brand VARCHAR(50) NOT NULL,
  items_tstck boolean NOT NULL DEFAULT true,
  items_sdvat decimal(4,2) DEFAULT 0.00,
  items_smrgn decimal(4,2) DEFAULT 0.00,
  items_fxcst decimal(4,2) DEFAULT 0.00,
  items_image VARCHAR(50) DEFAULT NULL,
  items_stpur boolean NOT NULL DEFAULT true,
  items_stsal boolean NOT NULL DEFAULT true,
  items_stnsf boolean NOT NULL DEFAULT true,
  -- default
  items_actve boolean NOT NULL DEFAULT true,
  items_crusr VARCHAR(50) NOT NULL,
  items_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  items_upusr VARCHAR(50) NOT NULL,
  items_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  items_rvnmr integer NOT NULL DEFAULT 1
);