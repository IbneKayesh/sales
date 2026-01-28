--
-- Table structure for table tmib_mtrsf

CREATE TABLE `tmib_mtrsf` (
  `id` VARCHAR(50) NOT NULL,
  `mtrsf_users` VARCHAR(50) NOT NULL,
  `mtrsf_bsins` VARCHAR(50) NOT NULL,
  `mtrsf_bsins_to` VARCHAR(50) NOT NULL,
  `mtrsf_trnno` VARCHAR(50) NOT NULL,
  `mtrsf_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `mtrsf_refno` VARCHAR(50) DEFAULT NULL,
  `mtrsf_trnte` VARCHAR(100) DEFAULT NULL,
  `mtrsf_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mtrsf_incst` decimal(20,6) NOT NULL DEFAULT 0,
  `mtrsf_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mtrsf_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `mtrsf_isrcv` TINYINT(1) NOT NULL DEFAULT 0,
  `mtrsf_rcusr` VARCHAR(50) DEFAULT NULL,
  `mtrsf_rcdat` DATETIME DEFAULT NULL,
  `mtrsf_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `mtrsf_crusr` VARCHAR(50) NOT NULL,
  `mtrsf_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `mtrsf_upusr` VARCHAR(50) NOT NULL,
  `mtrsf_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mtrsf_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmib_mtrsf
--
ALTER TABLE tmib_mtrsf
  ADD PRIMARY KEY (id);