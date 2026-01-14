--
-- Table structure for table `tmib_iuofm`
--

CREATE TABLE `tmib_iuofm` (
  `id` varchar(50) NOT NULL,
  `iuofm_users` varchar(50) NOT NULL,
  `iuofm_untnm` varchar(50) NOT NULL,
  -- optional
  `iuofm_untgr` varchar(50) DEFAULT NULL,
  -- default
  `iuofm_actve` tinyint(1) NOT NULL DEFAULT 1,
  `iuofm_crusr` varchar(50) NOT NULL,
  `iuofm_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `iuofm_upusr` varchar(50) NOT NULL,
  `iuofm_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `iuofm_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmib_iuofm`
--
ALTER TABLE `tmib_iuofm`
  ADD PRIMARY KEY (`id`);