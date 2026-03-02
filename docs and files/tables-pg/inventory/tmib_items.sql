--
-- Table structure for table tmib_items
-- item master list

CREATE TABLE tmib_items (
  id varchar(50) PRIMARY KEY,

  items_users VARCHAR(50) NOT NULL,
  items_icode VARCHAR(50) DEFAULT NULL,
  items_bcode VARCHAR(50) DEFAULT NULL,
  items_hscod VARCHAR(50) DEFAULT NULL,
  items_iname VARCHAR(100) NOT NULL,
  items_idesc VARCHAR(100) DEFAULT NULL,
  items_puofm VARCHAR(50) NOT NULL,
  items_dfqty integer NOT NULL DEFAULT 1,
  items_suofm VARCHAR(50) NOT NULL,
  items_ctgry VARCHAR(50) NOT NULL,
  items_brand VARCHAR(50) NOT NULL,
  items_itype VARCHAR(50) NOT NULL,
  items_trcks integer NOT NULL DEFAULT 0,
  items_sdvat decimal(4,2) DEFAULT 0.00,
  items_costp decimal(4,2) DEFAULT 0.00,
  items_image VARCHAR(50) DEFAULT NULL,
  items_nofbi integer NOT NULL DEFAULT 0,


  -- default
  items_actve boolean NOT NULL DEFAULT true,
  items_crusr VARCHAR(50) NOT NULL,
  items_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  items_upusr VARCHAR(50) NOT NULL,
  items_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  items_rvnmr integer NOT NULL DEFAULT 1
);