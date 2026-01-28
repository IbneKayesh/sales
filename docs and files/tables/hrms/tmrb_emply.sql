--
-- Table structure for table `tmrb_emply`
-- hrms employee list

CREATE TABLE `tmrb_emply` (
  `id` varchar(50) NOT NULL,
  `emply_users` varchar(50) NOT NULL,
  `emply_bsins` varchar(50) NOT NULL,
  `emply_ecode` varchar(50) NOT NULL,
  `emply_ename` varchar(50) NOT NULL,
-- optional
  `emply_econt` varchar(50) DEFAULT NULL,  
  `emply_addrs` varchar(100) DEFAULT NULL,
  `emply_natid` varchar(50) DEFAULT NULL,
  `emply_desig` VARCHAR(50) DEFAULT NULL,
  `emply_jndat` datetime NOT NULL DEFAULT current_timestamp(),
  `emply_rgdat` datetime NOT NULL DEFAULT current_timestamp(),
  `emply_crsal` DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  `emply_supid` VARCHAR(50) DEFAULT NULL,
  `emply_login` tinyint(1) NOT NULL DEFAULT 0,
  `emply_pswrd` varchar(50) DEFAULT NULL,
  `emply_pictr` varchar(50) DEFAULT NULL,
  `emply_stats` varchar(50) DEFAULT NULL,
-- default`
  `emply_actve` tinyint(1) NOT NULL DEFAULT 1,
  `emply_crusr` varchar(50) NOT NULL,
  `emply_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `emply_upusr` varchar(50) NOT NULL,
  `emply_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `emply_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmrb_emply`
--
ALTER TABLE `tmrb_emply`
  ADD PRIMARY KEY (`id`);