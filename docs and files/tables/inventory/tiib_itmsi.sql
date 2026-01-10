--
-- Table structure for table tiib_itmsi
-- item master list

CREATE TABLE `tiib_itmsi` (
  `id` VARCHAR(50) NOT NULL,
  `itmsi_users` VARCHAR(50) NOT NULL,
  `itmsi_icode` VARCHAR(50) NOT NULL DEFAULT '-',
  `itmsi_hscod` VARCHAR(50) NOT NULL DEFAULT '-',
  `itmsi_iname` VARCHAR(100) NOT NULL,
  `itmsi_idesc` VARCHAR(100) NULL DEFAULT NULL,
  `itmsi_puofm` VARCHAR(50) NOT NULL,
  `itmsi_ctgry` VARCHAR(50) NOT NULL,
  `itmsi_itype` VARCHAR(50) NOT NULL,
  `itmsi_igrup` VARCHAR(50) NOT NULL,
  `itmsi_hwrnt` INT NOT NULL DEFAULT 0,
  `itmsi_hxpry` INT NOT NULL DEFAULT 0,
  `itmsi_sdvat` decimal(4,2) DEFAULT 0.00,
  `itmsi_stkmd` VARCHAR(50) NOT NULL,
  `itmsi_image` VARCHAR(50),
  `itmsi_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `itmsi_crusr` VARCHAR(50) NOT NULL,
  `itmsi_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `itmsi_upusr` VARCHAR(50) NOT NULL,
  `itmsi_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `itmsi_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tiib_itmsi
--
ALTER TABLE tiib_itmsi
  ADD PRIMARY KEY (id);
