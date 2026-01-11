-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jan 11, 2026 at 12:23 PM
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
  `bsins_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bsins_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmab_bsins`
--

INSERT INTO `tmab_bsins` (`id`, `bsins_users`, `bsins_bname`, `bsins_addrs`, `bsins_email`, `bsins_cntct`, `bsins_image`, `bsins_binno`, `bsins_btags`, `bsins_cntry`, `bsins_stdat`, `bsins_actve`, `bsins_crusr`, `bsins_crdat`, `bsins_upusr`, `bsins_updat`, `bsins_rvnmr`) VALUES
('0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'admin-id', 'Grocery Store', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'BIN-123456', 'Clothing Store, Grocery', 'Bangladesh', '2026-01-09 00:00:00', 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 08:39:57', 'admin-id', '2026-01-11 08:32:39', 4),
('3881b053-9509-49db-835a-3f8dd8976cda', 'admin-id', 'Fashion House', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, '', 'Clothing Store', 'Bangladesh', '2026-01-11 00:00:00', 1, 'admin-id', '2026-01-11 08:28:46', 'admin-id', '2026-01-11 08:32:31', 3),
('3df6fda2-9cb2-4e71-bbf3-459b635c040e', 'admin-id', 'Hardware Store', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'BIN-123456', 'Grocery Store', 'Bangladesh', '2026-01-11 00:00:00', 1, 'admin-id', '2026-01-11 08:32:18', 'admin-id', '2026-01-11 08:32:18', 1),
('6dd0f9d0-840a-43ce-8f82-a60310521756', 'admin-id', 'Food Court', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, '', 'Grocery Store', 'Bangladesh', '2026-01-11 00:00:00', 1, 'admin-id', '2026-01-11 08:31:43', 'admin-id', '2026-01-11 08:32:35', 2);

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
  `users_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `users_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmab_users`
--

INSERT INTO `tmab_users` (`id`, `users_email`, `users_pswrd`, `users_recky`, `users_oname`, `users_cntct`, `users_bsins`, `users_drole`, `users_users`, `users_stats`, `users_regno`, `users_regdt`, `users_ltokn`, `users_lstgn`, `users_lstpd`, `users_wctxt`, `users_notes`, `users_nofcr`, `users_isrgs`, `users_actve`, `users_crusr`, `users_crdat`, `users_upusr`, `users_updat`, `users_rvnmr`) VALUES
('0758720d-ea22-4aee-9b69-c898d2ffe29f', 'user@sgd.com', 'password', 'recover', 'General User', '123456', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'User', 'admin-id', 0, 'Standard', '2026-01-09 12:08:38', NULL, '2026-01-09 12:08:38', '2026-01-09 12:08:38', 'Welcome Note', 'Any Notes', 0.00, 0, 0, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:08:38', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-11 05:24:02', 1),
('admin-id', 'admin@sgd.com', 'password', 'recover', 'Admin User', '01722688266', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Admin', 'admin-id', 0, 'Standard', '2026-01-09 08:39:57', NULL, '2026-01-09 08:39:57', '2026-01-11 12:19:32', 'Welcome Note', 'User Note', 10.00, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 08:39:57', 'admin-id', '2026-01-11 12:19:32', 7);

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_cntct`
--

