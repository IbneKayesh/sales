--
-- Table structure for table tmeb_fodrm
-- sales order master list

CREATE TABLE `tmeb_fodrm` (
  `id` VARCHAR(50) NOT NULL,
  `fodrm_users` VARCHAR(50) NOT NULL,
  `fodrm_bsins` VARCHAR(50) NOT NULL,
  `fodrm_cntct` VARCHAR(50) NOT NULL,
  `fodrm_ocuid` VARCHAR(50) NOT NULL,
  `fodrm_rutes` VARCHAR(50) NOT NULL,
  `fodrm_trnno` VARCHAR(50) NOT NULL,
  `fodrm_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `fodrm_trnte` VARCHAR(100) DEFAULT NULL,
  `fodrm_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_dlamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_rnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_pyamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_pdamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_duamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrm_ispad` TINYINT(1) NOT NULL DEFAULT 0,
  `fodrm_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `fodrm_iscls` TINYINT(1) NOT NULL DEFAULT 0,
  `fodrm_vatcl` TINYINT(1) NOT NULL DEFAULT 0,
  `fodrm_dlvan` VARCHAR(50) NOT NULL,
  `fodrm_dldat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `fodrm_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `fodrm_crusr` VARCHAR(50) NOT NULL,
  `fodrm_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `fodrm_upusr` VARCHAR(50) NOT NULL,
  `fodrm_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fodrm_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmeb_fodrm
--
ALTER TABLE tmeb_fodrm
  ADD PRIMARY KEY (id);