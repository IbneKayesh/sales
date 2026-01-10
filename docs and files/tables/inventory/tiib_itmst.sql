--
-- Table structure for table tiib_itmst
-- item master list

CREATE TABLE tiib_itmst (
  `id` VARCHAR(50) NOT NULL,
  `itmst_users` VARCHAR(50) NOT NULL,
  `itmst_itmsi` VARCHAR(50) NOT NULL,
  `itmst_itmvt` VARCHAR(50) NOT NULL,
  `itmst_bsins` VARCHAR(50) NOT NULL,
  `itmst_lprat` decimal(20,6) DEFAULT 0.00,
  `itmst_dprat` decimal(20,6) DEFAULT 0.00,
  `itmst_mcmrp` decimal(20,6) DEFAULT 0.00,
  `itmst_sddsp` decimal(20,6) DEFAULT 0.00,
  `itmst_snote` VARCHAR(100),
  `itmst_gstkq` decimal(20,6) DEFAULT 0.00,
  `itmst_bstkq` decimal(20,6) DEFAULT 0.00,
  `itmst_mnqty` decimal(20,6) DEFAULT 1,
  `itmst_mxqty` decimal(20,6) DEFAULT 1,
  `itmst_trgpr` decimal(20,6) DEFAULT 0.00,
  `itmst_trgsl` decimal(20,6) DEFAULT 0.00,
  `itmst_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `itmst_crusr` VARCHAR(50) NOT NULL,
  `itmst_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `itmst_upusr` VARCHAR(50) NOT NULL,
  `itmst_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `itmst_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tiib_itmst
--
ALTER TABLE tiib_itmst
  ADD PRIMARY KEY (id);

