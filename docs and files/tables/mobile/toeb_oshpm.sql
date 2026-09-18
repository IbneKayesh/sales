--
-- Table structure for table toeb_oshpm
-- sales order master list

CREATE TABLE `toeb_oshpm` (
  `id` VARCHAR(50) NOT NULL,
  `oshpm_users` VARCHAR(50) NOT NULL,
  `oshpm_bsins` VARCHAR(50) NOT NULL,
  `oshpm_cntct` VARCHAR(50) NOT NULL,
  `oshpm_dlvan` VARCHAR(50) NOT NULL,
  `oshpm_trnno` VARCHAR(50) NOT NULL,
  `oshpm_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `oshpm_trnte` VARCHAR(100) DEFAULT NULL,
  `oshpm_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_dlamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_rnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_pyamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_pdamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_duamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpm_ispad` TINYINT(1) NOT NULL DEFAULT 0,
  `oshpm_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `oshpm_iscls` TINYINT(1) NOT NULL DEFAULT 0,
  `oshpm_vatcl` TINYINT(1) NOT NULL DEFAULT 0,
  `oshpm_isodr` TINYINT(1) NOT NULL DEFAULT 0,
  `oshpm_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `oshpm_crusr` VARCHAR(50) NOT NULL,
  `oshpm_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `oshpm_upusr` VARCHAR(50) NOT NULL,
  `oshpm_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `oshpm_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table toeb_oshpm
--
ALTER TABLE toeb_oshpm
  ADD PRIMARY KEY (id);