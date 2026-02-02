--
-- Table structure for table `tmib_expns`
--

CREATE TABLE `tmib_expns` (
  `id` varchar(50) NOT NULL,
  `expns_users` varchar(50) NOT NULL,
  `expns_bsins` varchar(50) NOT NULL,
  `expns_cntct` varchar(50) NOT NULL,
  `expns_refid` varchar(50) NOT NULL,
  `expns_refno` varchar(50) NOT NULL,
  `expns_srcnm` varchar(50) NOT NULL,
  `expns_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `expns_inexc` TINYINT(1) NOT NULL DEFAULT 1,
  -- optional
  `expns_notes` varchar(100) DEFAULT NULL,
  -- default
  `expns_xpamt` decimal(18,6) NOT NULL DEFAULT 0,
  `expns_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `expns_crusr` varchar(50) NOT NULL,
  `expns_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `expns_upusr` varchar(50) NOT NULL,
  `expns_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expns_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmib_expns`
--
ALTER TABLE `tmib_expns`
  ADD PRIMARY KEY (`id`);


-- expns_inexc [1=Including, 2=Excluding]