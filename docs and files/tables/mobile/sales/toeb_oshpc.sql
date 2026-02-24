--
-- Table structure for table toeb_oshpc
-- sales booking list

CREATE TABLE `toeb_oshpc` (
  `id` VARCHAR(50) NOT NULL,
  `oshpc_oshpm` VARCHAR(50) NOT NULL,
  `oshpc_bitem` VARCHAR(50) NOT NULL,
  `oshpc_items` VARCHAR(50) NOT NULL,
  `oshpc_itrat` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_itqty` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_notes` VARCHAR(50) DEFAULT NULL,
  `oshpc_attrb` VARCHAR(300) DEFAULT NULL,
  `oshpc_dlqty` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_dgqty` decimal(20,6) NOT NULL DEFAULT 0,
  `oshpc_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `oshpc_crusr` VARCHAR(50) NOT NULL,
  `oshpc_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `oshpc_upusr` VARCHAR(50) NOT NULL,
  `oshpc_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `oshpc_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table toeb_oshpc
--
ALTER TABLE toeb_oshpc
  ADD PRIMARY KEY (id);

