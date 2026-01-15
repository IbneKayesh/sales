-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jan 15, 2026 at 06:03 AM
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
('0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'admin-id', 'Grocery Store', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'BIN-123456', 'Clothing Store, Grocery', 'Bangladesh', '2026-01-09 00:00:00', 1, 'admin-id', '2026-01-09 08:39:57', 'admin-id', '2026-01-12 04:49:33', 4),
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
('0758720d-ea22-4aee-9b69-c898d2ffe29f', 'user@sgd.com', 'password', 'recover', 'General User', '123456', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'User', 'admin-id', 0, 'Standard', '2026-01-09 12:08:38', NULL, '2026-01-09 12:08:38', '2026-01-09 12:08:38', 'Welcome Note', 'Any Notes', 0.00, 0, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:08:38', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-12 05:46:00', 1),
('admin-id', 'admin@sgd.com', 'password', 'recover', 'Admin User', '01722688266', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Admin', 'admin-id', 0, 'Standard', '2026-01-09 08:39:57', NULL, '2026-01-09 08:39:57', '2026-01-11 12:19:32', 'Welcome Note', 'User Note', 856.00, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 08:39:57', 'admin-id', '2026-01-15 04:29:56', 7);

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
('08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Daily Production', 'Mr Person', '0123456', 'email@sgd.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 15000.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-14 09:17:52', 'admin-id', '2026-01-14 09:23:19', 3),
('267bb3aa-9177-43d2-8d8b-e0137578cf98', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Bulk Store', 'Mr Person', '0123456', 'email@email.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 50000.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:10', 'admin-id', '2026-01-12 12:24:23', 2),
('both', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Both', 'Local', 'Both A/C', 'Both A/C', 'Both A/C', 'Both A/C', 'Both A/C', 'Both A/C', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 13:04:25', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:31', 2),
('c370a9f5-7ccf-4e2d-9d7a-7d5873293ddc', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Jannat Store', 'Mr Person', '0123456', 'email@sgd.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-14 09:23:59', 'admin-id', '2026-01-14 09:23:59', 1),
('d5eefaf0-9979-4edf-8fbd-68f3157c4105', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Daily Needs Grocery Store', 'Mr Person', '0123456', 'email@email.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 50000.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:29', 'admin-id', '2026-01-12 12:24:33', 2),
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
('2a0f1a32-00ff-4eb8-9356-82de14330180', 'admin-id', '24614ec4-8ab0-4b50-b3c7-9f154a124770', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 92.000000, 95.000000, 100.000000, 2.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.160000, 1, 'admin-id', '2026-01-14 09:28:00', 'admin-id', '2026-01-14 12:48:04', 1),
('2cee0acf-236d-44cc-80a7-583218cbc20a', 'admin-id', '4dab149a-e220-4cd8-a061-7660ab0168bb', '3881b053-9509-49db-835a-3f8dd8976cda', 35.000000, 38.000000, 40.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 3.950000, 1, 'admin-id', '2026-01-12 06:21:18', 'admin-id', '2026-01-12 06:21:18', 1),
('32b18551-4330-42f3-8186-571834174792', 'admin-id', 'e483bc2d-6ccd-4b72-8603-775dcd275249', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 910.000000, 930.000000, 950.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 21.800000, 1, 'admin-id', '2026-01-14 09:27:37', 'admin-id', '2026-01-14 09:27:37', 1),
('3309091f-59c6-4000-acaf-56c3d4739d22', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '3df6fda2-9cb2-4e71-bbf3-459b635c040e', 10.000000, 25.000000, 75.000000, 10.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 52.750000, 1, 'admin-id', '2026-01-11 09:24:25', 'admin-id', '2026-01-11 09:58:31', 1),
('3a77468d-3b7d-4518-a27e-e81c1088ac65', 'admin-id', 'e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 240.000000, 260.000000, 290.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 44.000000, 1, 'admin-id', '2026-01-14 09:26:22', 'admin-id', '2026-01-14 09:26:22', 1),
('4e9294db-617e-4e3b-94ea-61b6d141b7af', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ecf', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 65.000000, 68.000000, 72.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 6.350000, 1, 'admin-id', '2026-01-14 09:26:54', 'admin-id', '2026-01-14 09:26:54', 1),
('56856e9a-94fc-4d88-a2be-b3f234236658', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '3881b053-9509-49db-835a-3f8dd8976cda', 100.000000, 110.000000, 120.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.000000, 1, 'admin-id', '2026-01-11 09:17:45', 'admin-id', '2026-01-12 04:25:24', 1),
('5cf2a11e-4c10-4ca1-9bdc-eb3c443796a1', 'admin-id', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', '6dd0f9d0-840a-43ce-8f82-a60310521756', 80.000000, 85.000000, 90.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 8.400000, 1, 'admin-id', '2026-01-12 06:37:10', 'admin-id', '2026-01-12 06:37:10', 1),
('64e2b4c7-6a36-4025-9deb-2fc20951e9b8', 'admin-id', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', '3881b053-9509-49db-835a-3f8dd8976cda', 80.000000, 85.000000, 90.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 8.400000, 0, 'admin-id', '2026-01-12 06:17:55', 'admin-id', '2026-01-12 09:33:07', 1),
('661472b6-3344-48e6-9382-133b362809e7', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '6dd0f9d0-840a-43ce-8f82-a60310521756', 150.000000, 160.000000, 180.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 15.000000, 1, 'admin-id', '2026-01-11 09:21:15', 'admin-id', '2026-01-11 09:51:36', 1),
('b3393102-46d3-4891-b529-92d9d4faa061', 'admin-id', 'e483bc2d-6ccd-4b72-8603-775dcd275249', '3881b053-9509-49db-835a-3f8dd8976cda', 950.000000, 970.000000, 990.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 11.500000, 1, 'admin-id', '2026-01-12 06:14:14', 'admin-id', '2026-01-12 06:14:45', 1),
('f13934bb-6345-43ff-b072-2a80c81e2869', 'admin-id', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 80.000000, 85.000000, 90.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 8.400000, 1, 'admin-id', '2026-01-14 09:25:42', 'admin-id', '2026-01-14 09:25:42', 1),
('f748eff0-a975-41f0-a1d5-108ac5b9997b', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 25.000000, 30.000000, 45.000000, 10.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 10.750000, 1, 'admin-id', '2026-01-11 09:22:07', 'admin-id', '2026-01-11 09:57:46', 1),
('f952f0d2-9327-4c4e-9d15-c8d24242055b', 'admin-id', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 780.000000, 850.000000, 900.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 104.400000, 1, 'admin-id', '2026-01-12 06:43:02', 'admin-id', '2026-01-12 06:43:02', 1),
('feceffbc-221a-497c-9a7e-e8bb75bfd898', 'admin-id', '4dab149a-e220-4cd8-a061-7660ab0168bb', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 35.000000, 38.000000, 43.000000, 10.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1.200000, 1, 'admin-id', '2026-01-14 09:27:10', 'admin-id', '2026-01-14 12:43:05', 1),
('ff3ea5ac-fb2b-49a8-9139-581d32d096fb', 'admin-id', '24614ec4-8ab0-4b50-b3c7-9f154a124770', '3881b053-9509-49db-835a-3f8dd8976cda', 75.000000, 80.000000, 90.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 12.750000, 1, 'admin-id', '2026-01-12 06:16:29', 'admin-id', '2026-01-12 06:16:29', 1);

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
  `items_nofbi` int(11) NOT NULL DEFAULT 0,
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

INSERT INTO `tmib_items` (`id`, `items_users`, `items_icode`, `items_bcode`, `items_hscod`, `items_iname`, `items_idesc`, `items_puofm`, `items_dfqty`, `items_suofm`, `items_ctgry`, `items_itype`, `items_hwrnt`, `items_hxpry`, `items_sdvat`, `items_costp`, `items_image`, `items_nofbi`, `items_actve`, `items_crusr`, `items_crdat`, `items_upusr`, `items_updat`, `items_rvnmr`) VALUES
('24614ec4-8ab0-4b50-b3c7-9f154a124770', 'admin-id', 'I-1238', 'B-1238', 'HS-1238', 'Sugar', '1kg Pack', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 12, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 5.00, 2.00, NULL, 2, 1, 'admin-id', '2026-01-12 06:16:06', 'admin-id', '2026-01-14 12:43:27', 1),
('4dab149a-e220-4cd8-a061-7660ab0168bb', 'admin-id', 'I-1240', 'B-1240', 'HS-1240', 'Salt 1kg', 'Iodized', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 12, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 0.00, 3.00, NULL, 2, 1, 'admin-id', '2026-01-12 06:20:57', 'admin-id', '2026-01-14 09:27:11', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ec2', 'admin-id', 'I-1236', 'B-1236', 'HS-1236', 'Katari 54', 'Imported', '78a63632-6a35-49ab-8cac-4b5c0d4fb418', 12, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 10.00, NULL, 4, 1, '940f8010-5d38-4de4-b66f-d12958ff9ecf', '2026-01-11 06:06:23', 'admin-id', '2026-01-12 06:33:28', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ecf', 'admin-id', 'I-1234', 'B-1234', 'HS-1234', 'Rice BR 28', 'Raw Deshi', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 10, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 0.00, 10.00, NULL, 2, 1, '940f8010-5d38-4de4-b66f-d12958ff9ecf', '2026-01-11 06:06:23', 'admin-id', '2026-01-14 09:26:54', 1),
('ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', 'admin-id', 'I-1239', 'B-1239', 'HS-1239', 'Atta 2kg', '2kg Pack', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 6, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 0.00, 2.00, NULL, 3, 1, 'admin-id', '2026-01-12 06:17:33', 'admin-id', '2026-01-14 09:25:42', 1),
('dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 'admin-id', 'B-1241', 'B-1241', 'HS-1241', 'Jira', 'Imported', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 20, '2276a903-fc68-4c43-8448-8ceab9aee99d', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 0.00, 2.00, NULL, 1, 1, 'admin-id', '2026-01-12 06:38:50', 'admin-id', '2026-01-12 06:43:02', 1),
('e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', 'admin-id', 'I-1235', 'B-1235', 'HS-1235', 'Mung Dal', 'Raw Deshi', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 10, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Raw Material', 1, 1, 0.00, 10.00, NULL, 2, 1, 'admin-id', '2026-01-11 06:38:46', 'admin-id', '2026-01-14 09:26:22', 1),
('e483bc2d-6ccd-4b72-8603-775dcd275249', 'admin-id', 'I-1237', 'B-1237', 'HS-1237', 'Soyabean Oil 5Ltr', 'Imported', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 6, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'b1df68d6-2888-42c7-a3a8-cdaedadf5408', 'Finished Goods', 0, 0, 0.00, 3.00, NULL, 2, 1, 'admin-id', '2026-01-12 06:12:16', 'admin-id', '2026-01-14 09:27:37', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_iuofm`
--

CREATE TABLE `tmib_iuofm` (
  `id` varchar(50) NOT NULL,
  `iuofm_users` varchar(50) NOT NULL,
  `iuofm_untnm` varchar(50) NOT NULL,
  `iuofm_untgr` varchar(50) DEFAULT NULL,
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

INSERT INTO `tmib_iuofm` (`id`, `iuofm_users`, `iuofm_untnm`, `iuofm_untgr`, `iuofm_actve`, `iuofm_crusr`, `iuofm_crdat`, `iuofm_upusr`, `iuofm_updat`, `iuofm_rvnmr`) VALUES
('1f240f2c-50ab-407f-b77d-0ce95922fd6c', 'admin-id', 'Ltr', 'Volume', 0, 'admin-id', '2026-01-11 04:40:38', 'admin-id', '2026-01-14 08:32:08', 1),
('2276a903-fc68-4c43-8448-8ceab9aee99d', 'admin-id', 'Bulk', 'Mass', 1, 'admin-id', '2026-01-12 06:39:04', 'admin-id', '2026-01-14 08:32:20', 1),
('22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'admin-id', 'Kg', 'Weight', 1, 'admin-id', '2026-01-11 04:43:41', 'admin-id', '2026-01-14 08:32:24', 1),
('2993fee8-3e34-4e2e-8cb9-63461934a6ef', 'admin-id', 'Inch', 'Length', 1, 'admin-id', '2026-01-14 08:34:51', 'admin-id', '2026-01-14 08:35:02', 1),
('324249dc-432a-44b8-8191-cb1bfe2ad530', 'admin-id', 'Ton', 'Weight', 1, 'admin-id', '2026-01-14 08:33:44', 'admin-id', '2026-01-14 08:35:06', 1),
('344eb4c8-48c4-475b-b74c-307a0e492622', 'admin-id', 'Pcs', 'Countable', 1, 'admin-id', '2026-01-11 04:40:18', 'admin-id', '2026-01-14 08:32:31', 1),
('50d3582c-909a-4818-afd7-54a8db8c1a44', 'admin-id', 'Pack', 'Countable', 1, 'admin-id', '2026-01-11 04:40:31', 'admin-id', '2026-01-14 08:32:33', 1),
('53640e3f-20b8-44a6-8872-5844630bfed0', 'admin-id', 'Gal', 'Volume', 1, 'admin-id', '2026-01-14 08:34:28', 'admin-id', '2026-01-14 08:35:16', 1),
('61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'admin-id', 'Dzn', 'Countable', 0, 'admin-id', '2026-01-11 04:40:57', 'admin-id', '2026-01-14 08:32:34', 1),
('674e6bee-5066-415a-9f35-b6e72f978a08', 'admin-id', 'Yard', 'Length', 1, 'admin-id', '2026-01-11 04:43:59', 'admin-id', '2026-01-14 08:32:44', 1),
('78a63632-6a35-49ab-8cac-4b5c0d4fb418', 'admin-id', 'Box', 'Countable', 1, 'admin-id', '2026-01-11 04:40:52', 'admin-id', '2026-01-14 08:32:46', 1),
('9233b04b-3367-4205-9b3c-bb569e1bebb6', 'admin-id', 'Inch', 'Length', 1, 'admin-id', '2026-01-14 08:34:34', 'admin-id', '2026-01-14 08:35:21', 1),
('a08ee30c-cb3d-467c-aff6-d347c74c9e8b', 'admin-id', 'Cm', 'Length', 1, 'admin-id', '2026-01-14 08:34:39', 'admin-id', '2026-01-14 08:35:25', 1),
('abc985a3-68b1-4b98-825b-ebe79903d033', 'admin-id', 'Bottle', 'Countable', 1, 'admin-id', '2026-01-14 08:33:58', 'admin-id', '2026-01-14 08:35:29', 1),
('c1ab2f8e-5030-40a4-85a3-569ad7cc6dd7', 'admin-id', 'Cage', 'Countable', 1, 'admin-id', '2026-01-14 08:34:18', 'admin-id', '2026-01-14 08:35:35', 1),
('cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'admin-id', 'Ctn', 'Countable', 1, 'admin-id', '2026-01-11 04:40:23', 'admin-id', '2026-01-14 08:32:47', 1),
('f13c1fb3-3493-4640-9b13-02bd824b4977', 'admin-id', 'Gm', 'Weight', 1, 'admin-id', '2026-01-14 08:33:32', 'admin-id', '2026-01-14 08:35:38', 1),
('f2fa8d7c-69d4-439d-9dea-66fba7aac17b', 'admin-id', 'Bag', 'Mass', 1, 'admin-id', '2026-01-14 08:34:10', 'admin-id', '2026-01-14 08:35:50', 1),
('f5ccd3c1-fd1e-4f0e-93be-59dd878c881a', 'admin-id', 'Poly', 'Countable', 1, 'admin-id', '2026-01-14 08:25:05', 'admin-id', '2026-01-14 08:32:49', 1),
('f5d78785-c08b-46b7-a77f-dcf1a8700dd0', 'admin-id', 'Crate', 'Mass', 1, 'admin-id', '2026-01-14 08:33:25', 'admin-id', '2026-01-14 08:35:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_bking`
--

CREATE TABLE `tmpb_bking` (
  `id` varchar(50) NOT NULL,
  `bking_pmstr` varchar(50) NOT NULL,
  `bking_bitem` varchar(50) NOT NULL,
  `bking_items` varchar(50) NOT NULL,
  `bking_bkrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_bkqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_itamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_dspct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_vtpct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_csrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_ntamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_notes` varchar(50) DEFAULT NULL,
  `bking_cnqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_ivqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_pnqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bking_crusr` varchar(50) NOT NULL,
  `bking_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bking_upusr` varchar(50) NOT NULL,
  `bking_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bking_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_bking`
--

INSERT INTO `tmpb_bking` (`id`, `bking_pmstr`, `bking_bitem`, `bking_items`, `bking_bkrat`, `bking_bkqty`, `bking_itamt`, `bking_dspct`, `bking_dsamt`, `bking_vtpct`, `bking_vtamt`, `bking_csrat`, `bking_ntamt`, `bking_notes`, `bking_cnqty`, `bking_ivqty`, `bking_pnqty`, `bking_actve`, `bking_crusr`, `bking_crdat`, `bking_upusr`, `bking_updat`, `bking_rvnmr`) VALUES
('4daceba8-dbed-4e84-9fd6-ce141bf9c2f9', 'b744ddca-4527-42a9-899b-11fce8c4aa6d', '2a0f1a32-00ff-4eb8-9356-82de14330180', '24614ec4-8ab0-4b50-b3c7-9f154a124770', 92.000000, 1.000000, 92.000000, 2.000000, 1.840000, 5.000000, 4.600000, 94.760000, 94.760000, '', 0.000000, 0.000000, 1.000000, 1, 'admin-id', '2026-01-15 04:51:49', 'admin-id', '2026-01-15 04:51:49', 1),
('75fb296a-2a5a-43af-b027-05faa1800265', 'b744ddca-4527-42a9-899b-11fce8c4aa6d', '32b18551-4330-42f3-8186-571834174792', 'e483bc2d-6ccd-4b72-8603-775dcd275249', 910.000000, 1.000000, 910.000000, 0.000000, 0.000000, 0.000000, 0.000000, 910.000000, 910.000000, '', 0.000000, 0.000000, 1.000000, 1, 'admin-id', '2026-01-15 04:51:49', 'admin-id', '2026-01-15 04:51:49', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_pmstr`
--

CREATE TABLE `tmpb_pmstr` (
  `id` varchar(50) NOT NULL,
  `pmstr_users` varchar(50) NOT NULL,
  `pmstr_bsins` varchar(50) NOT NULL,
  `pmstr_cntct` varchar(50) NOT NULL,
  `pmstr_odtyp` varchar(50) NOT NULL,
  `pmstr_trnno` varchar(50) NOT NULL,
  `pmstr_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `pmstr_trnte` varchar(100) DEFAULT NULL,
  `pmstr_refno` varchar(50) DEFAULT NULL,
  `pmstr_odamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_vatpy` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_incst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_excst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_rnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_ttamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_pyamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_pdamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_duamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_rtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_cnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `pmstr_ispad` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_ispst` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_isret` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_iscls` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_vatcl` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_hscnl` tinyint(1) NOT NULL DEFAULT 0,
  `pmstr_actve` tinyint(1) NOT NULL DEFAULT 1,
  `pmstr_crusr` varchar(50) NOT NULL,
  `pmstr_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `pmstr_upusr` varchar(50) NOT NULL,
  `pmstr_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pmstr_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_pmstr`
--

INSERT INTO `tmpb_pmstr` (`id`, `pmstr_users`, `pmstr_bsins`, `pmstr_cntct`, `pmstr_odtyp`, `pmstr_trnno`, `pmstr_trdat`, `pmstr_trnte`, `pmstr_refno`, `pmstr_odamt`, `pmstr_dsamt`, `pmstr_vtamt`, `pmstr_vatpy`, `pmstr_incst`, `pmstr_excst`, `pmstr_rnamt`, `pmstr_ttamt`, `pmstr_pyamt`, `pmstr_pdamt`, `pmstr_duamt`, `pmstr_rtamt`, `pmstr_cnamt`, `pmstr_ispad`, `pmstr_ispst`, `pmstr_isret`, `pmstr_iscls`, `pmstr_vatcl`, `pmstr_hscnl`, `pmstr_actve`, `pmstr_crusr`, `pmstr_crdat`, `pmstr_upusr`, `pmstr_updat`, `pmstr_rvnmr`) VALUES
('b744ddca-4527-42a9-899b-11fce8c4aa6d', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Purchase Booking', 'PB-150126-00001', '2026-01-15 00:00:00', '', '', 1002.000000, 1.840000, 4.600000, 1, 0.000000, 0.000000, 0.000000, 995.560000, 1004.760000, 0.000000, 1004.760000, 0.000000, 0.000000, 0, 1, 0, 0, 0, 0, 1, 'admin-id', '2026-01-15 04:51:48', 'admin-id', '2026-01-15 04:51:48', 1);

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
('45e5c6c7-0331-4e97-b304-15b03ee3d0c7', 'admin-id', '2026-01-09', 'tmsb_crgrn', 'Registration', 'Grocery Shop', 0.000000, 1000.000000, '2026-01-09 00:00:00', '2026-01-09 04:48:25', 1, '45e5c6c7-0331-4e97-b304-15b03ee3d0c7', '2026-01-12 04:48:25', '45e5c6c7-0331-4e97-b304-15b03ee3d0c7', '2026-01-13 05:13:33', 1),
('5b8a0446-f11e-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-13', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-13 00:00:00', '2026-01-13 00:00:00', 1, 'sys', '2026-01-14 07:55:13', 'sys', '2026-01-14 07:55:13', 1),
('5b8ac4be-f11e-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-13', 'tmsb_crgrn', 'Grains', NULL, 16.000000, 0.000000, '2026-01-13 00:00:00', '2026-01-13 00:00:00', 1, 'sys', '2026-01-14 07:55:13', 'sys', '2026-01-14 07:55:13', 1),
('ca2657e7-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-09', 'tmcb_cntct', 'Contact', NULL, 1.000000, 0.000000, '2026-01-09 00:00:00', '2026-01-09 00:00:00', 1, 'sys', '2026-01-13 05:14:17', 'sys', '2026-01-13 05:14:17', 1),
('d4fa1225-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-10', 'tmtb_ledgr', 'Accounts Ledger', NULL, 6.000000, 0.000000, '2026-01-10 00:00:00', '2026-01-10 00:00:00', 1, 'sys', '2026-01-13 05:14:35', 'sys', '2026-01-13 05:14:35', 1),
('d502d99e-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-10', 'tmtb_trhed', 'Accounts Heads', NULL, 35.000000, 0.000000, '2026-01-10 00:00:00', '2026-01-10 00:00:00', 1, 'sys', '2026-01-13 05:14:35', 'sys', '2026-01-13 05:14:35', 1),
('df202833-f1ca-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-14', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-14 00:00:00', '2026-01-14 00:00:00', 1, 'sys', '2026-01-15 04:29:56', 'sys', '2026-01-15 04:29:56', 1),
('df202866-f1ca-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-14', 'tmcb_cntct', 'Contact', NULL, 2.000000, 0.000000, '2026-01-14 00:00:00', '2026-01-14 00:00:00', 1, 'sys', '2026-01-15 04:29:56', 'sys', '2026-01-15 04:29:56', 1),
('df215ca9-f1ca-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-14', 'tmib_bitem', 'Business Item', NULL, 6.000000, 0.000000, '2026-01-14 00:00:00', '2026-01-14 00:00:00', 1, 'sys', '2026-01-15 04:29:56', 'sys', '2026-01-15 04:29:56', 1),
('df2aa5ff-f1ca-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-14', 'tmsb_crgrn', 'Grains', NULL, 2.000000, 0.000000, '2026-01-14 00:00:00', '2026-01-14 00:00:00', 1, 'sys', '2026-01-15 04:29:56', 'sys', '2026-01-15 04:29:56', 1),
('df2b2c7b-f1ca-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-14', 'tmib_items', 'Item List', NULL, 6.000000, 0.000000, '2026-01-14 00:00:00', '2026-01-14 00:00:00', 1, 'sys', '2026-01-15 04:29:56', 'sys', '2026-01-15 04:29:56', 1),
('df2b303d-f1ca-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-14', 'tmib_iuofm', 'Item Unit', NULL, 20.000000, 0.000000, '2026-01-14 00:00:00', '2026-01-14 00:00:00', 1, 'sys', '2026-01-15 04:29:56', 'sys', '2026-01-15 04:29:56', 1),
('e1c04769-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-11', 'tmab_bsins', 'Business', NULL, 3.000000, 0.000000, '2026-01-11 00:00:00', '2026-01-11 00:00:00', 1, 'sys', '2026-01-13 05:14:56', 'sys', '2026-01-13 05:14:56', 1),
('e1c6eaa5-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-11', 'tmib_ctgry', 'Item Category', NULL, 6.000000, 0.000000, '2026-01-11 00:00:00', '2026-01-11 00:00:00', 1, 'sys', '2026-01-13 05:14:56', 'sys', '2026-01-13 05:14:56', 1),
('e1c6eaa9-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-11', 'tmtb_trhed', 'Accounts Heads', NULL, 4.000000, 0.000000, '2026-01-11 00:00:00', '2026-01-11 00:00:00', 1, 'sys', '2026-01-13 05:14:56', 'sys', '2026-01-13 05:14:56', 1),
('e1c6eaab-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-11', 'tmib_iuofm', 'Item Unit', NULL, 8.000000, 0.000000, '2026-01-11 00:00:00', '2026-01-11 00:00:00', 1, 'sys', '2026-01-13 05:14:56', 'sys', '2026-01-13 05:14:56', 1),
('e1c6eab7-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-11', 'tmib_bitem', 'Business Item', NULL, 5.000000, 0.000000, '2026-01-11 00:00:00', '2026-01-11 00:00:00', 1, 'sys', '2026-01-13 05:14:56', 'sys', '2026-01-13 05:14:56', 1),
('e1c6eca2-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-11', 'tmtb_bacts', 'Business Accounts', NULL, 2.000000, 0.000000, '2026-01-11 00:00:00', '2026-01-11 00:00:00', 1, 'sys', '2026-01-13 05:14:56', 'sys', '2026-01-13 05:14:56', 1),
('eb46a8ac-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-12', 'tmab_bsins', 'Business', NULL, 1.000000, 0.000000, '2026-01-12 00:00:00', '2026-01-12 00:00:00', 1, 'sys', '2026-01-13 05:15:12', 'sys', '2026-01-13 05:15:12', 1),
('eb49281f-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-12', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-12 00:00:00', '2026-01-12 00:00:00', 1, 'sys', '2026-01-13 05:15:12', 'sys', '2026-01-13 05:15:12', 1),
('eb494a4e-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-12', 'tmcb_cntct', 'Contact', NULL, 2.000000, 0.000000, '2026-01-12 00:00:00', '2026-01-12 00:00:00', 1, 'sys', '2026-01-13 05:15:12', 'sys', '2026-01-13 05:15:12', 1),
('eb495188-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-12', 'tmib_bitem', 'Business Item', NULL, 7.000000, 0.000000, '2026-01-12 00:00:00', '2026-01-12 00:00:00', 1, 'sys', '2026-01-13 05:15:12', 'sys', '2026-01-13 05:15:12', 1),
('eb496ca1-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-12', 'tmib_items', 'Item List', NULL, 8.000000, 0.000000, '2026-01-12 00:00:00', '2026-01-12 00:00:00', 1, 'sys', '2026-01-13 05:15:12', 'sys', '2026-01-13 05:15:12', 1),
('eb497272-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-12', 'tmib_iuofm', 'Item Unit', NULL, 1.000000, 0.000000, '2026-01-12 00:00:00', '2026-01-12 00:00:00', 1, 'sys', '2026-01-13 05:15:12', 'sys', '2026-01-13 05:15:12', 1);

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
-- Table structure for table `tmtb_rcvpy`
--

CREATE TABLE `tmtb_rcvpy` (
  `id` varchar(50) NOT NULL,
  `rcvpy_users` varchar(50) NOT NULL,
  `rcvpy_bsins` varchar(50) NOT NULL,
  `rcvpy_cntct` varchar(50) NOT NULL,
  `rcvpy_pymod` varchar(50) NOT NULL,
  `rcvpy_refid` varchar(50) NOT NULL,
  `rcvpy_refno` varchar(50) NOT NULL,
  `rcvpy_srcnm` varchar(50) NOT NULL,
  `rcvpy_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rcvpy_notes` varchar(100) DEFAULT NULL,
  `rcvpy_pyamt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rcvpy_crusr` varchar(50) NOT NULL,
  `rcvpy_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rcvpy_upusr` varchar(50) NOT NULL,
  `rcvpy_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rcvpy_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('Z1001', 'admin-id', 'Asset Purchase (-)', 'Asset', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:31', 'admin-id', '2026-01-11 12:30:08', 1),
('Z1002', 'admin-id', 'Asset Sale (+)', 'Asset', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:31', 'admin-id', '2026-01-11 12:32:04', 1),
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
('Z801', 'admin-id', 'Loss (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-11 12:34:15', 1),
('Z802', 'admin-id', 'Withdrawal (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z803', 'admin-id', 'Bank Charges (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z804', 'admin-id', 'Bank Loan Payment (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z805', 'admin-id', 'Other Cost (-)', 'Expenditure', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:45', 'admin-id', '2026-01-10 08:06:45', 1),
('Z901', 'admin-id', 'Rent (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z902', 'admin-id', 'Rent Advance (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z903', 'admin-id', 'Electricity Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1),
('Z904', 'admin-id', 'Internet Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-11 12:32:07', 1),
('Z905', 'admin-id', 'Transport Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-10 08:06:39', 'admin-id', '2026-01-10 08:06:39', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmub_notes`
--

CREATE TABLE `tmub_notes` (
  `id` varchar(50) NOT NULL,
  `notes_users` varchar(50) NOT NULL,
  `notes_title` varchar(100) NOT NULL,
  `notes_descr` varchar(500) DEFAULT NULL,
  `notes_dudat` datetime NOT NULL DEFAULT current_timestamp(),
  `notes_stat` varchar(50) DEFAULT 'In Progress',
  `notes_actve` tinyint(1) NOT NULL DEFAULT 1,
  `notes_crusr` varchar(50) NOT NULL,
  `notes_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `notes_upusr` varchar(50) NOT NULL,
  `notes_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notes_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmub_notes`
--

INSERT INTO `tmub_notes` (`id`, `notes_users`, `notes_title`, `notes_descr`, `notes_dudat`, `notes_stat`, `notes_actve`, `notes_crusr`, `notes_crdat`, `notes_upusr`, `notes_updat`, `notes_rvnmr`) VALUES
('6e9a94bf-a9ec-4d3f-9ed1-e0da18c1c0f9', 'admin-id', 'Development in Progress', 'Development in Progress', '2026-01-15 19:56:00', 'In Progress', 1, 'admin-id', '2026-01-14 07:58:44', 'admin-id', '2026-01-14 08:00:14', 3);

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
-- Indexes for table `tmpb_bking`
--
ALTER TABLE `tmpb_bking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_pmstr`
--
ALTER TABLE `tmpb_pmstr`
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
-- Indexes for table `tmtb_rcvpy`
--
ALTER TABLE `tmtb_rcvpy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmtb_trhed`
--
ALTER TABLE `tmtb_trhed`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmub_notes`
--
ALTER TABLE `tmub_notes`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
