--
-- Table structure for table tmpb_crcpt
-- purchase booking list

CREATE TABLE `tmpb_crcpt` (
  `id` VARCHAR(50) NOT NULL,
  `crcpt_mrcpt` VARCHAR(50) NOT NULL,
  `crcpt_bitem` VARCHAR(50) NOT NULL,
  `crcpt_items` VARCHAR(50) NOT NULL,
  `crcpt_itrat` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_itqty` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_notes` VARCHAR(50) DEFAULT NULL,
  `crcpt_rtqty` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_slqty` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_ohqty` decimal(20,6) NOT NULL DEFAULT 0,
  `crcpt_cbkng` VARCHAR(50) NOT NULL,
  `crcpt_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `crcpt_crusr` VARCHAR(50) NOT NULL,
  `crcpt_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `crcpt_upusr` VARCHAR(50) NOT NULL,
  `crcpt_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `crcpt_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_crcpt
--
ALTER TABLE tmpb_crcpt
  ADD PRIMARY KEY (id);