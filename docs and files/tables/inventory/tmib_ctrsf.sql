--
-- Table structure for table tmib_ctrsf

CREATE TABLE `tmib_ctrsf` (
  `id` VARCHAR(50) NOT NULL,
  `ctrsf_mtrsf` VARCHAR(50) NOT NULL,
  `ctrsf_bitem` VARCHAR(50) NOT NULL,
  `ctrsf_items` VARCHAR(50) NOT NULL,
  `ctrsf_itrat` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_itqty` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_notes` VARCHAR(50) DEFAULT NULL,
  `ctrsf_attrb` VARCHAR(300) DEFAULT NULL,
  `ctrsf_rtqty` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_slqty` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_ohqty` decimal(20,6) NOT NULL DEFAULT 0,
  `ctrsf_srcnm` VARCHAR(50) NOT NULL,
  `ctrsf_refid` VARCHAR(50) NOT NULL,
  `ctrsf_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `ctrsf_crusr` VARCHAR(50) NOT NULL,
  `ctrsf_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `ctrsf_upusr` VARCHAR(50) NOT NULL,
  `ctrsf_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ctrsf_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmib_ctrsf
--
ALTER TABLE tmib_ctrsf
  ADD PRIMARY KEY (id);