CREATE TABLE `tmcb_cntct` (
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
  `cntct_cntry` varchar(50) DEFAULT NULL,
  `cntct_cntad` varchar(50) DEFAULT NULL,
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
-- Dumping data for table `tmcb_cntct`
--

INSERT INTO `tmcb_cntct` (`id`, `cntct_users`, `cntct_bsins`, `cntct_ctype`, `cntct_sorce`, `cntct_cntnm`, `cntct_cntps`, `cntct_cntno`, `cntct_email`, `cntct_ofadr`, `cntct_fcadr`, `cntct_cntry`, `cntct_cntad`, `cntct_crlmt`, `cntct_pybln`, `cntct_adbln`, `cntct_crbln`, `cntct_actve`, `cntct_crusr`, `cntct_crdat`, `cntct_upusr`, `cntct_updat`, `cntct_rvnmr`) VALUES
('267bb3aa-9177-43d2-8d8b-e0137578cf98', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Bulk Store', 'Mr Person', '0123456', 'email@email.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:10', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-11 05:25:41', 1),
('d5eefaf0-9979-4edf-8fbd-68f3157c4105', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Daily Needs Grocery Store', 'Mr Person', '0123456', 'email@email.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:29', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:35', 1),
('internal', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Internal', 'Local', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 13:04:25', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:31', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_bitem`
--

CREATE TABLE `tmib_bitem` (
  `id` varchar(50) NOT NULL,
  `bitem_users` varchar(50) NOT NULL,
  `bitem_items` varchar(50) NOT NULL,
  `bitem_bsins` varchar(50) NOT NULL,
  `bitem_lprat` decimal(20,6) DEFAULT 0.000000,
  `bitem_dprat` decimal(20,6) DEFAULT 0.000000,
  `bitem_mcmrp` decimal(20,6) DEFAULT 0.000000,
  `bitem_sddsp` decimal(20,6) DEFAULT 0.000000,
  `bitem_snote` varchar(100) DEFAULT NULL,
  `bitem_gstkq` decimal(20,6) DEFAULT 0.000000,
  `bitem_bstkq` decimal(20,6) DEFAULT 0.000000,
  `bitem_mnqty` decimal(20,6) DEFAULT 1.000000,
  `bitem_mxqty` decimal(20,6) DEFAULT 1.000000,
  `bitem_pbqty` decimal(20,6) DEFAULT 0.000000,
  `bitem_sbqty` decimal(20,6) DEFAULT 0.000000,
  `bitem_mpric` decimal(20,6) DEFAULT 0.000000,
  `bitem_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bitem_crusr` varchar(50) NOT NULL,
  `bitem_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bitem_upusr` varchar(50) NOT NULL,
  `bitem_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bitem_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmib_bitem`
--

INSERT INTO `tmib_bitem` (`id`, `bitem_users`, `bitem_items`, `bitem_bsins`, `bitem_lprat`, `bitem_dprat`, `bitem_mcmrp`, `bitem_sddsp`, `bitem_snote`, `bitem_gstkq`, `bitem_bstkq`, `bitem_mnqty`, `bitem_mxqty`, `bitem_pbqty`, `bitem_sbqty`, `bitem_mpric`, `bitem_actve`, `bitem_crusr`, `bitem_crdat`, `bitem_upusr`, `bitem_updat`, `bitem_rvnmr`) VALUES
('14206101-4933-4f9a-aa73-1ae20555f6b9', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ecf', '3881b053-9509-49db-835a-3f8dd8976cda', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-11 10:18:30', 'admin-id', '2026-01-11 10:18:30', 1),
('3309091f-59c6-4000-acaf-56c3d4739d22', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '3df6fda2-9cb2-4e71-bbf3-459b635c040e', 10.000000, 25.000000, 75.000000, 10.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 52.750000, 1, 'admin-id', '2026-01-11 09:24:25', 'admin-id', '2026-01-11 09:58:31', 1),
('56856e9a-94fc-4d88-a2be-b3f234236658', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '3881b053-9509-49db-835a-3f8dd8976cda', 100.000000, 110.000000, 120.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.000000, 1, 'admin-id', '2026-01-11 09:17:45', 'admin-id', '2026-01-11 10:19:09', 1),
('661472b6-3344-48e6-9382-133b362809e7', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '6dd0f9d0-840a-43ce-8f82-a60310521756', 150.000000, 160.000000, 180.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 15.000000, 1, 'admin-id', '2026-01-11 09:21:15', 'admin-id', '2026-01-11 09:51:36', 1),
('8684a43d-1cdc-4cec-9ae4-a9b00b030a5a', 'admin-id', 'e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', '3881b053-9509-49db-835a-3f8dd8976cda', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-11 10:01:04', 'admin-id', '2026-01-11 10:01:04', 1),
('f748eff0-a975-41f0-a1d5-108ac5b9997b', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 25.000000, 30.000000, 45.000000, 10.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 10.750000, 1, 'admin-id', '2026-01-11 09:22:07', 'admin-id', '2026-01-11 09:57:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_ctgry`
--

CREATE TABLE `tmib_ctgry` (
  `id` varchar(50) NOT NULL,
  `ctgry_users` varchar(50) NOT NULL,
  `ctgry_ctgnm` varchar(50) NOT NULL,
  `ctgry_actve` tinyint(1) NOT NULL DEFAULT 1,
  `ctgry_crusr` varchar(50) NOT NULL,
  `ctgry_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ctgry_upusr` varchar(50) NOT NULL,
  `ctgry_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ctgry_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmib_ctgry`
--

INSERT INTO `tmib_ctgry` (`id`, `ctgry_users`, `ctgry_ctgnm`, `ctgry_actve`, `ctgry_crusr`, `ctgry_crdat`, `ctgry_upusr`, `ctgry_updat`, `ctgry_rvnmr`) VALUES
('204e4887-0af6-4908-add0-240ea380a53b', 'admin-id', 'Toys and Gear', 1, 'admin-id', '2026-01-11 05:06:00', 'admin-id', '2026-01-11 05:06:00', 1),
('36886293-b080-44dc-9c8e-fed94ad161d3', 'admin-id', 'Confectionary and Chips', 0, 'admin-id', '2026-01-11 05:04:19', 'admin-id', '2026-01-11 05:11:31', 1),
('3ed137d4-3863-407a-8f4a-dd1000479780', 'admin-id', 'Rice and Dal', 1, 'admin-id', '2026-01-11 05:04:25', 'admin-id', '2026-01-11 05:04:25', 1),
('b1df68d6-2888-42c7-a3a8-cdaedadf5408', 'admin-id', 'Juice and Drinks', 0, 'admin-id', '2026-01-11 05:04:47', 'admin-id', '2026-01-11 05:11:38', 1),
('e69fe3b2-784f-44d5-9d88-4c228704242f', 'admin-id', 'Bakary and Biscuit', 1, 'admin-id', '2026-01-11 05:04:10', 'admin-id', '2026-01-11 05:19:03', 1),
('feacdbbe-2519-4975-96fe-ad18c7899b53', 'admin-id', 'Grocery and Perishables', 1, 'admin-id', '2026-01-11 05:03:50', 'admin-id', '2026-01-11 05:04:57', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_items`
--

CREATE TABLE `tmib_items` (
  `id` varchar(50) NOT NULL,
  `items_users` varchar(50) NOT NULL,
  `items_icode` varchar(50) DEFAULT NULL,
  `items_bcode` varchar(50) DEFAULT NULL,
  `items_hscod` varchar(50) DEFAULT NULL,
  `items_iname` varchar(100) NOT NULL,
  `items_idesc` varchar(100) DEFAULT NULL,
  `items_puofm` varchar(50) NOT NULL,
  `items_dfqty` int(11) NOT NULL DEFAULT 1,
  `items_suofm` varchar(50) NOT NULL,
  `items_ctgry` varchar(50) NOT NULL,
  `items_itype` varchar(50) NOT NULL,
  `items_hwrnt` int(11) NOT NULL DEFAULT 0,
  `items_hxpry` int(11) NOT NULL DEFAULT 0,
  `items_sdvat` decimal(4,2) DEFAULT 0.00,
  `items_costp` decimal(4,2) DEFAULT 0.00,
  `items_image` varchar(50) DEFAULT NULL,
  `items_actve` tinyint(1) NOT NULL DEFAULT 1,
  `items_crusr` varchar(50) NOT NULL,
  `items_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `items_upusr` varchar(50) NOT NULL,
  `items_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `items_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmib_items`
--

INSERT INTO `tmib_items` (`id`, `items_users`, `items_icode`, `items_bcode`, `items_hscod`, `items_iname`, `items_idesc`, `items_puofm`, `items_dfqty`, `items_suofm`, `items_ctgry`, `items_itype`, `items_hwrnt`, `items_hxpry`, `items_sdvat`, `items_costp`, `items_image`, `items_actve`, `items_crusr`, `items_crdat`, `items_upusr`, `items_updat`, `items_rvnmr`) VALUES
('940f8010-5d38-4de4-b66f-d12958ff9ec2', 'admin-id', 'I-1236', 'B-1236', 'HS-1236', 'Katari 54', 'Imported', '78a63632-6a35-49ab-8cac-4b5c0d4fb418', 12, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 10.00, NULL, 0, '940f8010-5d38-4de4-b66f-d12958ff9ecf', '2026-01-11 06:06:23', 'admin-id', '2026-01-11 09:58:46', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ecf', 'admin-id', 'I-1234', 'B-1234', 'HS-1234', 'Rice BR 28', 'Raw Deshi', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 10, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 0.00, 10.00, NULL, 1, '940f8010-5d38-4de4-b66f-d12958ff9ecf', '2026-01-11 06:06:23', 'admin-id', '2026-01-11 07:56:43', 1),
('e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', 'admin-id', 'I-1235', 'B-1235', 'HS-1235', 'Mung Dal', 'Raw Deshi', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 10, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Raw Material', 1, 1, 0.00, 10.00, NULL, 1, 'admin-id', '2026-01-11 06:38:46', 'admin-id', '2026-01-11 07:58:17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_iuofm`
--

CREATE TABLE `tmib_iuofm` (
  `id` varchar(50) NOT NULL,
  `iuofm_users` varchar(50) NOT NULL,
  `iuofm_untnm` varchar(50) NOT NULL,
  `iuofm_actve` tinyint(1) NOT NULL DEFAULT 1,
  `iuofm_crusr` varchar(50) NOT NULL,
  `iuofm_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `iuofm_upusr` varchar(50) NOT NULL,
  `iuofm_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `iuofm_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmib_iuofm`
--

INSERT INTO `tmib_iuofm` (`id`, `iuofm_users`, `iuofm_untnm`, `iuofm_actve`, `iuofm_crusr`, `iuofm_crdat`, `iuofm_upusr`, `iuofm_updat`, `iuofm_rvnmr`) VALUES
('1f240f2c-50ab-407f-b77d-0ce95922fd6c', 'admin-id', 'Ltr', 0, 'admin-id', '2026-01-11 04:40:38', 'admin-id', '2026-01-11 05:20:20', 1),
('22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'admin-id', 'Kg', 1, 'admin-id', '2026-01-11 04:43:41', 'admin-id', '2026-01-11 04:43:41', 1),
('344eb4c8-48c4-475b-b74c-307a0e492622', 'admin-id', 'Pcs', 1, 'admin-id', '2026-01-11 04:40:18', 'admin-id', '2026-01-11 04:40:18', 1),
('50d3582c-909a-4818-afd7-54a8db8c1a44', 'admin-id', 'Pack', 1, 'admin-id', '2026-01-11 04:40:31', 'admin-id', '2026-01-11 04:40:31', 1),
('61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'admin-id', 'Dzn', 0, 'admin-id', '2026-01-11 04:40:57', 'admin-id', '2026-01-11 05:20:08', 1),
('674e6bee-5066-415a-9f35-b6e72f978a08', 'admin-id', 'Yard', 1, 'admin-id', '2026-01-11 04:43:59', 'admin-id', '2026-01-11 04:43:59', 1),
('78a63632-6a35-49ab-8cac-4b5c0d4fb418', 'admin-id', 'Box', 1, 'admin-id', '2026-01-11 04:40:52', 'admin-id', '2026-01-11 04:46:59', 1),
('cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'admin-id', 'Ctn', 1, 'admin-id', '2026-01-11 04:40:23', 'admin-id', '2026-01-11 04:40:23', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_crgrn`
--

CREATE TABLE `tmsb_crgrn` (
  `id` varchar(50) NOT NULL,
  `crgrn_users` varchar(50) NOT NULL,
  `crgrn_bsins` varchar(50) NOT NULL,
  `crgrn_tblnm` varchar(50) NOT NULL,
  `crgrn_tbltx` varchar(50) DEFAULT NULL,
  `crgrn_refno` varchar(50) DEFAULT NULL,
  `crgrn_dbgrn` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `crgrn_crgrn` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `crgrn_isdat` datetime NOT NULL DEFAULT current_timestamp(),
  `crgrn_xpdat` datetime NOT NULL DEFAULT current_timestamp(),
  `crgrn_actve` tinyint(1) NOT NULL DEFAULT 1,
  `crgrn_crusr` varchar(50) NOT NULL,
  `crgrn_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `crgrn_upusr` varchar(50) NOT NULL,
  `crgrn_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `crgrn_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmsb_crgrn`
--

INSERT INTO `tmsb_crgrn` (`id`, `crgrn_users`, `crgrn_bsins`, `crgrn_tblnm`, `crgrn_tbltx`, `crgrn_refno`, `crgrn_dbgrn`, `crgrn_crgrn`, `crgrn_isdat`, `crgrn_xpdat`, `crgrn_actve`, `crgrn_crusr`, `crgrn_crdat`, `crgrn_upusr`, `crgrn_updat`, `crgrn_rvnmr`) VALUES
('cd7ec6ff-ed5b-11f0-961d-0242ac120002', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'tmab_bsins', 'Business', NULL, 1.000000, 0.000000, '2026-01-09 17:11:06', '2026-01-09 17:11:06', 1, 'sys', '2026-01-09 17:11:06', 'sys', '2026-01-09 17:11:06', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmtb_bacts`
--

CREATE TABLE `tmtb_bacts` (
  `id` varchar(50) NOT NULL,
  `bacts_users` varchar(50) NOT NULL,
  `bacts_bankn` varchar(100) NOT NULL,
  `bacts_brnch` varchar(100) DEFAULT NULL,
  `bacts_routn` varchar(50) DEFAULT NULL,
  `bacts_acnam` varchar(100) DEFAULT NULL,
  `bacts_acnum` varchar(100) DEFAULT NULL,
  `bacts_notes` varchar(300) DEFAULT NULL,
  `bacts_opdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bacts_crbln` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `bacts_isdef` tinyint(1) NOT NULL DEFAULT 0,
  `bacts_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bacts_crusr` varchar(50) NOT NULL,
  `bacts_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bacts_upusr` varchar(50) NOT NULL,
  `bacts_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bacts_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmtb_bacts`
--

INSERT INTO `tmtb_bacts` (`id`, `bacts_users`, `bacts_bankn`, `bacts_brnch`, `bacts_routn`, `bacts_acnam`, `bacts_acnum`, `bacts_notes`, `bacts_opdat`, `bacts_crbln`, `bacts_isdef`, `bacts_actve`, `bacts_crusr`, `bacts_crdat`, `bacts_upusr`, `bacts_updat`, `bacts_rvnmr`) VALUES
('14bc4749-859b-46aa-aa67-29b926f88083', 'admin-id', 'Brac Bank PLC', 'Gulshan 2', '123456', 'Sand Grain Digital', '15000003454545', 'Deposit account', '2026-01-09 00:00:00', 5000.000000, 1, 0, 'admin-id', '2026-01-09 17:37:49', 'admin-id', '2026-01-11 11:13:44', 3),
('c306af10-f4c2-4ee8-8593-85de14c35b76', 'admin-id', 'Cash Account', 'Cash Account', '0', 'Cash Account', '123456', 'Cash Account', '2026-01-09 00:00:00', 17500.000000, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:06:49', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-11 11:14:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmtb_ledgr`
--

CREATE TABLE `tmtb_ledgr` (
  `id` varchar(50) NOT NULL,
  `ledgr_users` varchar(50) NOT NULL,
  `ledgr_bsins` varchar(50) NOT NULL,
  `ledgr_trhed` varchar(50) NOT NULL,
  `ledgr_cntct` varchar(50) NOT NULL,
  `ledgr_bacts` varchar(50) NOT NULL,
  `ledgr_pymod` varchar(50) NOT NULL,
  `ledgr_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ledgr_refno` varchar(50) NOT NULL,
  `ledgr_notes` varchar(100) DEFAULT NULL,
  `ledgr_dbamt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `ledgr_cramt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `ledgr_crusr` varchar(50) NOT NULL,
  `ledgr_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ledgr_upusr` varchar(50) NOT NULL,
  `ledgr_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ledgr_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmtb_ledgr`
--

INSERT INTO `tmtb_ledgr` (`id`, `ledgr_users`, `ledgr_bsins`, `ledgr_trhed`, `ledgr_cntct`, `ledgr_bacts`, `ledgr_pymod`, `ledgr_trdat`, `ledgr_refno`, `ledgr_notes`, `ledgr_dbamt`, `ledgr_cramt`, `ledgr_crusr`, `ledgr_crdat`, `ledgr_upusr`, `ledgr_updat`, `ledgr_rvnmr`) VALUES
('322544db-ccf2-4326-94ea-c92325654f99', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z901', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'rent-5656', '', 1500.000000, 0.000000, 'admin-id', '2026-01-10 08:17:42', 'admin-id', '2026-01-10 08:17:42', 1),
('57635f84-7cae-4a10-8927-cd34447800de', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z904', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'nov', '', 500.000000, 0.000000, 'admin-id', '2026-01-10 08:19:11', 'admin-id', '2026-01-10 08:19:11', 1),
('5bb72d2a-7ef7-42c3-a12d-17ea7e874344', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z702', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'cash investment', '', 0.000000, 25000.000000, 'admin-id', '2026-01-10 08:16:12', 'admin-id', '2026-01-10 08:16:12', 1),
('665b8fac-564b-470a-a922-4c484bfe1474', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z602', 'internal', '14bc4749-859b-46aa-aa67-29b926f88083', 'Bank', '2026-01-10 00:00:00', 'transfer', '', 0.000000, 5000.000000, 'admin-id', '2026-01-10 08:16:47', 'admin-id', '2026-01-10 08:16:47', 1),
('6bf954fd-fea2-4898-9821-48874ac98e4d', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z903', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'MFS', '2026-01-10 00:00:00', 'nov', '', 500.000000, 0.000000, 'admin-id', '2026-01-10 08:18:22', 'admin-id', '2026-01-10 08:18:22', 1),
('efaade64-7c50-4fe7-b1d3-f033622e800d', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z601', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Bank', '2026-01-10 00:00:00', 'transfer', '', 5000.000000, 0.000000, 'admin-id', '2026-01-10 08:16:47', 'admin-id', '2026-01-10 08:16:47', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmtb_trhed`
--

CREATE TABLE `tmtb_trhed` (
  `id` varchar(50) NOT NULL,
  `trhed_users` varchar(50) NOT NULL,
  `trhed_hednm` varchar(100) NOT NULL,
  `trhed_grpnm` varchar(100) NOT NULL,
  `trhed_grtyp` varchar(100) NOT NULL,
  `trhed_cntyp` varchar(100) NOT NULL,
  `trhed_actve` tinyint(1) NOT NULL DEFAULT 1,
  `trhed_crusr` varchar(50) NOT NULL,
  `trhed_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `trhed_upusr` varchar(50) NOT NULL,
  `trhed_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `trhed_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmtb_trhed`
--

INSERT INTO `tmtb_trhed` (`id`, `trhed_users`, `trhed_hednm`, `trhed_grpnm`, `trhed_grtyp`, `trhed_cntyp`, `trhed_actve`, `trhed_crusr`, `trhed_crdat`, `trhed_upusr`, `trhed_updat`, `trhed_rvnmr`) VALUES
('Z1001', 'admin-id', 'Asset Purchase (-)', 'Asset', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:31', 'admin-id', '2026-01-10 08:06:31', 1),
('Z1002', 'admin-id', 'Asset Sale (+)', 'Asset', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:31', 'admin-id', '2026-01-10 08:06:31', 1),
('Z101', 'admin-id', 'Sales Booking (+)', 'Sales', 'In', 'Customer', 1, 'admin-id', '2026-01-10 08:07:18', 'admin-id', '2026-01-10 08:07:18', 1),
('Z102', 'admin-id', 'Sales Invoice (+)', 'Sales', 'In', 'Customer', 1, 'admin-id', '2026-01-10 08:07:18', 'admin-id', '2026-01-10 08:07:18', 1),
('Z103', 'admin-id', 'Sales Order (+)', 'Sales', 'In', 'Customer', 1, 'admin-id', '2026-01-10 08:07:18', 'admin-id', '2026-01-10 08:07:18', 1),
('Z104', 'admin-id', 'Sales Return (-)', 'Sales', 'Out', 'Customer', 1, 'admin-id', '2026-01-10 08:07:18', 'admin-id', '2026-01-10 08:07:18', 1),
('Z105', 'admin-id', 'Sales Expense (-)', 'Sales', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:07:18', 'admin-id', '2026-01-10 08:07:18', 1),
('Z1101', 'admin-id', 'VAT Payment (-)', 'VAT', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:25', 'admin-id', '2026-01-10 08:06:25', 1),
('Z1102', 'admin-id', 'VAT Collection (+)', 'VAT', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:25', 'admin-id', '2026-01-10 08:06:25', 1),
('Z1201', 'admin-id', 'Tax Payment (-)', 'Tax', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:18', 'admin-id', '2026-01-10 08:06:18', 1),
('Z1202', 'admin-id', 'Tax Receipt (+)', 'Tax', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:18', 'admin-id', '2026-01-10 08:06:18', 1),
('Z1301', 'admin-id', 'Salary Payment (-)', 'HR', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:09', 'admin-id', '2026-01-10 08:06:09', 1),
('Z1302', 'admin-id', 'Salary Advance Payment (-)', 'HR', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:09', 'admin-id', '2026-01-10 08:06:09', 1),
('Z1303', 'admin-id', 'Salary Deduction (+)', 'HR', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:09', 'admin-id', '2026-01-10 08:06:09', 1),
('Z1304', 'admin-id', 'Salary Advance Deduction (+)', 'HR', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:09', 'admin-id', '2026-01-10 08:06:09', 1),
('Z201', 'admin-id', 'Purchase Booking (-)', 'Purchase', 'Out', 'Supplier', 1, 'admin-id', '2026-01-10 08:07:11', 'admin-id', '2026-01-10 08:07:11', 1),
('Z202', 'admin-id', 'Purchase Invoice (-)', 'Purchase', 'Out', 'Supplier', 1, 'admin-id', '2026-01-10 08:07:11', 'admin-id', '2026-01-10 08:07:11', 1),
('Z203', 'admin-id', 'Purchase Order (-)', 'Purchase', 'Out', 'Supplier', 1, 'admin-id', '2026-01-10 08:07:11', 'admin-id', '2026-01-10 08:07:11', 1),
('Z204', 'admin-id', 'Purchase Return (+)', 'Purchase', 'In', 'Supplier', 1, 'admin-id', '2026-01-10 08:07:11', 'admin-id', '2026-01-10 08:07:11', 1),
('Z205', 'admin-id', 'Purchase Expense (-)', 'Purchase', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:07:11', 'admin-id', '2026-01-10 08:07:11', 1),
('Z501', 'admin-id', 'Stock Out (-)', 'Inventory', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:07:05', 'admin-id', '2026-01-10 08:07:05', 1),
('Z502', 'admin-id', 'Stock In (+)', 'Inventory', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:07:05', 'admin-id', '2026-01-10 08:07:05', 1),
('Z601', 'admin-id', 'Transfer Out (-)', 'Transfer', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:58', 'admin-id', '2026-01-10 08:06:58', 1),
('Z602', 'admin-id', 'Transfer In (+)', 'Transfer', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:58', 'admin-id', '2026-01-10 08:06:58', 1),
('Z701', 'admin-id', 'Gain (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:52', 'admin-id', '2026-01-10 08:06:52', 1),
('Z702', 'admin-id', 'Investment (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:52', 'admin-id', '2026-01-10 08:06:52', 1),
('Z703', 'admin-id', 'Bank Profit (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:52', 'admin-id', '2026-01-10 08:06:52', 1),
('Z704', 'admin-id', 'Bank Loan Received (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:52', 'admin-id', '2026-01-10 08:06:52', 1),
('Z705', 'admin-id', 'Other Income (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:52', 'admin-id', '2026-01-10 08:06:52', 1),
('Z801', 'admin-id', 'Loss (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z802', 'admin-id', 'Withdrawal (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z803', 'admin-id', 'Bank Charges (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z804', 'admin-id', 'Bank Loan Payment (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z805', 'admin-id', 'Other Cost (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z901', 'admin-id', 'Rent (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z902', 'admin-id', 'Rent Advance (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z903', 'admin-id', 'Electricity Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z904', 'admin-id', 'Internet Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z905', 'admin-id', 'Transport Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1);

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
-- Indexes for table `tmcb_cntct`
--
ALTER TABLE `tmcb_cntct`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmib_bitem`
--
ALTER TABLE `tmib_bitem`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmib_ctgry`
--
ALTER TABLE `tmib_ctgry`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmib_items`
--
ALTER TABLE `tmib_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmib_iuofm`
--
ALTER TABLE `tmib_iuofm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmsb_crgrn`
--
ALTER TABLE `tmsb_crgrn`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmtb_bacts`
--
ALTER TABLE `tmtb_bacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmtb_ledgr`
--
ALTER TABLE `tmtb_ledgr`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmtb_trhed`
--
ALTER TABLE `tmtb_trhed`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
