--
-- Table structure for table tmpb_recpt
-- purchase booking list

CREATE TABLE `tmpb_recpt` (
  `id` VARCHAR(50) NOT NULL,
  `recpt_pmstr` VARCHAR(50) NOT NULL,
  `recpt_bitem` VARCHAR(50) NOT NULL,
  `recpt_items` VARCHAR(50) NOT NULL,
  `recpt_bkrat` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_bkqty` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_notes` VARCHAR(50) DEFAULT NULL,
  `recpt_rtqty` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_slqty` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_ohqty` decimal(20,6) NOT NULL DEFAULT 0,
  `recpt_bking` VARCHAR(50) NOT NULL,
  `recpt_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `recpt_crusr` VARCHAR(50) NOT NULL,
  `recpt_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `recpt_upusr` VARCHAR(50) NOT NULL,
  `recpt_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `recpt_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_recpt
--
ALTER TABLE tmpb_recpt
  ADD PRIMARY KEY (id);