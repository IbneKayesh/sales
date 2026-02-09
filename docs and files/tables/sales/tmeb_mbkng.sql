--
-- Table structure for table tmeb_mbkng
-- sales master list

CREATE TABLE `tmeb_mbkng` (
  `id` VARCHAR(50) NOT NULL,
  `mbkng_users` VARCHAR(50) NOT NULL,
  `mbkng_bsins` VARCHAR(50) NOT NULL,
  `mbkng_cntct` VARCHAR(50) NOT NULL,
  `mbkng_trnno` VARCHAR(50) NOT NULL,
  `mbkng_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `mbkng_refno` VARCHAR(50) DEFAULT NULL,
  `mbkng_trnte` VARCHAR(100) DEFAULT NULL,
  `mbkng_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_vatpy` TINYINT(1) NOT NULL DEFAULT 0,
  `mbkng_incst` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_excst` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_rnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_pyamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_pdamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_duamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_cnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mbkng_ispad` TINYINT(1) NOT NULL DEFAULT 0,
  `mbkng_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `mbkng_iscls` TINYINT(1) NOT NULL DEFAULT 0,
  `mbkng_vatcl` TINYINT(1) NOT NULL DEFAULT 0,
  `mbkng_hscnl` TINYINT(1) NOT NULL DEFAULT 0,
  `mbkng_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `mbkng_crusr` VARCHAR(50) NOT NULL,
  `mbkng_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `mbkng_upusr` VARCHAR(50) NOT NULL,
  `mbkng_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mbkng_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmeb_mbkng
--
ALTER TABLE tmeb_mbkng
  ADD PRIMARY KEY (id);