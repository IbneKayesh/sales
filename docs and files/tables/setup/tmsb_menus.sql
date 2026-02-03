
--
-- Table structure for table `tmsb_menus`
-- menus

CREATE TABLE `tmsb_menus` (
  `id` varchar(50) NOT NULL,
  `menus_mdule` varchar(50) NOT NULL,
  `menus_gname` varchar(50) NOT NULL,
  `menus_gicon` varchar(50) NOT NULL,
  `menus_mname` varchar(50) NOT NULL,
  -- optional
  `menus_pname` varchar(50) DEFAULT NULL,
  `menus_micon` varchar(50) DEFAULT NULL,
  `menus_mlink` varchar(255) DEFAULT NULL,
  `menus_notes` varchar(255) DEFAULT NULL,
  -- default
  `menus_odrby` int(11) NOT NULL DEFAULT 0,
  `menus_actve` tinyint(1) NOT NULL DEFAULT 1,
  `menus_crusr` varchar(50) NOT NULL,
  `menus_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `menus_upusr` varchar(50) NOT NULL,
  `menus_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `menus_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmsb_menus`
--
ALTER TABLE `tmsb_menus`
  ADD PRIMARY KEY (`id`);