--
-- Table structure for table toeb_fodrc
-- sales booking list

CREATE TABLE `toeb_fodrc` (
  `id` VARCHAR(50) NOT NULL,
  `fodrc_fodrm` VARCHAR(50) NOT NULL,
  `fodrc_bitem` VARCHAR(50) NOT NULL,
  `fodrc_items` VARCHAR(50) NOT NULL,
  `fodrc_itrat` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_itqty` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_notes` VARCHAR(50) DEFAULT NULL,
  `fodrc_attrb` VARCHAR(300) DEFAULT NULL,
  `fodrc_dlqty` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_dgqty` decimal(20,6) NOT NULL DEFAULT 0,
  `fodrc_srcnm` VARCHAR(50) NOT NULL,
  `fodrc_refid` VARCHAR(50) NOT NULL,
  `fodrc_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `fodrc_crusr` VARCHAR(50) NOT NULL,
  `fodrc_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `fodrc_upusr` VARCHAR(50) NOT NULL,
  `fodrc_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fodrc_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table toeb_fodrc
--
ALTER TABLE toeb_fodrc
  ADD PRIMARY KEY (id);

