--
-- Table structure for table `tmcb_dzone`
--

CREATE TABLE `tmcb_dzone` (
  `id` varchar(50) NOT NULL,
  `dzone_users` varchar(50) NOT NULL,
  `dzone_bsins` varchar(50) NOT NULL,
  `dzone_cntry` varchar(50) NOT NULL,
  `dzone_dname` varchar(50) NOT NULL,
  `dzone_actve` tinyint(1) NOT NULL DEFAULT 1,
  `dzone_crusr` varchar(50) NOT NULL,
  `dzone_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `dzone_upusr` varchar(50) NOT NULL,
  `dzone_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dzone_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_dzone`
--
ALTER TABLE `tmcb_dzone`
  ADD PRIMARY KEY (`id`);