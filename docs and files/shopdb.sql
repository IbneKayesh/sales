-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jan 08, 2026 at 08:03 AM
-- Server version: 12.1.2-MariaDB-ubu2404
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `tmab_bsins`
--

CREATE TABLE `tmab_bsins` (
  `id` varchar(50) NOT NULL,
  `bsins_users` varchar(255) NOT NULL,
  `bsins_bname` varchar(255) NOT NULL,
  `bsins_addrs` varchar(255) DEFAULT NULL,
  `bsins_email` varchar(255) DEFAULT NULL,
  `bsins_cntct` varchar(255) DEFAULT NULL,
  `bsins_image` varchar(255) DEFAULT NULL,
  `bsins_binno` varchar(255) DEFAULT NULL,
  `bsins_btags` varchar(255) DEFAULT NULL,
  `bsins_cntry` varchar(50) DEFAULT NULL,
  `bsins_stdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bsins_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bsins_crusr` varchar(50) NOT NULL,
  `bsins_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bsins_upusr` varchar(50) NOT NULL,
  `bsins_updat` datetime NOT NULL DEFAULT current_timestamp(),
  `bsins_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmab_bsins`
--

INSERT INTO `tmab_bsins` (`id`, `bsins_users`, `bsins_bname`, `bsins_addrs`, `bsins_email`, `bsins_cntct`, `bsins_image`, `bsins_binno`, `bsins_btags`, `bsins_cntry`, `bsins_stdat`, `bsins_actve`, `bsins_crusr`, `bsins_crdat`, `bsins_upusr`, `bsins_updat`, `bsins_rvnmr`) VALUES
('3c255342-4b98-47e1-9e23-1297cf4c9a9b', '6f214060-8b3b-45b6-a67f-0cf3ef66796e', 'My Shop BD', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, '1234567', 'Clothing Store', 'Bangladesh', '2026-01-08 00:00:00', 1, '6f214060-8b3b-45b6-a67f-0cf3ef66796e', '2026-01-08 06:35:08', '6f214060-8b3b-45b6-a67f-0cf3ef66796e', '2026-01-08 06:39:56', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tmab_users`
--

CREATE TABLE `tmab_users` (
  `id` varchar(50) NOT NULL,
  `users_email` varchar(50) NOT NULL,
  `users_pswrd` varchar(50) NOT NULL,
  `users_recky` varchar(50) NOT NULL,
  `users_oname` varchar(255) NOT NULL,
  `users_cntct` varchar(50) DEFAULT NULL,
  `users_bsins` varchar(50) DEFAULT NULL,
  `users_drole` varchar(50) DEFAULT NULL,
  `users_users` varchar(50) DEFAULT NULL,
  `users_stats` int(11) NOT NULL DEFAULT 0,
  `users_regno` varchar(50) DEFAULT NULL,
  `users_regdt` datetime NOT NULL DEFAULT current_timestamp(),
  `users_ltokn` varchar(50) DEFAULT NULL,
  `users_lstgn` datetime NOT NULL DEFAULT current_timestamp(),
  `users_lstpd` datetime NOT NULL DEFAULT current_timestamp(),
  `users_wctxt` varchar(100) DEFAULT NULL,
  `users_notes` varchar(100) DEFAULT NULL,
  `users_nofcr` decimal(16,2) NOT NULL DEFAULT 0.00,
  `users_isrgs` tinyint(1) NOT NULL DEFAULT 1,
  `users_actve` tinyint(1) NOT NULL DEFAULT 1,
  `users_crusr` varchar(50) NOT NULL,
  `users_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `users_upusr` varchar(50) NOT NULL,
  `users_updat` datetime NOT NULL DEFAULT current_timestamp(),
  `users_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmab_users`
--

INSERT INTO `tmab_users` (`id`, `users_email`, `users_pswrd`, `users_recky`, `users_oname`, `users_cntct`, `users_bsins`, `users_drole`, `users_users`, `users_stats`, `users_regno`, `users_regdt`, `users_ltokn`, `users_lstgn`, `users_lstpd`, `users_wctxt`, `users_notes`, `users_nofcr`, `users_isrgs`, `users_actve`, `users_crusr`, `users_crdat`, `users_upusr`, `users_updat`, `users_rvnmr`) VALUES
('6f214060-8b3b-45b6-a67f-0cf3ef66796e', 'admin@sgd.com', '123456', 'recover', 'Admin', '01722688266', '3c255342-4b98-47e1-9e23-1297cf4c9a9b', 'Admin', '6f214060-8b3b-45b6-a67f-0cf3ef66796e', 0, 'Standard', '2026-01-08 06:35:08', NULL, '2026-01-08 06:35:08', '2026-01-08 06:35:08', NULL, NULL, 10.00, 1, 1, '6f214060-8b3b-45b6-a67f-0cf3ef66796e', '2026-01-08 06:35:08', '6f214060-8b3b-45b6-a67f-0cf3ef66796e', '2026-01-08 06:37:30', 2),
('e2b0fed8-69b0-4a37-9179-904638c8cf84', 'user@sgd.com', '123456', 'recover', 'User', '01722688266', '3c255342-4b98-47e1-9e23-1297cf4c9a9b', 'User', '6f214060-8b3b-45b6-a67f-0cf3ef66796e', 0, 'Standard', '2026-01-08 06:37:45', NULL, '2026-01-08 06:37:45', '2026-01-08 06:37:45', '', '', 0.00, 0, 1, '6f214060-8b3b-45b6-a67f-0cf3ef66796e', '2026-01-08 06:37:45', '6f214060-8b3b-45b6-a67f-0cf3ef66796e', '2026-01-08 06:37:45', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_cntcs`
--

CREATE TABLE `tmcb_cntcs` (
  `id` varchar(50) NOT NULL,
  `cntct_users` varchar(50) NOT NULL,
  `cntct_bsins` varchar(50) NOT NULL,
  `cntct_ctype` varchar(50) NOT NULL,
  `cntct_sorce` varchar(50) NOT NULL,
  `cntct_cntnm` varchar(200) NOT NULL,
  `cntct_cntps` varchar(50) DEFAULT NULL,
  `cntct_cntno` varchar(50) DEFAULT NULL,
  `cntct_email` varchar(50) DEFAULT NULL,
  `cntct_ofadr` varchar(300) DEFAULT NULL,
  `cntct_fcadr` varchar(300) DEFAULT NULL,
  `cntct_cntad` varchar(50) NOT NULL,
  `cntct_crlmt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `cntct_pybln` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `cntct_adbln` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `cntct_crbln` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `cntct_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cntct_crusr` varchar(50) NOT NULL,
  `cntct_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cntct_upusr` varchar(50) NOT NULL,
  `cntct_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cntct_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tmab_bsins`
--
ALTER TABLE `tmab_bsins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_bsins_users_bsins_bname` (`bsins_users`,`bsins_bname`);

--
-- Indexes for table `tmab_users`
--
ALTER TABLE `tmab_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`users_email`);

--
-- Indexes for table `tmcb_cntcs`
--
ALTER TABLE `tmcb_cntcs`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
