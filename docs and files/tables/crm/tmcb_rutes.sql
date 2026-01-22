--
-- Table structure for table `tmcb_rutes`
--

CREATE TABLE `tmcb_rutes` (
  `id` varchar(50) NOT NULL,
  `rutes_users` varchar(50) NOT NULL,
  `rutes_bsins` varchar(50) NOT NULL,
  `rutes_rname` varchar(50) NOT NULL,
  `rutes_dname` varchar(50) NOT NULL,
  `rutes_sraid` varchar(50) NOT NULL,  
  -- optional
  -- default
  `rutes_lvdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rutes_ttcnt` decimal(18,6) NOT NULL DEFAULT 0,
  `rutes_odval` decimal(18,6) NOT NULL DEFAULT 0,
  `rutes_dlval` decimal(18,6) NOT NULL DEFAULT 0,
  `rutes_clval` decimal(18,6) NOT NULL DEFAULT 0,
  `rutes_duval` decimal(18,6) NOT NULL DEFAULT 0,
  `rutes_actve` tinyint(1) NOT NULL DEFAULT 1,
  `rutes_crusr` varchar(50) NOT NULL,
  `rutes_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rutes_upusr` varchar(50) NOT NULL,
  `rutes_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rutes_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_rutes`
--
ALTER TABLE `tmcb_rutes`
  ADD PRIMARY KEY (`id`);