
--
-- Table structure for table `tmsb_mdule`
-- application modules

CREATE TABLE `tmsb_mdule` (
  `id` varchar(50) NOT NULL,
  `mdule_mname` varchar(50) NOT NULL,
  `mdule_pname` varchar(50) NOT NULL,
  -- optional
  `mdule_micon` varchar(50) DEFAULT NULL,
  `mdule_notes` varchar(255) DEFAULT NULL,
  -- default
  `mdule_odrby` int(11) NOT NULL DEFAULT 0,
  `mdule_actve` tinyint(1) NOT NULL DEFAULT 1,
  `mdule_crusr` varchar(50) NOT NULL,
  `mdule_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mdule_upusr` varchar(50) NOT NULL,
  `mdule_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mdule_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmsb_mdule`
--
ALTER TABLE `tmsb_mdule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_mdule_mname` (`mdule_mname`);