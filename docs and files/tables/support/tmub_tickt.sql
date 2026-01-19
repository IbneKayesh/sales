--
-- Table structure for table `tmub_tickt`
--

CREATE TABLE `tmub_tickt` (
  `id` varchar(50) NOT NULL,
  `tickt_users` varchar(50) NOT NULL,
  `tickt_types` varchar(50) NOT NULL,
  `tickt_cmnte` varchar(300) NOT NULL,
  `tickt_cmdat` datetime NOT NULL DEFAULT current_timestamp(),
  -- optional
  `tickt_rsnte` varchar(300) DEFAULT NULL,
  -- default
  `tickt_rspnt` int(11) NOT NULL DEFAULT 0,
  `tickt_cmsts` varchar(50) DEFAULT 'Opened',
  `tickt_rsdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tickt_actve` tinyint(1) NOT NULL DEFAULT 1,
  `tickt_crusr` varchar(50) NOT NULL,
  `tickt_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tickt_upusr` varchar(50) NOT NULL,
  `tickt_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tickt_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmub_tickt`
--
ALTER TABLE `tmub_tickt`
  ADD PRIMARY KEY (`id`);