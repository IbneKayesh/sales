--
-- Table structure for table `tmhb_emply`
-- hrms employee list

CREATE TABLE `tmhb_emply` (
  `id` varchar(50) NOT NULL,
  `emply_users` varchar(50) NOT NULL,
  `emply_bsins` varchar(50) NOT NULL,
-- Office Id
  `emply_ecode` varchar(50) DEFAULT NULL,
  `emply_crdno` varchar(50) DEFAULT NULL,
-- Personal Information
  `emply_ename` varchar(50) NOT NULL,
  `emply_econt` varchar(50) NOT NULL,  
-- optional
  `emply_email` varchar(50) DEFAULT NULL,
  `emply_natid` varchar(50) DEFAULT NULL,
  `emply_bdate` datetime DEFAULT current_timestamp(),
  `emply_prnam` varchar(50) DEFAULT NULL,
  `emply_gendr` varchar(50) DEFAULT NULL,
  `emply_mstas` varchar(50) DEFAULT NULL,
  `emply_bgrup` varchar(50) DEFAULT NULL,
  `emply_rlgon` varchar(50) DEFAULT NULL,
  `emply_edgrd` varchar(50) DEFAULT NULL,
  `emply_psadr` varchar(100) DEFAULT NULL,
  `emply_pradr` varchar(100) DEFAULT NULL,
-- Office information
  `emply_desig` varchar(50) DEFAULT NULL,
  `emply_jndat` datetime DEFAULT current_timestamp(),
  `emply_cndat` datetime DEFAULT NULL,
  `emply_rgdat` datetime DEFAULT NULL,
  `emply_gssal` DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  `emply_otrat` DECIMAL(16,2) NOT NULL DEFAULT 0.0000,
  `emply_etype` VARCHAR(50) DEFAULT NULL,
  `emply_pyacc` VARCHAR(50) DEFAULT NULL,
  `emply_slcyl` VARCHAR(50) DEFAULT NULL,
  `emply_wksft` VARCHAR(50) DEFAULT NULL,
  `emply_supid` VARCHAR(50) DEFAULT NULL,
  `emply_notes` VARCHAR(50) DEFAULT NULL,
-- default`
  `emply_login` tinyint(1) NOT NULL DEFAULT 0,
  `emply_pswrd` varchar(50) DEFAULT NULL,
  `emply_pictr` varchar(50) DEFAULT NULL,
  `emply_stats` varchar(50) NOT NULL,
  `emply_actve` tinyint(1) NOT NULL DEFAULT 1,
  `emply_crusr` varchar(50) NOT NULL,
  `emply_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `emply_upusr` varchar(50) NOT NULL,
  `emply_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `emply_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `tmhb_emply`
--
ALTER TABLE `tmhb_emply`
  ADD PRIMARY KEY (`id`);