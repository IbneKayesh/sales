--
-- Table structure for table tmpb_bking
-- purchase booking list

CREATE TABLE `tmpb_bking` (
  `id` VARCHAR(50) NOT NULL,
  `bking_pmstr` VARCHAR(50) NOT NULL,
  `bking_bitem` VARCHAR(50) NOT NULL,
  `bking_items` VARCHAR(50) NOT NULL,
  `bking_bkrat` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_bkqty` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_notes` VARCHAR(50) DEFAULT NULL,
  `bking_cnqty` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_rcqty` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_pnqty` decimal(20,6) NOT NULL DEFAULT 0,
  `bking_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `bking_crusr` VARCHAR(50) NOT NULL,
  `bking_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `bking_upusr` VARCHAR(50) NOT NULL,
  `bking_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bking_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_bking
--
ALTER TABLE tmpb_bking
  ADD PRIMARY KEY (id);