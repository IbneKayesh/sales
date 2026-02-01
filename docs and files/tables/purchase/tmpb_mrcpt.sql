--
-- Table structure for table tmpb_mrcpt
-- purchase receipt master list

CREATE TABLE `tmpb_mrcpt` (
  `id` VARCHAR(50) NOT NULL,
  `mrcpt_users` VARCHAR(50) NOT NULL,
  `mrcpt_bsins` VARCHAR(50) NOT NULL,
  `mrcpt_cntct` VARCHAR(50) NOT NULL,
  `mrcpt_trnno` VARCHAR(50) NOT NULL,
  `mrcpt_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `mrcpt_refno` VARCHAR(50) DEFAULT NULL,
  `mrcpt_trnte` VARCHAR(100) DEFAULT NULL,
  `mrcpt_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_vatpy` TINYINT(1) NOT NULL DEFAULT 0,
  `mrcpt_incst` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_excst` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_rnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_pyamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_pdamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_duamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_rtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `mrcpt_ispad` TINYINT(1) NOT NULL DEFAULT 0,
  `mrcpt_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `mrcpt_iscls` TINYINT(1) NOT NULL DEFAULT 0,
  `mrcpt_vatcl` TINYINT(1) NOT NULL DEFAULT 0,
  `mrcpt_hscnl` TINYINT(1) NOT NULL DEFAULT 0,
  `mrcpt_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `mrcpt_crusr` VARCHAR(50) NOT NULL,
  `mrcpt_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `mrcpt_upusr` VARCHAR(50) NOT NULL,
  `mrcpt_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mrcpt_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_mrcpt
--
ALTER TABLE tmpb_mrcpt
  ADD PRIMARY KEY (id);