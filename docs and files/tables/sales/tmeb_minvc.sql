--
-- Table structure for table tmeb_minvc
-- sales invoice master list

CREATE TABLE `tmeb_minvc` (
  `id` VARCHAR(50) NOT NULL,
  `minvc_users` VARCHAR(50) NOT NULL,
  `minvc_bsins` VARCHAR(50) NOT NULL,
  `minvc_cntct` VARCHAR(50) NOT NULL,
  `minvc_trnno` VARCHAR(50) NOT NULL,
  `minvc_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `minvc_refno` VARCHAR(50) DEFAULT NULL,
  `minvc_trnte` VARCHAR(100) DEFAULT NULL,
  `minvc_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_vatpy` TINYINT(1) NOT NULL DEFAULT 0,
  `minvc_incst` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_excst` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_rnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_pyamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_pdamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_duamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_rtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `minvc_ispad` TINYINT(1) NOT NULL DEFAULT 0,
  `minvc_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `minvc_iscls` TINYINT(1) NOT NULL DEFAULT 0,
  `minvc_vatcl` TINYINT(1) NOT NULL DEFAULT 0,
  `minvc_hscnl` TINYINT(1) NOT NULL DEFAULT 0,
  `minvc_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `minvc_crusr` VARCHAR(50) NOT NULL,
  `minvc_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `minvc_upusr` VARCHAR(50) NOT NULL,
  `minvc_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `minvc_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmeb_minvc
--
ALTER TABLE tmeb_minvc
  ADD PRIMARY KEY (id);