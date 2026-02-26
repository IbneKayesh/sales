--
-- Table structure for table `tmib_brand`
--

CREATE TABLE `tmib_brand` (
  `id` varchar(50) NOT NULL,
  `brand_users` varchar(50) NOT NULL,
  `brand_brnam` varchar(50) NOT NULL,
  -- optional
  -- default
  `brand_actve` tinyint(1) NOT NULL DEFAULT 1,
  `brand_crusr` varchar(50) NOT NULL,
  `brand_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `brand_upusr` varchar(50) NOT NULL,
  `brand_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `brand_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmib_brand`
--
ALTER TABLE `tmib_brand`
  ADD PRIMARY KEY (`id`);