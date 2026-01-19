
--
-- Table structure for table `tmab_bsins`
-- business shop

CREATE TABLE `tmab_bsins` (
  `id` varchar(50) NOT NULL,
  `bsins_users` varchar(255) NOT NULL,
  `bsins_bname` varchar(255) NOT NULL,
  -- optional
  `bsins_addrs` varchar(255) DEFAULT NULL,
  `bsins_email` varchar(255) DEFAULT NULL,
  `bsins_cntct` varchar(255) DEFAULT NULL,
  `bsins_image` varchar(255) DEFAULT NULL,
  `bsins_binno` varchar(255) DEFAULT NULL,
  `bsins_btags` varchar(255) DEFAULT NULL,
  `bsins_cntry` varchar(50) DEFAULT NULL,
  `bsins_prtrn` tinyint(1) NOT NULL DEFAULT 1,
  `bsins_sltrn` tinyint(1) NOT NULL DEFAULT 1,
  -- default
  `bsins_stdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bsins_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bsins_crusr` varchar(50) NOT NULL,
  `bsins_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bsins_upusr` varchar(50) NOT NULL,
  `bsins_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bsins_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmab_bsins`
--
ALTER TABLE `tmab_bsins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_bsins_users_bsins_bname` (`bsins_users`,`bsins_bname`);