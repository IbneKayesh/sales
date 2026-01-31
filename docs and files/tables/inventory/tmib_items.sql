--
-- Table structure for table tmib_items
-- item master list

CREATE TABLE `tmib_items` (
  `id` VARCHAR(50) NOT NULL,
  `items_users` VARCHAR(50) NOT NULL,
  `items_icode` VARCHAR(50) DEFAULT NULL,
  `items_bcode` VARCHAR(50) DEFAULT NULL,
  `items_hscod` VARCHAR(50) DEFAULT NULL,
  `items_iname` VARCHAR(100) NOT NULL,
  `items_idesc` VARCHAR(100) DEFAULT NULL,
  `items_puofm` VARCHAR(50) NOT NULL,
  `items_dfqty` INT NOT NULL DEFAULT 1,
  `items_suofm` VARCHAR(50) NOT NULL,
  `items_ctgry` VARCHAR(50) NOT NULL,
  `items_itype` VARCHAR(50) NOT NULL,
  `items_trcks` INT NOT NULL DEFAULT 0,
  `items_sdvat` decimal(4,2) DEFAULT 0.00,
  `items_costp` decimal(4,2) DEFAULT 0.00,
  `items_image` VARCHAR(50) DEFAULT NULL,
  `items_nofbi` INT NOT NULL DEFAULT 0,
  `items_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `items_crusr` VARCHAR(50) NOT NULL,
  `items_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `items_upusr` VARCHAR(50) NOT NULL,
  `items_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `items_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmib_items
--
ALTER TABLE tmib_items
  ADD PRIMARY KEY (id);