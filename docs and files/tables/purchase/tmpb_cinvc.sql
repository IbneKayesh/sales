--
-- Table structure for table tmpb_cinvc
-- purchase invoice list

CREATE TABLE `tmpb_cinvc` (
  `id` VARCHAR(50) NOT NULL,
  `cinvc_minvc` VARCHAR(50) NOT NULL,
  `cinvc_bitem` VARCHAR(50) NOT NULL,
  `cinvc_items` VARCHAR(50) NOT NULL,
  `cinvc_itrat` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_itqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_itamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_dspct` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_vtpct` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_csrat` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_ntamt` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_notes` VARCHAR(50) DEFAULT NULL,
  `cinvc_attrb` VARCHAR(300) DEFAULT NULL,
  `cinvc_rtqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_slqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_ohqty` decimal(20,6) NOT NULL DEFAULT 0,
  `cinvc_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `cinvc_crusr` VARCHAR(50) NOT NULL,
  `cinvc_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `cinvc_upusr` VARCHAR(50) NOT NULL,
  `cinvc_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cinvc_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_cinvc
--
ALTER TABLE tmpb_cinvc
  ADD PRIMARY KEY (id);