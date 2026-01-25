--
-- Table structure for table tmpb_cbkng
-- purchase booking list

CREATE TABLE `tmpb_cbkng` (
  `id` VARCHAR(50) NOT NULL,
  `cbkng_mbkng` VARCHAR(50) NOT NULL,
  `cbkng_bitem` VARCHAR(50) NOT NULL,
  `cbkng_items` VARCHAR(50) NOT NULL,
  `cbkng_itrat` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_itqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_notes` VARCHAR(50) DEFAULT NULL,
  `cbkng_attrb` VARCHAR(300) DEFAULT NULL,
  `cbkng_cnqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_rcqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_pnqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cbkng_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `cbkng_crusr` VARCHAR(50) NOT NULL,
  `cbkng_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `cbkng_upusr` VARCHAR(50) NOT NULL,
  `cbkng_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cbkng_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_cbkng
--
ALTER TABLE tmpb_cbkng
  ADD PRIMARY KEY (id);

