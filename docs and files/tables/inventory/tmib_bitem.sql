--
-- Table structure for table tmib_bitem
-- item master business

CREATE TABLE tmib_bitem (
  `id` VARCHAR(50) NOT NULL,
  `bitem_users` VARCHAR(50) NOT NULL,
  `bitem_items` VARCHAR(50) NOT NULL,
  `bitem_bsins` VARCHAR(50) NOT NULL,
  `bitem_lprat` decimal(20,6) DEFAULT 0.00,
  `bitem_dprat` decimal(20,6) DEFAULT 0.00,
  `bitem_mcmrp` decimal(20,6) DEFAULT 0.00,
  `bitem_sddsp` decimal(20,6) DEFAULT 0.00,
  `bitem_snote` VARCHAR(100),
  `bitem_gstkq` decimal(20,6) DEFAULT 0.00,
  `bitem_bstkq` decimal(20,6) DEFAULT 0.00,
  `bitem_mnqty` decimal(20,6) DEFAULT 1,
  `bitem_mxqty` decimal(20,6) DEFAULT 1,
  `bitem_pbqty` decimal(20,6) DEFAULT 0.00,
  `bitem_sbqty` decimal(20,6) DEFAULT 0.00,
  `bitem_mpric` decimal(20,6) DEFAULT 0.00,
  `bitem_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `bitem_crusr` VARCHAR(50) NOT NULL,
  `bitem_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `bitem_upusr` VARCHAR(50) NOT NULL,
  `bitem_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bitem_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmib_bitem
--
ALTER TABLE tmib_bitem
  ADD PRIMARY KEY (id);