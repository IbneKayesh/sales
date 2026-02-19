--
-- Table structure for table `tmcb_dlvan`
--

CREATE TABLE `tmcb_dlvan` (
  `id` varchar(50) NOT NULL,
  `dlvan_users` varchar(50) NOT NULL,
  `dlvan_bsins` varchar(50) NOT NULL,
  `dlvan_vname` varchar(50) NOT NULL,
  `dlvan_dname` varchar(50) DEFAULT NULL,
  `dlvan_actve` tinyint(1) NOT NULL DEFAULT 1,
  `dlvan_crusr` varchar(50) NOT NULL,
  `dlvan_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `dlvan_upusr` varchar(50) NOT NULL,
  `dlvan_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dlvan_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_dlvan`
--
ALTER TABLE `tmcb_dlvan`
  ADD PRIMARY KEY (`id`);