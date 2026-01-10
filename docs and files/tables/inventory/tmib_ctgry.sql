--
-- Table structure for table `tmib_ctgry`
--

CREATE TABLE `tmib_ctgry` (
  `id` varchar(50) NOT NULL,
  `ctgry_users` varchar(50) NOT NULL,
  `ctgry_ctgnm` varchar(50) NOT NULL,
  -- optional
  -- default
  `ctgry_actve` tinyint(1) NOT NULL DEFAULT 1,
  `ctgry_crusr` varchar(50) NOT NULL,
  `ctgry_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ctgry_upusr` varchar(50) NOT NULL,
  `ctgry_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ctgry_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmib_ctgry`
--
ALTER TABLE `tmib_ctgry`
  ADD PRIMARY KEY (`id`);