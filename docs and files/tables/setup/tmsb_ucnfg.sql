
--
-- Table structure for table `tmsb_ucnfg`
-- user configuration

CREATE TABLE `tmsb_ucnfg` (
  `id` varchar(50) NOT NULL,
  `ucnfg_users` varchar(50) NOT NULL,
  `ucnfg_bsins` varchar(50) NOT NULL,
  -- optional
  `ucnfg_cname` varchar(50) DEFAULT NULL,
  `ucnfg_gname` varchar(50) DEFAULT NULL,
  `ucnfg_label` varchar(50) DEFAULT NULL,
  `ucnfg_value` varchar(50) DEFAULT NULL,
  `ucnfg_notes` varchar(50) DEFAULT NULL,
  -- default
  `ucnfg_actve` tinyint(1) NOT NULL DEFAULT 1,
  `ucnfg_crusr` varchar(50) NOT NULL,
  `ucnfg_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ucnfg_upusr` varchar(50) NOT NULL,
  `ucnfg_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ucnfg_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmsb_ucnfg`
--
ALTER TABLE `tmsb_ucnfg`
  ADD PRIMARY KEY (`id`);