--
-- Table structure for table `tmsb_users`
-- master users and workstation users

CREATE TABLE `tmsb_users` (
  `id` varchar(50) NOT NULL,
  `users_email` varchar(50) NOT NULL,
  `users_pswrd` varchar(50) NOT NULL,
  `users_recky` varchar(50) NOT NULL,
  `users_oname` varchar(255) NOT NULL,
-- optional
  `users_cntct` varchar(50) DEFAULT NULL,  
  `users_bsins` varchar(50) DEFAULT NULL,
  `users_drole` VARCHAR(50) DEFAULT NULL,
  `users_users` VARCHAR(50) DEFAULT NULL,
  `users_stats` int(11) NOT NULL DEFAULT 0,
  `users_regno` varchar(50) DEFAULT NULL,
  `users_regdt` datetime NOT NULL DEFAULT current_timestamp(),
  `users_ltokn` VARCHAR(50) DEFAULT NULL,
  `users_lstgn` datetime NOT NULL DEFAULT current_timestamp(),
  `users_lstpd` datetime NOT NULL DEFAULT current_timestamp(),
  `users_wctxt` VARCHAR(100) DEFAULT NULL,
  `users_notes` VARCHAR(100) DEFAULT NULL,
  `users_nofcr` DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  `users_isrgs` tinyint(1) NOT NULL DEFAULT 1,
-- default
  `users_actve` tinyint(1) NOT NULL DEFAULT 1,
  `users_crusr` varchar(50) NOT NULL,
  `users_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `users_upusr` varchar(50) NOT NULL,
  `users_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `users_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmsb_users`
--
ALTER TABLE `tmsb_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`users_email`);