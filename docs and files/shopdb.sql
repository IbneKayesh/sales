-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jan 27, 2026 at 02:55 AM
-- Server version: 11.8.2-MariaDB-ubu2404
-- PHP Version: 8.2.27

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
  `bsins_prtrn` tinyint(1) NOT NULL DEFAULT 1,
  `bsins_sltrn` tinyint(1) NOT NULL DEFAULT 1,
  `bsins_stdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bsins_pbviw` tinyint(1) NOT NULL DEFAULT 0,
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

INSERT INTO `tmab_bsins` (`id`, `bsins_users`, `bsins_bname`, `bsins_addrs`, `bsins_email`, `bsins_cntct`, `bsins_image`, `bsins_binno`, `bsins_btags`, `bsins_cntry`, `bsins_prtrn`, `bsins_sltrn`, `bsins_stdat`, `bsins_pbviw`, `bsins_actve`, `bsins_crusr`, `bsins_crdat`, `bsins_upusr`, `bsins_updat`, `bsins_rvnmr`) VALUES
('0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'admin-id', 'Grain Mart – Dhanmondi', 'Road 27, Dhanmondi, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'CT2025-0978-22364', 'Grocery', 'Bangladesh', 1, 1, '2026-01-09 00:00:00', 1, 1, 'admin-id', '2026-01-09 08:39:57', 'admin-id', '2026-01-20 09:36:19', 8),
('3881b053-9509-49db-835a-3f8dd8976cda', 'admin-id', 'Green Mart – Uttara', 'Sector 10, Uttara, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'GT-9872-6871-5555', 'Grocery', 'Bangladesh', 1, 1, '2026-01-11 00:00:00', 0, 1, 'admin-id', '2026-01-11 08:28:46', 'admin-id', '2026-01-27 02:47:54', 10),
('3df6fda2-9cb2-4e71-bbf3-459b635c040e', 'admin-id', 'Household Vally', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'CT2021-0325-23170', 'Grocery Store', 'Bangladesh', 1, 1, '2026-01-11 00:00:00', 0, 1, 'admin-id', '2026-01-11 08:32:18', 'admin-id', '2026-01-19 12:12:41', 5),
('6dd0f9d0-840a-43ce-8f82-a60310521756', 'admin-id', 'Central Distribution Warehouse', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, '', 'Grocery Store', 'Bangladesh', 1, 1, '2026-01-11 00:00:00', 0, 1, 'admin-id', '2026-01-11 08:31:43', 'admin-id', '2026-01-20 09:36:13', 5);

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
('admin-id', 'admin@sgd.com', 'password', 'recover', 'Admin User', '01722688266', '3881b053-9509-49db-835a-3f8dd8976cda', 'Admin', 'admin-id', 0, 'Standard', '2026-01-09 08:39:57', NULL, '2026-01-09 08:39:57', '2026-01-11 12:19:32', 'Welcome Note', 'User Note', 741.00, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 08:39:57', 'admin-id', '2026-01-20 04:21:59', 8);

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
  `cntct_tinno` varchar(50) NOT NULL,
  `cntct_trade` varchar(50) NOT NULL,
  `cntct_ofadr` varchar(300) DEFAULT NULL,
  `cntct_fcadr` varchar(300) DEFAULT NULL,
  `cntct_tarea` varchar(50) NOT NULL,
  `cntct_dzone` varchar(50) NOT NULL,
  `cntct_cntry` varchar(50) DEFAULT NULL,
  `cntct_cntad` varchar(50) DEFAULT NULL,
  `cntct_dspct` decimal(18,6) NOT NULL DEFAULT 0.000000,
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

INSERT INTO `tmcb_cntct` (`id`, `cntct_users`, `cntct_bsins`, `cntct_ctype`, `cntct_sorce`, `cntct_cntnm`, `cntct_cntps`, `cntct_cntno`, `cntct_email`, `cntct_tinno`, `cntct_trade`, `cntct_ofadr`, `cntct_fcadr`, `cntct_tarea`, `cntct_dzone`, `cntct_cntry`, `cntct_cntad`, `cntct_dspct`, `cntct_crlmt`, `cntct_pybln`, `cntct_adbln`, `cntct_crbln`, `cntct_actve`, `cntct_crusr`, `cntct_crdat`, `cntct_upusr`, `cntct_updat`, `cntct_rvnmr`) VALUES
('08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Bengal Fresh Foods', 'Nusrat Jahan', '01822-000002', 'email@sgd.com', 'TIN-123456', 'TRADE-123456', 'Chittagong Wholesale Market', 'Chittagong Wholesale Market', 'sirajganj-sadar', 'sirajganj', 'Bangladesh', '0', 10.000000, 20000.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-14 09:17:52', 'admin-id', '2026-01-25 05:14:59', 6),
('11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Al Noor Store', 'Javed Hasan', '01623-100104', 'email@sgd.com', 'TIN-123456', 'TRADE-123456', 'Sylhet Zindabazar', 'Sylhet Zindabazar', 'bogra-sadar', 'bogra', 'Bangladesh', '0', 10.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-18 11:24:23', 'admin-id', '2026-01-25 05:13:00', 3),
('267bb3aa-9177-43d2-8d8b-e0137578cf98', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Dhaka Agro Traders', 'Md. Kamal Hossain', '01711-000001', 'email@email.com', '', '', 'Kawran Bazar, Dhaka', 'Kawran Bazar, Dhaka', 'araihazar', 'narayanganj', 'Bangladesh', '0', 0.000000, 20000.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:10', 'admin-id', '2026-01-25 05:36:49', 4),
('41981c62-d7fc-4238-a8f1-8c70bd2c1e0e', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Bismillah Traders', 'Hafiz Uddin', '01921-100103', '', '', '', 'Cumilla Sadar', 'Cumilla Sadar', 'araihazar', 'narayanganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-18 11:24:02', 'admin-id', '2026-01-25 05:35:58', 2),
('521e18fc-b57a-48c4-a0a7-d7772edb4b76', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'M/S Amin Enterprise', 'Aminul Islam', '01534-100105', '', '', '', 'Khulna Boyra', 'Khulna Boyra', 'kachpur', 'narayanganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-18 11:24:45', 'admin-id', '2026-01-25 05:37:18', 2),
('639611f4-97e5-4589-904e-190ef11f7f4e', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Jisan Dairy Source', 'Akhi Khatun', '01555-000005', '', '', '', 'Mirpur-10, Dhaka', 'Mirpur-10, Dhaka', 'enayetpur', 'sirajganj', 'Bangladesh', '0', 0.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-18 11:10:29', 'admin-id', '2026-01-25 05:37:05', 2),
('6a0619ca-84e9-4df5-b225-7dd7acb91b86', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Green Farm Ltd.', 'Abdul Karim', '01933-000003', '', '', '', 'Bogura Sadar, Bogura', 'Bogura Sadar, Bogura', 'bogra-sadar', 'bogra', 'Bangladesh', '0', 10.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-18 11:09:12', 'admin-id', '2026-01-25 05:35:12', 2),
('be93309a-ec2b-40d0-9c62-8abe7796b547', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Golden Grain Supply', 'Rashed Mahmud', '01644-000004', '', '', '', 'Jashore Industrial Area', 'Jashore Industrial Area', 'kamarkhanda', 'sirajganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-18 11:09:47', 'admin-id', '2026-01-25 05:36:57', 2),
('both', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Both', 'Local', 'Both A/C', 'Both A/C', 'Both A/C', 'Both A/C', '', '', 'Both A/C', 'Both A/C', 'sherpur', 'bogra', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 13:04:25', 'admin-id', '2026-01-25 05:36:12', 3),
('c370a9f5-7ccf-4e2d-9d7a-7d5873293ddc', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Shapno Mini Mart', 'Farzana Islam', '01819-100102', 'email@sgd.com', '', '', 'Uttara Sector 7, Dhaka', 'Uttara Sector 7, Dhaka', 'belkuchi', 'sirajganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'admin-id', '2026-01-14 09:23:59', 'admin-id', '2026-01-25 05:36:25', 3),
('d5eefaf0-9979-4edf-8fbd-68f3157c4105', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Rahman General Store', 'Anisur Rahman', '01712-100101', 'email@email.com', '', '', 'Mohammadpur, Dhaka', 'Mohammadpur, Dhaka', 'adamdighi', 'bogra', 'Bangladesh', '0', 0.000000, 50000.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:29', 'admin-id', '2026-01-25 05:36:40', 4),
('internal', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Internal', 'Local', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', '', '', 'Internal A/C', 'Internal A/C', 'sherpur', 'bogra', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 13:04:25', 'admin-id', '2026-01-25 05:37:31', 3);

-- --------------------------------------------------------

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
-- Dumping data for table `tmcb_dzone`
--

INSERT INTO `tmcb_dzone` (`id`, `dzone_users`, `dzone_bsins`, `dzone_cntry`, `dzone_dname`, `dzone_actve`, `dzone_crusr`, `dzone_crdat`, `dzone_upusr`, `dzone_updat`, `dzone_rvnmr`) VALUES
('bogra', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'Bangladesh', 'Bogra', 1, 'admin-id', '2026-01-25 04:45:54', 'admin-id', '2026-01-25 04:46:18', 1),
('narayanganj', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'Bangladesh', 'Narayanganj', 1, 'admin-id', '2026-01-25 04:45:54', 'admin-id', '2026-01-25 04:46:18', 1),
('sirajganj', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'Bangladesh', 'Sirajganj', 1, 'admin-id', '2026-01-25 04:45:54', 'admin-id', '2026-01-25 04:46:20', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_rutes`
--

CREATE TABLE `tmcb_rutes` (
  `id` varchar(50) NOT NULL,
  `rutes_users` varchar(50) NOT NULL,
  `rutes_bsins` varchar(50) NOT NULL,
  `rutes_rname` varchar(50) NOT NULL,
  `rutes_dname` varchar(50) NOT NULL,
  `rutes_sraid` varchar(50) NOT NULL,
  `rutes_lvdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rutes_ttcnt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rutes_odval` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rutes_dlval` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rutes_clval` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rutes_duval` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rutes_actve` tinyint(1) NOT NULL DEFAULT 1,
  `rutes_crusr` varchar(50) NOT NULL,
  `rutes_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rutes_upusr` varchar(50) NOT NULL,
  `rutes_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rutes_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_tarea`
--

CREATE TABLE `tmcb_tarea` (
  `id` varchar(50) NOT NULL,
  `tarea_users` varchar(50) NOT NULL,
  `tarea_bsins` varchar(50) NOT NULL,
  `tarea_dzone` varchar(50) NOT NULL,
  `tarea_tname` varchar(50) NOT NULL,
  `tarea_actve` tinyint(1) NOT NULL DEFAULT 1,
  `tarea_crusr` varchar(50) NOT NULL,
  `tarea_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tarea_upusr` varchar(50) NOT NULL,
  `tarea_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tarea_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmcb_tarea`
--

INSERT INTO `tmcb_tarea` (`id`, `tarea_users`, `tarea_bsins`, `tarea_dzone`, `tarea_tname`, `tarea_actve`, `tarea_crusr`, `tarea_crdat`, `tarea_upusr`, `tarea_updat`, `tarea_rvnmr`) VALUES
('adamdighi', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Adamdighi', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('araihazar', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Araihazar', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('bandar', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Bandar', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('belkuchi', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Belkuchi', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:29:10', 1),
('bhairob', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Bhairob', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('bogra-sadar', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Bogra Sadar', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('chauhali', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Chauhali', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:26', 1),
('dhunat', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Dhunat', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('dhupchanchia', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Dhupchanchia', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('enayetpur', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Enayetpur', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:26', 1),
('gabtali', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Gabtali', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('jamuna-river', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Jamuna River', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:29:10', 1),
('kachpur', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Kachpur', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('kahaloo', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Kahaloo', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('kamarkhanda', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Kamarkhanda', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:26:55', 1),
('kazipur', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Kazipur', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:26', 1),
('nandigram', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Nandigram', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('narayanganj-city-corporation', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Narayanganj City Corporation', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('narayanganj-sadar', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Narayanganj Sadar', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('raiganj', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Raiganj', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:29:10', 1),
('rupganj', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Rupganj', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('sariakandi', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Sariakandi', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('shahjadpur', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Shahjadpur', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:26', 1),
('shajahanpur', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Shajahanpur', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('sherpur', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Sherpur', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('shibganj', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Shibganj', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('sirajganj-sadar', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Sirajganj Sadar', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:26', 1),
('sonargaon', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'narayanganj', 'Sonargaon', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1),
('sonatala', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'bogra', 'Sonatala', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 04:58:23', 1),
('tarash', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', 'sirajganj', 'Tarash', 1, 'admin-id', '2026-01-25 04:57:51', 'admin-id', '2026-01-25 05:19:19', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_attrb`
--

CREATE TABLE `tmib_attrb` (
  `id` varchar(50) NOT NULL,
  `attrb_users` varchar(50) NOT NULL,
  `attrb_aname` varchar(50) NOT NULL,
  `attrb_dtype` varchar(50) NOT NULL,
  `attrb_actve` tinyint(1) NOT NULL DEFAULT 1,
  `attrb_crusr` varchar(50) NOT NULL,
  `attrb_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `attrb_upusr` varchar(50) NOT NULL,
  `attrb_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `attrb_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmib_attrb`
--

INSERT INTO `tmib_attrb` (`id`, `attrb_users`, `attrb_aname`, `attrb_dtype`, `attrb_actve`, `attrb_crusr`, `attrb_crdat`, `attrb_upusr`, `attrb_updat`, `attrb_rvnmr`) VALUES
('color', 'admin-id', 'Color', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:38:19', 1),
('expiry', 'admin-id', 'Expiry', 'date', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:42:46', 1),
('fabric', 'admin-id', 'Fabric', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:38:19', 1),
('height', 'admin-id', 'Height', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:38:19', 1),
('imei', 'admin-id', 'IMEI', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:40:47', 1),
('serialno', 'admin-id', 'Serial No', 'number', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:38:19', 1),
('size', 'admin-id', 'Size', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 08:24:21', 1),
('weight', 'admin-id', 'Weight', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 08:24:21', 1),
('width', 'admin-id', 'Width', 'text', 1, 'admin-id', '2026-01-25 07:38:19', 'admin-id', '2026-01-25 07:38:19', 1);

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
('0a73b49d-71b3-4671-9c09-6d985f3514fc', 'admin-id', '485d61c3-e84e-418b-b91b-2171c17f0391', '3881b053-9509-49db-835a-3f8dd8976cda', 260.000000, 0.000000, 377.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 70.200000, 1, 'admin-id', '2026-01-18 11:54:40', 'admin-id', '2026-01-27 02:14:22', 1),
('0b9c71ef-77de-4116-8298-ac0898e2d217', 'admin-id', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', '3881b053-9509-49db-835a-3f8dd8976cda', 10.000000, 0.000000, 15.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 3.000000, 1, 'admin-id', '2026-01-18 11:33:26', 'admin-id', '2026-01-27 01:20:49', 1),
('22064b47-6898-4661-9dc8-5329a542ae4a', 'admin-id', '24614ec4-8ab0-4b50-b3c7-9f154a124770', '3881b053-9509-49db-835a-3f8dd8976cda', 110.000000, 0.000000, 154.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 26.400000, 1, 'admin-id', '2026-01-18 11:48:18', 'admin-id', '2026-01-27 02:14:22', 1),
('22bbdf6e-759b-4b46-a0a6-b5d2a8d7d383', 'admin-id', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', '3881b053-9509-49db-835a-3f8dd8976cda', 15.000000, 0.000000, 22.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.300000, 1, 'admin-id', '2026-01-18 11:40:04', 'admin-id', '2026-01-27 02:14:22', 1),
('49637732-1033-454e-8690-e4162e763fdd', 'admin-id', '8873e069-eea6-4f9e-acf0-dd1cb658f9c8', '3881b053-9509-49db-835a-3f8dd8976cda', 18.000000, 0.000000, 25.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.300000, 1, 'admin-id', '2026-01-18 12:20:40', 'admin-id', '2026-01-18 12:20:40', 1),
('69b3b567-0009-48b6-abf3-5701e00ab0e1', 'admin-id', 'ad014a04-77d0-4f46-acc9-dee2b02c64f2', '3881b053-9509-49db-835a-3f8dd8976cda', 22.000000, 0.000000, 32.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 6.040000, 1, 'admin-id', '2026-01-18 12:22:53', 'admin-id', '2026-01-18 12:22:53', 1),
('73a91ad4-50f1-4b8b-8a93-ad00e7829c8f', 'admin-id', '4b100c2e-68a6-467b-94b7-617a6c7b43dc', '3881b053-9509-49db-835a-3f8dd8976cda', 85.000000, 0.000000, 128.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 26.000000, 1, 'admin-id', '2026-01-18 12:10:02', 'admin-id', '2026-01-18 12:10:02', 1),
('7df55d16-a7c1-4e85-94a2-67f826401fe6', 'admin-id', '471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', '3881b053-9509-49db-835a-3f8dd8976cda', 140.000000, 0.000000, 203.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 37.800000, 1, 'admin-id', '2026-01-18 12:11:01', 'admin-id', '2026-01-27 02:14:22', 1),
('803770fe-3449-41e5-b2e1-50d2a02b6872', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ecf', '3881b053-9509-49db-835a-3f8dd8976cda', 120.000000, 0.000000, 180.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 42.000000, 1, 'admin-id', '2026-01-18 11:41:51', 'admin-id', '2026-01-18 11:41:51', 1),
('854996eb-cabc-487b-a5bc-692bfffe2689', 'admin-id', '75b05c78-9b6b-42ba-aafa-e76e22f67722', '3881b053-9509-49db-835a-3f8dd8976cda', 28.000000, 0.000000, 42.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 8.400000, 1, 'admin-id', '2026-01-18 12:05:52', 'admin-id', '2026-01-18 12:05:52', 1),
('921ea45d-ceac-4f42-ac69-3b17c74a590b', 'admin-id', '4b019cba-eda8-4ad3-a8ac-ece0e6478ffe', '3881b053-9509-49db-835a-3f8dd8976cda', 12.000000, 0.000000, 16.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 2.320000, 1, 'admin-id', '2026-01-18 12:21:38', 'admin-id', '2026-01-18 12:21:38', 1),
('9a08c3f7-2154-4cb5-ad90-8346f705f6f5', 'admin-id', '2bee4dba-5f29-4e65-b772-718c677e326c', '3881b053-9509-49db-835a-3f8dd8976cda', 20.000000, 0.000000, 30.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 6.000000, 1, 'admin-id', '2026-01-18 12:24:01', 'admin-id', '2026-01-18 12:24:01', 1),
('a06cf515-c579-4628-96c4-c1f88f0d9308', 'admin-id', '42ccd66a-70db-4c7f-93c4-36261a8f064f', '3881b053-9509-49db-835a-3f8dd8976cda', 90.000000, 0.000000, 126.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 18.000000, 1, 'admin-id', '2026-01-18 11:53:22', 'admin-id', '2026-01-27 01:20:49', 1),
('a5da4ada-2216-49a6-bfde-aa71f0de6bb8', 'admin-id', '38b496e9-6652-4324-8331-ba0ecb0cfeae', '3881b053-9509-49db-835a-3f8dd8976cda', 60.000000, 0.000000, 78.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 9.000000, 1, 'admin-id', '2026-01-18 11:51:19', 'admin-id', '2026-01-18 11:51:19', 1),
('bfa793e3-23b6-4472-96e7-2b13bb70f476', 'admin-id', 'b3da1017-bea4-44fd-ad13-110e92a48965', '3881b053-9509-49db-835a-3f8dd8976cda', 40.000000, 0.000000, 51.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 6.200000, 1, 'admin-id', '2026-01-18 11:49:13', 'admin-id', '2026-01-18 11:49:13', 1),
('c9dcd99f-c04f-44f0-8778-d33c7cfc068c', 'admin-id', '940f8010-5d38-4de4-b66f-d12958ff9ec2', '3881b053-9509-49db-835a-3f8dd8976cda', 52.000000, 0.000000, 70.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 10.200000, 1, 'admin-id', '2026-01-18 11:46:22', 'admin-id', '2026-01-21 07:20:11', 1),
('cc4ea99b-527d-477d-8153-1a831b35d4de', 'admin-id', '0e5de4e6-86dd-453a-8b94-963ee305e860', '3881b053-9509-49db-835a-3f8dd8976cda', 95.000000, 0.000000, 133.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 22.800000, 1, 'admin-id', '2026-01-18 12:08:53', 'admin-id', '2026-01-18 12:08:53', 1),
('d0249c21-993f-40a7-9819-d05b046d8591', 'admin-id', 'e2e70dc1-9814-400c-8774-2b6b186b79e5', '3881b053-9509-49db-835a-3f8dd8976cda', 180.000000, 0.000000, 252.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 39.600000, 1, 'admin-id', '2026-01-18 11:55:39', 'admin-id', '2026-01-18 11:55:39', 1),
('d9dfcad2-2bdd-4770-86e3-448c75efabe7', 'admin-id', '2c047e91-44f6-48bc-a591-9ab00deb7b72', '3881b053-9509-49db-835a-3f8dd8976cda', 95.000000, 0.000000, 128.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 18.750000, 1, 'admin-id', '2026-01-18 11:49:59', 'admin-id', '2026-01-18 11:49:59', 1),
('e27daa49-9065-4e51-9dd5-246c1451d264', 'admin-id', 'f949a24a-3ff8-4349-9ca0-f853de9226c7', '3881b053-9509-49db-835a-3f8dd8976cda', 110.000000, 0.000000, 160.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 30.200000, 1, 'admin-id', '2026-01-18 12:07:47', 'admin-id', '2026-01-18 12:07:47', 1),
('f79040d1-8a63-4b4a-a515-16796fd56797', 'admin-id', '4dab149a-e220-4cd8-a061-7660ab0168bb', '3881b053-9509-49db-835a-3f8dd8976cda', 58.000000, 0.000000, 75.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 8.880000, 1, 'admin-id', '2026-01-18 11:47:21', 'admin-id', '2026-01-21 07:20:11', 1),
('f7c7bdba-dbb1-47e2-95f7-8710f9267b6a', 'admin-id', 'f7126510-80c0-416b-a34e-3a514e54d030', '3881b053-9509-49db-835a-3f8dd8976cda', 25.000000, 0.000000, 35.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 6.250000, 1, 'admin-id', '2026-01-18 12:24:55', 'admin-id', '2026-01-18 12:24:55', 1),
('f9d0b5e0-8d00-4309-b885-45e41b1297d0', 'admin-id', 'e483bc2d-6ccd-4b72-8603-775dcd275249', '3881b053-9509-49db-835a-3f8dd8976cda', 420.000000, 0.000000, 546.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 84.000000, 1, 'admin-id', '2026-01-18 11:44:14', 'admin-id', '2026-01-18 11:44:14', 1),
('fc0f7f6f-048a-4512-b614-79b13efa72bd', 'admin-id', 'fa1b188a-c075-4b90-bbea-37e3733f50bb', '3881b053-9509-49db-835a-3f8dd8976cda', 580.000000, 0.000000, 783.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 98.600000, 1, 'admin-id', '2026-01-18 11:52:30', 'admin-id', '2026-01-20 10:49:29', 1),
('fdfa97ae-9622-4548-bc27-4cf8a163cfa3', 'admin-id', 'e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', '3881b053-9509-49db-835a-3f8dd8976cda', 160.000000, 0.000000, 219.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 39.800000, 1, 'admin-id', '2026-01-18 11:43:14', 'admin-id', '2026-01-18 11:43:14', 1);

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
('204e4887-0af6-4908-add0-240ea380a53b', 'admin-id', 'Household Essentials', 1, 'admin-id', '2026-01-11 05:06:00', 'admin-id', '2026-01-18 11:29:46', 1),
('36886293-b080-44dc-9c8e-fed94ad161d3', 'admin-id', 'Rice & Grain', 1, 'admin-id', '2026-01-11 05:04:19', 'admin-id', '2026-01-18 11:29:19', 1),
('3ed137d4-3863-407a-8f4a-dd1000479780', 'admin-id', 'Dairy Products', 1, 'admin-id', '2026-01-11 05:04:25', 'admin-id', '2026-01-18 11:29:36', 1),
('b1df68d6-2888-42c7-a3a8-cdaedadf5408', 'admin-id', 'Toys and Gears', 1, 'admin-id', '2026-01-11 05:04:47', 'admin-id', '2026-01-18 11:30:21', 1),
('e69fe3b2-784f-44d5-9d88-4c228704242f', 'admin-id', 'Eggs & Poultry', 1, 'admin-id', '2026-01-11 05:04:10', 'admin-id', '2026-01-18 11:29:01', 1),
('feacdbbe-2519-4975-96fe-ad18c7899b53', 'admin-id', 'Beverages & Snacks', 1, 'admin-id', '2026-01-11 05:03:50', 'admin-id', '2026-01-22 10:52:51', 1);

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
('0e5de4e6-86dd-453a-8b94-963ee305e860', 'admin-id', 'HE-003', 'HE-003', 'HE-003', 'Floor Cleaner', 'Floor Cleaner', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 1, '1f240f2c-50ab-407f-b77d-0ce95922fd6c', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 0, 7.50, 16.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:08:34', 'admin-id', '2026-01-18 12:08:53', 1),
('24614ec4-8ab0-4b50-b3c7-9f154a124770', 'admin-id', 'RG-003', 'RG-003', 'RG-003', 'Basmati Rice', 'Basmati Rice', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 0, 5.00, 16.00, NULL, 1, 1, 'admin-id', '2026-01-12 06:16:06', 'admin-id', '2026-01-18 11:48:18', 1),
('2bee4dba-5f29-4e65-b772-718c677e326c', 'admin-id', 'BS-004', 'BS-004', 'BS-004', 'Potato Chips', 'Potato Chips', '344eb4c8-48c4-475b-b74c-307a0e492622', 20, 'f5ccd3c1-fd1e-4f0e-93be-59dd878c881a', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 10.00, 20.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:23:51', 'admin-id', '2026-01-18 12:24:01', 1),
('2c047e91-44f6-48bc-a591-9ab00deb7b72', 'admin-id', 'RG-005', 'RG-005', 'RG-005', 'Masur Dal', 'Masur Dal', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 0, 5.00, 15.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:49:45', 'admin-id', '2026-01-18 11:49:59', 1),
('38b496e9-6652-4324-8331-ba0ecb0cfeae', 'admin-id', 'DP-001', 'DP-001', 'DP-001', 'Fresh Milk', 'Fresh Milk', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 1, '1f240f2c-50ab-407f-b77d-0ce95922fd6c', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 15.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:51:08', 'admin-id', '2026-01-18 11:51:19', 1),
('42ccd66a-70db-4c7f-93c4-36261a8f064f', 'admin-id', 'DP-003', 'DP-003', 'DP-003', 'Yogurt', 'Yogurt', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 20.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:53:02', 'admin-id', '2026-01-18 11:53:22', 1),
('471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', 'admin-id', 'HE-005', 'HE-005', 'HE-005', 'Tissue Roll', 'Tissue Roll', '344eb4c8-48c4-475b-b74c-307a0e492622', 6, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 0, 7.50, 18.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:10:46', 'admin-id', '2026-01-18 12:11:01', 1),
('485d61c3-e84e-418b-b91b-2171c17f0391', 'admin-id', 'DP-004', 'DP-004', 'DP-004', 'Butter', 'Butter', '344eb4c8-48c4-475b-b74c-307a0e492622', 1, '344eb4c8-48c4-475b-b74c-307a0e492622', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 18.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:54:16', 'admin-id', '2026-01-18 11:54:40', 1),
('4b019cba-eda8-4ad3-a8ac-ece0e6478ffe', 'admin-id', 'BS-002', 'BS-002', 'BS-002', 'Mineral Water 1L', 'Mineral Water 1L', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, 'c1ab2f8e-5030-40a4-85a3-569ad7cc6dd7', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 10.00, 14.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:21:19', 'admin-id', '2026-01-18 12:21:38', 1),
('4b100c2e-68a6-467b-94b7-617a6c7b43dc', 'admin-id', 'HE-004', 'HE-004', 'HE-004', 'Toilet Cleaner', 'Toilet Cleaner', '344eb4c8-48c4-475b-b74c-307a0e492622', 6, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 0, 7.50, 20.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:09:36', 'admin-id', '2026-01-18 12:10:02', 1),
('4dab149a-e220-4cd8-a061-7660ab0168bb', 'admin-id', 'RG-002', 'RG-002', 'RG-002', 'Nazirshail Rice', 'Nazirshail Rice', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 0, 5.00, 14.00, NULL, 1, 1, 'admin-id', '2026-01-12 06:20:57', 'admin-id', '2026-01-18 11:47:21', 1),
('75b05c78-9b6b-42ba-aafa-e76e22f67722', 'admin-id', 'HE-001', 'HE-001', 'HE-001', 'Laundry Soap', 'Laundry Soap', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 0, 7.50, 20.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:05:41', 'admin-id', '2026-01-18 12:05:52', 1),
('8873e069-eea6-4f9e-acf0-dd1cb658f9c8', 'admin-id', 'BS-001', 'BS-001', 'BS-001', 'Soft Drink 250ml', 'Soft Drink 250ml', '344eb4c8-48c4-475b-b74c-307a0e492622', 24, 'f5d78785-c08b-46b7-a77f-dcf1a8700dd0', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 10.00, 15.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:20:20', 'admin-id', '2026-01-18 12:20:40', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ec2', 'admin-id', 'RG-001', 'RG-001', 'RG-001', 'Miniket Rice', 'Miniket Rice', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 0, 5.00, 15.00, NULL, 1, 1, '940f8010-5d38-4de4-b66f-d12958ff9ecf', '2026-01-11 06:06:23', 'admin-id', '2026-01-18 11:46:22', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ecf', 'admin-id', 'EP-003', 'EP-003', 'EP-003', 'Layer Egg (Dozen)', 'Layer Egg (Dozen)', '61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 30, 'f5d78785-c08b-46b7-a77f-dcf1a8700dd0', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 0, 5.00, 15.00, NULL, 1, 1, '940f8010-5d38-4de4-b66f-d12958ff9ecf', '2026-01-11 06:06:23', 'admin-id', '2026-01-18 11:41:51', 1),
('ad014a04-77d0-4f46-acc9-dee2b02c64f2', 'admin-id', 'BS-003', 'BS-003', 'BS-003', 'Juice Pack', 'Juice Pack', '344eb4c8-48c4-475b-b74c-307a0e492622', 10, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 10.00, 18.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:22:34', 'admin-id', '2026-01-18 12:22:53', 1),
('ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', 'admin-id', 'EP-001', 'EP-001', 'EP-001', 'Layer Egg', 'Layer Egg', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 0, 5.00, 20.00, NULL, 1, 1, 'admin-id', '2026-01-12 06:17:33', 'admin-id', '2026-01-18 11:38:30', 1),
('b3da1017-bea4-44fd-ad13-110e92a48965', 'admin-id', 'RG-004', 'RG-004', 'RG-004', 'Wheat', 'Wheat', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 0, 5.00, 12.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:49:00', 'admin-id', '2026-01-18 11:49:13', 1),
('dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 'admin-id', 'EP-002', 'EP-002', 'EP-002', 'Duck Egg', 'Duck Egg', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 0, 5.00, 18.00, NULL, 1, 1, 'admin-id', '2026-01-12 06:38:50', 'admin-id', '2026-01-18 11:39:37', 1),
('e2e70dc1-9814-400c-8774-2b6b186b79e5', 'admin-id', 'DP-005', 'DP-005', 'DP-005', 'Cheese Slice', 'Cheese Slice', '344eb4c8-48c4-475b-b74c-307a0e492622', 10, '50d3582c-909a-4818-afd7-54a8db8c1a44', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 18.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:55:20', 'admin-id', '2026-01-18 11:55:39', 1),
('e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', 'admin-id', 'EP-004', 'EP-004', 'EP-004', 'Broiler Chicken', 'Broiler Chicken', 'f13c1fb3-3493-4640-9b13-02bd824b4977', 1000, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 0, 5.00, 12.00, NULL, 1, 1, 'admin-id', '2026-01-11 06:38:46', 'admin-id', '2026-01-18 11:55:58', 1),
('e483bc2d-6ccd-4b72-8603-775dcd275249', 'admin-id', 'EP-005', 'EP-005', 'EP-005', 'Deshi Chicken', 'Deshi Chicken', 'f13c1fb3-3493-4640-9b13-02bd824b4977', 1000, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 0, 5.00, 10.00, NULL, 1, 1, 'admin-id', '2026-01-12 06:12:16', 'admin-id', '2026-01-18 11:44:14', 1),
('f7126510-80c0-416b-a34e-3a514e54d030', 'admin-id', 'BS-005', 'BS-005', 'BS-005', 'Biscuit', 'Biscuit', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '50d3582c-909a-4818-afd7-54a8db8c1a44', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 0, 10.00, 15.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:24:41', 'admin-id', '2026-01-18 12:24:55', 1),
('f949a24a-3ff8-4349-9ca0-f853de9226c7', 'admin-id', 'HE-002', 'HE-002', 'HE-002', 'Dishwashing Liquid', 'Dishwashing Liquid', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 1, '1f240f2c-50ab-407f-b77d-0ce95922fd6c', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 0, 7.50, 18.00, NULL, 1, 1, 'admin-id', '2026-01-18 12:06:48', 'admin-id', '2026-01-18 12:07:47', 1),
('fa1b188a-c075-4b90-bbea-37e3733f50bb', 'admin-id', 'DP-002', 'DP-002', 'DP-002', 'Powder Milk', 'Powder Milk', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 0, 5.00, 18.00, NULL, 1, 1, 'admin-id', '2026-01-18 11:52:20', 'admin-id', '2026-01-18 11:52:30', 1);

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
('024a6dbf-85cb-48d6-91e0-41f4b977bcd4', 'admin-id', 'Ml', 'Volume', 1, 'admin-id', '2026-01-18 12:07:30', 'admin-id', '2026-01-18 12:07:30', 1),
('1f240f2c-50ab-407f-b77d-0ce95922fd6c', 'admin-id', 'Ltr', 'Volume', 1, 'admin-id', '2026-01-11 04:40:38', 'admin-id', '2026-01-18 12:06:59', 1),
('2276a903-fc68-4c43-8448-8ceab9aee99d', 'admin-id', 'Bulk', 'Mass', 1, 'admin-id', '2026-01-12 06:39:04', 'admin-id', '2026-01-14 08:32:20', 1),
('22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'admin-id', 'Kg', 'Weight', 1, 'admin-id', '2026-01-11 04:43:41', 'admin-id', '2026-01-14 08:32:24', 1),
('2993fee8-3e34-4e2e-8cb9-63461934a6ef', 'admin-id', 'Inch', 'Length', 1, 'admin-id', '2026-01-14 08:34:51', 'admin-id', '2026-01-14 08:35:02', 1),
('324249dc-432a-44b8-8191-cb1bfe2ad530', 'admin-id', 'Ton', 'Weight', 1, 'admin-id', '2026-01-14 08:33:44', 'admin-id', '2026-01-14 08:35:06', 1),
('344eb4c8-48c4-475b-b74c-307a0e492622', 'admin-id', 'Pcs', 'Countable', 1, 'admin-id', '2026-01-11 04:40:18', 'admin-id', '2026-01-14 08:32:31', 1),
('50d3582c-909a-4818-afd7-54a8db8c1a44', 'admin-id', 'Pack', 'Countable', 1, 'admin-id', '2026-01-11 04:40:31', 'admin-id', '2026-01-14 08:32:33', 1),
('53640e3f-20b8-44a6-8872-5844630bfed0', 'admin-id', 'Gal', 'Volume', 1, 'admin-id', '2026-01-14 08:34:28', 'admin-id', '2026-01-14 08:35:16', 1),
('61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'admin-id', 'Dzn', 'Countable', 1, 'admin-id', '2026-01-11 04:40:57', 'admin-id', '2026-01-18 12:06:56', 1),
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
  `bking_rcqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_pnqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `bking_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bking_crusr` varchar(50) NOT NULL,
  `bking_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bking_upusr` varchar(50) NOT NULL,
  `bking_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bking_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_cbkng`
--

CREATE TABLE `tmpb_cbkng` (
  `id` varchar(50) NOT NULL,
  `cbkng_mbkng` varchar(50) NOT NULL,
  `cbkng_bitem` varchar(50) NOT NULL,
  `cbkng_items` varchar(50) NOT NULL,
  `cbkng_itrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_itqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_itamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_dspct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_vtpct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_csrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_ntamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_notes` varchar(50) DEFAULT NULL,
  `cbkng_attrb` varchar(300) DEFAULT NULL,
  `cbkng_cnqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_rcqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_pnqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cbkng_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cbkng_crusr` varchar(50) NOT NULL,
  `cbkng_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cbkng_upusr` varchar(50) NOT NULL,
  `cbkng_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cbkng_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_cbkng`
--

INSERT INTO `tmpb_cbkng` (`id`, `cbkng_mbkng`, `cbkng_bitem`, `cbkng_items`, `cbkng_itrat`, `cbkng_itqty`, `cbkng_itamt`, `cbkng_dspct`, `cbkng_dsamt`, `cbkng_vtpct`, `cbkng_vtamt`, `cbkng_csrat`, `cbkng_ntamt`, `cbkng_notes`, `cbkng_attrb`, `cbkng_cnqty`, `cbkng_rcqty`, `cbkng_pnqty`, `cbkng_actve`, `cbkng_crusr`, `cbkng_crdat`, `cbkng_upusr`, `cbkng_updat`, `cbkng_rvnmr`) VALUES
('12738537-69f3-4959-a2a4-c703db2d5e8a', '8e8b248f-8675-4829-b04b-ce3332da77dc', '22bbdf6e-759b-4b46-a0a6-b5d2a8d7d383', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 15.000000, 22.000000, 330.000000, 0.000000, 0.000000, 5.000000, 16.500000, 15.000000, 346.500000, 'test 4', '{\"Color\":\"White\"}', 0.000000, 22.000000, 0.000000, 1, 'admin-id', '2026-01-25 11:56:57', 'admin-id', '2026-01-27 02:14:22', 1),
('32106f62-d77b-471f-a5a2-08c67aa54ced', '4b231906-8a75-4ef2-90cb-1a843589dcf3', '7df55d16-a7c1-4e85-94a2-67f826401fe6', '471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', 15.000000, 150.000000, 2250.000000, 0.000000, 0.000000, 7.500000, 168.750000, 16.125000, 2418.750000, 'DO#687-4545', '{}', 0.000000, 150.000000, 0.000000, 1, 'admin-id', '2026-01-27 01:20:49', 'admin-id', '2026-01-27 02:14:22', 1),
('5fee7518-f11b-41fd-9f57-07a873112ac0', '8e8b248f-8675-4829-b04b-ce3332da77dc', '22064b47-6898-4661-9dc8-5329a542ae4a', '24614ec4-8ab0-4b50-b3c7-9f154a124770', 110.000000, 30.000000, 3300.000000, 0.000000, 0.000000, 5.000000, 165.000000, 110.000000, 3465.000000, 'test 2', '{\"Weight\":\"50 KG\",\"Expiry\":\"2026-01-29\"}', 0.000000, 30.000000, 0.000000, 1, 'admin-id', '2026-01-25 11:56:57', 'admin-id', '2026-01-27 02:14:22', 1),
('d04b83a6-8529-44da-8a46-13d10aa8b869', '8e8b248f-8675-4829-b04b-ce3332da77dc', '0a73b49d-71b3-4671-9c09-6d985f3514fc', '485d61c3-e84e-418b-b91b-2171c17f0391', 260.000000, 20.000000, 5200.000000, 0.000000, 0.000000, 5.000000, 260.000000, 260.000000, 5460.000000, 'test 1', '{\"Color\":\"White\",\"Size\":\"Large\",\"Weight\":\"1kg +/- 10gm\"}', 0.000000, 20.000000, 0.000000, 1, 'admin-id', '2026-01-25 11:56:57', 'admin-id', '2026-01-27 02:14:22', 1),
('dfd7a7c4-8790-4acf-832b-5d0347275136', 'bf585727-e375-4c8c-bff7-7177885ea8aa', '0b9c71ef-77de-4116-8298-ac0898e2d217', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', 10.000000, 20.000000, 200.000000, 0.000000, 0.000000, 5.000000, 10.000000, 10.000000, 210.000000, 'DO#123-123', '{\"Weight\":\"55-75 gm\"}', 0.000000, 20.000000, 0.000000, 1, 'admin-id', '2026-01-26 15:44:26', 'admin-id', '2026-01-27 02:14:22', 1),
('f9b3a318-9e45-4ad3-95b0-377917f40d1c', '565905e9-8274-4dc5-b1c6-61f11e856100', '0a73b49d-71b3-4671-9c09-6d985f3514fc', '485d61c3-e84e-418b-b91b-2171c17f0391', 260.000000, 1.000000, 260.000000, 0.000000, 0.000000, 5.000000, 13.000000, 260.000000, 273.000000, '', '{\"Expiry\":\"2026-01-26\"}', 0.000000, 1.000000, 0.000000, 1, 'admin-id', '2026-01-25 12:08:59', 'admin-id', '2026-01-27 02:14:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_cinvc`
--

CREATE TABLE `tmpb_cinvc` (
  `id` varchar(50) NOT NULL,
  `cinvc_mbkng` varchar(50) NOT NULL,
  `cinvc_bitem` varchar(50) NOT NULL,
  `cinvc_items` varchar(50) NOT NULL,
  `cinvc_itrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_itqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_itamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_dspct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_vtpct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_csrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_ntamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_notes` varchar(50) DEFAULT NULL,
  `cinvc_rtqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_slqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_ohqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cinvc_crusr` varchar(50) NOT NULL,
  `cinvc_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cinvc_upusr` varchar(50) NOT NULL,
  `cinvc_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cinvc_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_crcpt`
--

CREATE TABLE `tmpb_crcpt` (
  `id` varchar(50) NOT NULL,
  `crcpt_mrcpt` varchar(50) NOT NULL,
  `crcpt_bitem` varchar(50) NOT NULL,
  `crcpt_items` varchar(50) NOT NULL,
  `crcpt_itrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_itqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_itamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_dspct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_vtpct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_csrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_ntamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_notes` varchar(50) DEFAULT NULL,
  `crcpt_attrb` varchar(300) DEFAULT NULL,
  `crcpt_rtqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_slqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_ohqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `crcpt_cbkng` varchar(50) NOT NULL,
  `crcpt_actve` tinyint(1) NOT NULL DEFAULT 1,
  `crcpt_crusr` varchar(50) NOT NULL,
  `crcpt_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `crcpt_upusr` varchar(50) NOT NULL,
  `crcpt_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `crcpt_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_crcpt`
--

INSERT INTO `tmpb_crcpt` (`id`, `crcpt_mrcpt`, `crcpt_bitem`, `crcpt_items`, `crcpt_itrat`, `crcpt_itqty`, `crcpt_itamt`, `crcpt_dspct`, `crcpt_dsamt`, `crcpt_vtpct`, `crcpt_vtamt`, `crcpt_csrat`, `crcpt_ntamt`, `crcpt_notes`, `crcpt_attrb`, `crcpt_rtqty`, `crcpt_slqty`, `crcpt_ohqty`, `crcpt_cbkng`, `crcpt_actve`, `crcpt_crusr`, `crcpt_crdat`, `crcpt_upusr`, `crcpt_updat`, `crcpt_rvnmr`) VALUES
('5634c2a8-502b-4d46-a4ae-55d1d572303e', '045a4c5a-76e5-4750-9797-70251f960390', '22064b47-6898-4661-9dc8-5329a542ae4a', '24614ec4-8ab0-4b50-b3c7-9f154a124770', 110.000000, 30.000000, 3300.000000, 0.000000, 0.000000, 5.000000, 165.000000, 110.000000, 3465.000000, 'test 2', NULL, 0.000000, 0.000000, 30.000000, 'd567f15e-1bc5-48fa-aa22-e83075790cf7', 1, 'admin-id', '2026-01-25 11:46:14', 'admin-id', '2026-01-25 11:46:14', 1),
('6b832849-430c-44dc-8e9a-0ff940531196', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', '0b9c71ef-77de-4116-8298-ac0898e2d217', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', 10.000000, 20.000000, 200.000000, 0.000000, 0.000000, 5.000000, 10.000000, 10.000000, 210.000000, 'DO#123-123', '{\"Weight\":\"55-75 gm\"}', 0.000000, 0.000000, 20.000000, 'dfd7a7c4-8790-4acf-832b-5d0347275136', 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('6e988f64-c9d2-45b9-88de-1a51ca3d8dae', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', '22bbdf6e-759b-4b46-a0a6-b5d2a8d7d383', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 15.000000, 22.000000, 330.000000, 0.000000, 0.000000, 5.000000, 16.500000, 15.000000, 346.500000, 'test 4', '{\"Color\":\"White\"}', 0.000000, 0.000000, 22.000000, '12738537-69f3-4959-a2a4-c703db2d5e8a', 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('80d92989-4e75-4809-ba58-0202218968bf', '045a4c5a-76e5-4750-9797-70251f960390', '22bbdf6e-759b-4b46-a0a6-b5d2a8d7d383', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 15.000000, 25.000000, 375.000000, 0.000000, 0.000000, 5.000000, 18.750000, 15.750000, 393.750000, 'test 4', NULL, 0.000000, 0.000000, 25.000000, 'c9810218-4de7-4765-9d73-a978a0382fdd', 1, 'admin-id', '2026-01-25 11:46:14', 'admin-id', '2026-01-25 11:46:14', 1),
('af3d811c-d4e8-4200-9196-0fb8bdc0dfc4', '045a4c5a-76e5-4750-9797-70251f960390', '0a73b49d-71b3-4671-9c09-6d985f3514fc', '485d61c3-e84e-418b-b91b-2171c17f0391', 260.000000, 20.000000, 5200.000000, 0.000000, 0.000000, 5.000000, 260.000000, 260.000000, 5460.000000, 'test 1', NULL, 0.000000, 0.000000, 20.000000, '3d7dae4b-45a5-488c-99d3-5822f35a3e0e', 1, 'admin-id', '2026-01-25 11:46:14', 'admin-id', '2026-01-25 11:46:14', 1),
('cb6e1c75-3085-4704-96ad-7823905a057e', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', '7df55d16-a7c1-4e85-94a2-67f826401fe6', '471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', 15.000000, 150.000000, 2250.000000, 0.000000, 0.000000, 7.500000, 168.750000, 15.000000, 2418.750000, 'DO#687-4545', '{}', 0.000000, 0.000000, 150.000000, '32106f62-d77b-471f-a5a2-08c67aa54ced', 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('d1c8dd50-b080-4ac3-898b-9b92fbfd7da4', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', '0a73b49d-71b3-4671-9c09-6d985f3514fc', '485d61c3-e84e-418b-b91b-2171c17f0391', 260.000000, 1.000000, 260.000000, 0.000000, 0.000000, 5.000000, 13.000000, 260.000000, 273.000000, '', '{\"Expiry\":\"2026-01-26\"}', 0.000000, 0.000000, 1.000000, 'f9b3a318-9e45-4ad3-95b0-377917f40d1c', 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('e4fc2e0f-1c93-41ad-89af-4b6986259c38', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', '0a73b49d-71b3-4671-9c09-6d985f3514fc', '485d61c3-e84e-418b-b91b-2171c17f0391', 260.000000, 20.000000, 5200.000000, 0.000000, 0.000000, 5.000000, 260.000000, 260.000000, 5460.000000, 'test 1', '{\"Color\":\"White\",\"Size\":\"Large\",\"Weight\":\"1kg +/- 10gm\"}', 0.000000, 0.000000, 20.000000, 'd04b83a6-8529-44da-8a46-13d10aa8b869', 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('f139e7fa-3daa-44a7-898f-931d8bc1c581', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', '22064b47-6898-4661-9dc8-5329a542ae4a', '24614ec4-8ab0-4b50-b3c7-9f154a124770', 110.000000, 30.000000, 3300.000000, 0.000000, 0.000000, 5.000000, 165.000000, 110.000000, 3465.000000, 'test 2', '{\"Weight\":\"50 KG\",\"Expiry\":\"2026-01-29\"}', 0.000000, 0.000000, 30.000000, '5fee7518-f11b-41fd-9f57-07a873112ac0', 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_expns`
--

CREATE TABLE `tmpb_expns` (
  `id` varchar(50) NOT NULL,
  `expns_users` varchar(50) NOT NULL,
  `expns_bsins` varchar(50) NOT NULL,
  `expns_cntct` varchar(50) NOT NULL,
  `expns_refid` varchar(50) NOT NULL,
  `expns_refno` varchar(50) NOT NULL,
  `expns_srcnm` varchar(50) NOT NULL,
  `expns_inexc` tinyint(1) NOT NULL DEFAULT 1,
  `expns_notes` varchar(100) DEFAULT NULL,
  `expns_xpamt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `expns_actve` tinyint(1) NOT NULL DEFAULT 1,
  `expns_crusr` varchar(50) NOT NULL,
  `expns_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `expns_upusr` varchar(50) NOT NULL,
  `expns_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expns_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_expns`
--

INSERT INTO `tmpb_expns` (`id`, `expns_users`, `expns_bsins`, `expns_cntct`, `expns_refid`, `expns_refno`, `expns_srcnm`, `expns_inexc`, `expns_notes`, `expns_xpamt`, `expns_actve`, `expns_crusr`, `expns_crdat`, `expns_upusr`, `expns_updat`, `expns_rvnmr`) VALUES
('2cda2bfa-2038-4d1a-87ca-3e88f2a7ecd1', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', '4b231906-8a75-4ef2-90cb-1a843589dcf3', 'PB-270126-00001', 'Purchase Booking', 1, '', 100.000000, 1, 'admin-id', '2026-01-27 01:20:49', 'admin-id', '2026-01-27 01:20:49', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_mbkng`
--

CREATE TABLE `tmpb_mbkng` (
  `id` varchar(50) NOT NULL,
  `mbkng_users` varchar(50) NOT NULL,
  `mbkng_bsins` varchar(50) NOT NULL,
  `mbkng_cntct` varchar(50) NOT NULL,
  `mbkng_trnno` varchar(50) NOT NULL,
  `mbkng_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mbkng_refno` varchar(50) DEFAULT NULL,
  `mbkng_trnte` varchar(100) DEFAULT NULL,
  `mbkng_odamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_vatpy` tinyint(1) NOT NULL DEFAULT 0,
  `mbkng_incst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_excst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_rnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_ttamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_pyamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_pdamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_duamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_cnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mbkng_ispad` tinyint(1) NOT NULL DEFAULT 0,
  `mbkng_ispst` tinyint(1) NOT NULL DEFAULT 0,
  `mbkng_iscls` tinyint(1) NOT NULL DEFAULT 0,
  `mbkng_vatcl` tinyint(1) NOT NULL DEFAULT 0,
  `mbkng_hscnl` tinyint(1) NOT NULL DEFAULT 0,
  `mbkng_actve` tinyint(1) NOT NULL DEFAULT 1,
  `mbkng_crusr` varchar(50) NOT NULL,
  `mbkng_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mbkng_upusr` varchar(50) NOT NULL,
  `mbkng_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mbkng_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_mbkng`
--

INSERT INTO `tmpb_mbkng` (`id`, `mbkng_users`, `mbkng_bsins`, `mbkng_cntct`, `mbkng_trnno`, `mbkng_trdat`, `mbkng_refno`, `mbkng_trnte`, `mbkng_odamt`, `mbkng_dsamt`, `mbkng_vtamt`, `mbkng_vatpy`, `mbkng_incst`, `mbkng_excst`, `mbkng_rnamt`, `mbkng_ttamt`, `mbkng_pyamt`, `mbkng_pdamt`, `mbkng_duamt`, `mbkng_cnamt`, `mbkng_ispad`, `mbkng_ispst`, `mbkng_iscls`, `mbkng_vatcl`, `mbkng_hscnl`, `mbkng_actve`, `mbkng_crusr`, `mbkng_crdat`, `mbkng_upusr`, `mbkng_updat`, `mbkng_rvnmr`) VALUES
('4b231906-8a75-4ef2-90cb-1a843589dcf3', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PB-270126-00001', '2026-01-27 00:00:00', 'DO#687-4545', '', 2250.000000, 0.000000, 168.750000, 1, 100.000000, 0.000000, 0.000000, 2518.750000, 2518.750000, 2500.000000, 19.000000, 0.000000, 2, 1, 0, 0, 0, 1, 'admin-id', '2026-01-27 01:20:49', 'admin-id', '2026-01-27 01:20:49', 1),
('565905e9-8274-4dc5-b1c6-61f11e856100', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PB-250126-00002', '2026-01-25 00:00:00', '', '', 260.000000, 0.000000, 13.000000, 0, 0.000000, 0.000000, 0.000000, 273.000000, 260.000000, 260.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'admin-id', '2026-01-25 12:08:59', 'admin-id', '2026-01-26 15:45:57', 1),
('8e8b248f-8675-4829-b04b-ce3332da77dc', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PB-250126-00001', '2026-01-25 00:00:00', '', 'the product is not having group', 8830.000000, 0.000000, 441.500000, 1, 0.000000, 0.000000, 0.000000, 9271.500000, 9271.500000, 17044.000000, -7772.500000, 0.000000, 2, 1, 0, 0, 0, 1, 'admin-id', '2026-01-25 10:04:00', 'admin-id', '2026-01-26 15:46:02', 89),
('bf585727-e375-4c8c-bff7-7177885ea8aa', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PB-260126-00001', '2026-01-26 00:00:00', 'DO#123-123', '', 200.000000, 0.000000, 10.000000, 1, 0.000000, 0.000000, 0.000000, 210.000000, 210.000000, 210.000000, 0.000000, 0.000000, 1, 0, 0, 0, 0, 1, 'admin-id', '2026-01-26 14:52:50', 'admin-id', '2026-01-26 15:46:05', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_minvc`
--

CREATE TABLE `tmpb_minvc` (
  `id` varchar(50) NOT NULL,
  `minvc_users` varchar(50) NOT NULL,
  `minvc_bsins` varchar(50) NOT NULL,
  `minvc_cntct` varchar(50) NOT NULL,
  `minvc_trnno` varchar(50) NOT NULL,
  `minvc_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `minvc_refno` varchar(50) DEFAULT NULL,
  `minvc_trnte` varchar(100) DEFAULT NULL,
  `minvc_odamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_vatpy` tinyint(1) NOT NULL DEFAULT 0,
  `minvc_incst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_excst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_rnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_ttamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_pyamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_pdamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_duamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_rtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `minvc_ispad` tinyint(1) NOT NULL DEFAULT 0,
  `minvc_ispst` tinyint(1) NOT NULL DEFAULT 0,
  `minvc_iscls` tinyint(1) NOT NULL DEFAULT 0,
  `minvc_vatcl` tinyint(1) NOT NULL DEFAULT 0,
  `minvc_hscnl` tinyint(1) NOT NULL DEFAULT 0,
  `minvc_actve` tinyint(1) NOT NULL DEFAULT 1,
  `minvc_crusr` varchar(50) NOT NULL,
  `minvc_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `minvc_upusr` varchar(50) NOT NULL,
  `minvc_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `minvc_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_mrcpt`
--

CREATE TABLE `tmpb_mrcpt` (
  `id` varchar(50) NOT NULL,
  `mrcpt_users` varchar(50) NOT NULL,
  `mrcpt_bsins` varchar(50) NOT NULL,
  `mrcpt_cntct` varchar(50) NOT NULL,
  `mrcpt_trnno` varchar(50) NOT NULL,
  `mrcpt_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mrcpt_refno` varchar(50) DEFAULT NULL,
  `mrcpt_trnte` varchar(100) DEFAULT NULL,
  `mrcpt_odamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_vatpy` tinyint(1) NOT NULL DEFAULT 0,
  `mrcpt_incst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_excst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_rnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_ttamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_pyamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_pdamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_duamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_rtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mrcpt_ispad` tinyint(1) NOT NULL DEFAULT 0,
  `mrcpt_ispst` tinyint(1) NOT NULL DEFAULT 0,
  `mrcpt_iscls` tinyint(1) NOT NULL DEFAULT 0,
  `mrcpt_vatcl` tinyint(1) NOT NULL DEFAULT 0,
  `mrcpt_hscnl` tinyint(1) NOT NULL DEFAULT 0,
  `mrcpt_actve` tinyint(1) NOT NULL DEFAULT 1,
  `mrcpt_crusr` varchar(50) NOT NULL,
  `mrcpt_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mrcpt_upusr` varchar(50) NOT NULL,
  `mrcpt_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mrcpt_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmpb_mrcpt`
--

INSERT INTO `tmpb_mrcpt` (`id`, `mrcpt_users`, `mrcpt_bsins`, `mrcpt_cntct`, `mrcpt_trnno`, `mrcpt_trdat`, `mrcpt_refno`, `mrcpt_trnte`, `mrcpt_odamt`, `mrcpt_dsamt`, `mrcpt_vtamt`, `mrcpt_vatpy`, `mrcpt_incst`, `mrcpt_excst`, `mrcpt_rnamt`, `mrcpt_ttamt`, `mrcpt_pyamt`, `mrcpt_pdamt`, `mrcpt_duamt`, `mrcpt_rtamt`, `mrcpt_ispad`, `mrcpt_ispst`, `mrcpt_iscls`, `mrcpt_vatcl`, `mrcpt_hscnl`, `mrcpt_actve`, `mrcpt_crusr`, `mrcpt_crdat`, `mrcpt_upusr`, `mrcpt_updat`, `mrcpt_rvnmr`) VALUES
('045a4c5a-76e5-4750-9797-70251f960390', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PR-250126-00001', '2026-01-25 00:00:00', 'OC#987-755', '', 8875.000000, 0.000000, 443.750000, 0, 0.000000, 0.000000, 0.000000, 9318.750000, 8875.000000, 0.000000, 8875.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'admin-id', '2026-01-25 11:46:14', 'admin-id', '2026-01-25 11:46:14', 1),
('c0d2124e-1371-4f57-89fa-889d2dcf560a', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PR-270126-00001', '2026-01-27 00:00:00', '', '', 11540.000000, 0.000000, 633.250000, 1, 0.000000, 0.000000, 0.000000, 12173.250000, 12173.250000, 0.000000, 12173.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1);

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
('27da0768-f364-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-15', 'tmsb_crgrn', 'Grains', NULL, 6.000000, 0.000000, '2026-01-15 00:00:00', '2026-01-15 00:00:00', 1, 'sys', '2026-01-17 05:19:06', 'sys', '2026-01-17 05:19:06', 1),
('27da0793-f364-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-15', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-15 00:00:00', '2026-01-15 00:00:00', 1, 'sys', '2026-01-17 05:19:06', 'sys', '2026-01-17 05:19:06', 1),
('45e5c6c7-0331-4e97-b304-15b03ee3d0c7', 'admin-id', '2026-01-09', 'tmsb_crgrn', 'Registration', 'Grocery Shop', 0.000000, 1000.000000, '2026-01-09 00:00:00', '2026-01-09 04:48:25', 1, '45e5c6c7-0331-4e97-b304-15b03ee3d0c7', '2026-01-12 04:48:25', '45e5c6c7-0331-4e97-b304-15b03ee3d0c7', '2026-01-13 05:13:33', 1),
('5b8a0446-f11e-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-13', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-13 00:00:00', '2026-01-13 00:00:00', 1, 'sys', '2026-01-14 07:55:13', 'sys', '2026-01-14 07:55:13', 1),
('5b8ac4be-f11e-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-13', 'tmsb_crgrn', 'Grains', NULL, 16.000000, 0.000000, '2026-01-13 00:00:00', '2026-01-13 00:00:00', 1, 'sys', '2026-01-14 07:55:13', 'sys', '2026-01-14 07:55:13', 1),
('c65563b6-f5b7-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-19', 'tmab_bsins', 'Business', NULL, 3.000000, 0.000000, '2026-01-19 00:00:00', '2026-01-19 00:00:00', 1, 'sys', '2026-01-20 04:21:59', 'sys', '2026-01-20 04:21:59', 1),
('c65708f8-f5b7-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-19', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-19 00:00:00', '2026-01-19 00:00:00', 1, 'sys', '2026-01-20 04:21:59', 'sys', '2026-01-20 04:21:59', 1),
('c65724e8-f5b7-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-19', 'tmsb_crgrn', 'Grains', NULL, 8.000000, 0.000000, '2026-01-19 00:00:00', '2026-01-19 00:00:00', 1, 'sys', '2026-01-20 04:21:59', 'sys', '2026-01-20 04:21:59', 1),
('ca2657e7-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-09', 'tmcb_cntct', 'Contact', NULL, 1.000000, 0.000000, '2026-01-09 00:00:00', '2026-01-09 00:00:00', 1, 'sys', '2026-01-13 05:14:17', 'sys', '2026-01-13 05:14:17', 1),
('d4fa1225-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-10', 'tmtb_ledgr', 'Accounts Ledger', NULL, 6.000000, 0.000000, '2026-01-10 00:00:00', '2026-01-10 00:00:00', 1, 'sys', '2026-01-13 05:14:35', 'sys', '2026-01-13 05:14:35', 1),
('d502d99e-f03e-11f0-97f9-0ad4a79b5a97', 'admin-id', '2026-01-10', 'tmtb_trhed', 'Accounts Heads', NULL, 35.000000, 0.000000, '2026-01-10 00:00:00', '2026-01-10 00:00:00', 1, 'sys', '2026-01-13 05:14:35', 'sys', '2026-01-13 05:14:35', 1),
('d887fdff-f429-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-17', 'tmab_bsins', 'Business', NULL, 2.000000, 0.000000, '2026-01-17 00:00:00', '2026-01-17 00:00:00', 1, 'sys', '2026-01-18 04:53:57', 'sys', '2026-01-18 04:53:57', 1),
('d888f57d-f429-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-17', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-17 00:00:00', '2026-01-17 00:00:00', 1, 'sys', '2026-01-18 04:53:57', 'sys', '2026-01-18 04:53:57', 1),
('d88919bd-f429-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-17', 'tmib_bitem', 'Business Item', NULL, 7.000000, 0.000000, '2026-01-17 00:00:00', '2026-01-17 00:00:00', 1, 'sys', '2026-01-18 04:53:57', 'sys', '2026-01-18 04:53:57', 1),
('d8898306-f429-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-17', 'tmsb_crgrn', 'Grains', NULL, 2.000000, 0.000000, '2026-01-17 00:00:00', '2026-01-17 00:00:00', 1, 'sys', '2026-01-18 04:53:57', 'sys', '2026-01-18 04:53:57', 1),
('d8926771-f429-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-17', 'tmtb_bacts', 'Business Accounts', NULL, 2.000000, 0.000000, '2026-01-17 00:00:00', '2026-01-17 00:00:00', 1, 'sys', '2026-01-18 04:53:57', 'sys', '2026-01-18 04:53:57', 1),
('d8926bf3-f429-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-17', 'tmtb_ledgr', 'Accounts Ledger', NULL, 2.000000, 0.000000, '2026-01-17 00:00:00', '2026-01-17 00:00:00', 1, 'sys', '2026-01-18 04:53:57', 'sys', '2026-01-18 04:53:57', 1),
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
('e79f0d65-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmab_users', 'User', NULL, 1.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e79f0dca-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmab_bsins', 'Business', NULL, 4.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e7a8227e-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmib_bitem', 'Business Item', NULL, 25.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e7a822e3-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmcb_cntct', 'Contact', NULL, 10.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e7a8242f-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmib_ctgry', 'Item Category', NULL, 6.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e7a8457a-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmib_items', 'Item List', NULL, 25.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e7a8ab83-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmsb_crgrn', 'Grains', NULL, 6.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
('e7a8aba0-f4ec-11f0-9a2b-d286b84ab6e7', 'admin-id', '2026-01-18', 'tmib_iuofm', 'Item Unit', NULL, 3.000000, 0.000000, '2026-01-18 00:00:00', '2026-01-18 00:00:00', 1, 'sys', '2026-01-19 04:10:00', 'sys', '2026-01-19 04:10:00', 1),
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
('14bc4749-859b-46aa-aa67-29b926f88083', 'admin-id', 'Brac Bank PLC', 'Gulshan 2', '123456', 'Sand Grain Digital', '15000003454545', 'Deposit account', '2026-01-09 00:00:00', 5000.000000, 0, 0, 'admin-id', '2026-01-09 17:37:49', 'admin-id', '2026-01-17 06:40:27', 3),
('c306af10-f4c2-4ee8-8593-85de14c35b76', 'admin-id', 'Cash Account', 'Cash Account', '0', 'Cash Account', '123456', 'Cash Account', '2026-01-09 00:00:00', 23465.000000, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:06:49', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-17 06:43:49', 1);

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
('3ddc69c4-c35d-4131-bf89-6af78de59c4f', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z701', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-17 00:00:00', '#Cash Excess', '', 0.000000, 365.000000, 'admin-id', '2026-01-17 06:39:45', 'admin-id', '2026-01-17 06:39:45', 1),
('57635f84-7cae-4a10-8927-cd34447800de', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z904', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'nov', '', 500.000000, 0.000000, 'admin-id', '2026-01-10 08:19:11', 'admin-id', '2026-01-10 08:19:11', 1),
('5bb72d2a-7ef7-42c3-a12d-17ea7e874344', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z702', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'cash investment', '', 0.000000, 25000.000000, 'admin-id', '2026-01-10 08:16:12', 'admin-id', '2026-01-10 08:16:12', 1),
('665b8fac-564b-470a-a922-4c484bfe1474', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z602', 'internal', '14bc4749-859b-46aa-aa67-29b926f88083', 'Bank', '2026-01-10 00:00:00', 'transfer', '', 0.000000, 5000.000000, 'admin-id', '2026-01-10 08:16:47', 'admin-id', '2026-01-10 08:16:47', 1),
('6bf954fd-fea2-4898-9821-48874ac98e4d', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z903', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'MFS', '2026-01-10 00:00:00', 'nov', '', 500.000000, 0.000000, 'admin-id', '2026-01-10 08:18:22', 'admin-id', '2026-01-10 08:18:22', 1),
('8cddba78-957f-4745-b9fd-e5d2381222f0', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z1002', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-17 00:00:00', 'scap sales', '', 0.000000, 5600.000000, 'admin-id', '2026-01-17 06:43:49', 'admin-id', '2026-01-17 06:43:49', 1),
('efaade64-7c50-4fe7-b1d3-f033622e800d', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z601', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Bank', '2026-01-10 00:00:00', 'transfer', '', 5000.000000, 0.000000, 'admin-id', '2026-01-10 08:16:47', 'admin-id', '2026-01-10 08:16:47', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmtb_paybl`
--

CREATE TABLE `tmtb_paybl` (
  `id` varchar(50) NOT NULL,
  `paybl_users` varchar(50) NOT NULL,
  `paybl_bsins` varchar(50) NOT NULL,
  `paybl_cntct` varchar(50) NOT NULL,
  `paybl_pymod` varchar(50) NOT NULL,
  `paybl_refid` varchar(50) NOT NULL,
  `paybl_refno` varchar(50) NOT NULL,
  `paybl_srcnm` varchar(50) NOT NULL,
  `paybl_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `paybl_descr` varchar(100) DEFAULT NULL,
  `paybl_notes` varchar(50) NOT NULL,
  `paybl_dbamt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `paybl_cramt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `paybl_crusr` varchar(50) NOT NULL,
  `paybl_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `paybl_upusr` varchar(50) NOT NULL,
  `paybl_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `paybl_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmtb_paybl`
--

INSERT INTO `tmtb_paybl` (`id`, `paybl_users`, `paybl_bsins`, `paybl_cntct`, `paybl_pymod`, `paybl_refid`, `paybl_refno`, `paybl_srcnm`, `paybl_trdat`, `paybl_descr`, `paybl_notes`, `paybl_dbamt`, `paybl_cramt`, `paybl_crusr`, `paybl_crdat`, `paybl_upusr`, `paybl_updat`, `paybl_rvnmr`) VALUES
('015491f6-aa2a-4419-acee-f0b97be9c9c1', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', 'PR-270126-00001', 'Purchase Receipt', '2026-01-27 00:00:00', 'Supplier Goods', 'Products', 0.000000, 12173.250000, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('022d73b4-0a55-4029-b836-f371a4651c26', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '565905e9-8274-4dc5-b1c6-61f11e856100', 'PB-250126-00002', 'Purchase Booking', '2026-01-26 00:00:00', '', 'Payment', 260.000000, 0.000000, 'admin-id', '2026-01-26 15:45:57', 'admin-id', '2026-01-26 15:45:57', 1),
('231dc955-bbf7-4eb0-b728-b6edae667926', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '8e8b248f-8675-4829-b04b-ce3332da77dc', 'PB-250126-00001', 'Purchase Booking', '2026-01-25 00:00:00', 'Supplier Goods', 'Products', 0.000000, 9271.500000, 'admin-id', '2026-01-25 11:56:57', 'admin-id', '2026-01-25 11:56:57', 1),
('2c9fd411-c281-478b-b1ee-65e4cbc25ac4', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', 'bf585727-e375-4c8c-bff7-7177885ea8aa', 'PB-260126-00001', 'Purchase Booking', '2026-01-26 00:00:00', '', 'Payment', 210.000000, 0.000000, 'admin-id', '2026-01-26 15:46:05', 'admin-id', '2026-01-26 15:46:05', 1),
('37fc974c-e7e6-4ab9-b76c-cc931e793728', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '8e8b248f-8675-4829-b04b-ce3332da77dc', 'PB-250126-00001', 'Purchase Booking', '2026-01-26 00:00:00', '', 'Payment', 7772.000000, 0.000000, 'admin-id', '2026-01-26 15:44:38', 'admin-id', '2026-01-26 15:44:38', 1),
('3c66151a-92d6-49bf-8fe4-527bc78cffc6', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '8e8b248f-8675-4829-b04b-ce3332da77dc', 'PB-250126-00001', 'Purchase Booking', '2026-01-25 00:00:00', '', 'Payment', 1500.000000, 0.000000, 'admin-id', '2026-01-25 11:56:57', 'admin-id', '2026-01-25 11:56:57', 1),
('42e0bc9e-a89d-4cf1-89bf-bcd8316f1646', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '565905e9-8274-4dc5-b1c6-61f11e856100', 'PB-250126-00002', 'Purchase Booking', '2026-01-25 00:00:00', 'Supplier Goods', 'Products', 0.000000, 260.000000, 'admin-id', '2026-01-25 12:08:59', 'admin-id', '2026-01-25 12:08:59', 1),
('517234f7-40e8-4f2b-a304-1e2742961262', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', 'bf585727-e375-4c8c-bff7-7177885ea8aa', 'PB-260126-00001', 'Purchase Booking', '2026-01-26 00:00:00', 'Supplier Goods', 'Products', 0.000000, 210.000000, 'admin-id', '2026-01-26 15:44:26', 'admin-id', '2026-01-26 15:44:26', 1),
('863a67ff-c192-419c-92e7-866aca3bd160', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '4b231906-8a75-4ef2-90cb-1a843589dcf3', 'PB-270126-00001', 'Purchase Booking', '2026-01-27 00:00:00', '', 'Payment', 2500.000000, 0.000000, 'admin-id', '2026-01-27 01:20:49', 'admin-id', '2026-01-27 01:20:49', 1),
('9e488a0c-c2e9-4ff0-adeb-23a56566c083', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Payment', 'c0d2124e-1371-4f57-89fa-889d2dcf560a', 'PR-270126-00001', 'Purchase Receipt', '2026-01-27 00:00:00', 'Supplier Payment', 'Payment', 12173.250000, 0.000000, 'admin-id', '2026-01-27 02:14:22', 'admin-id', '2026-01-27 02:14:22', 1),
('bb27178e-ec15-4c03-a1f0-f0385c2c08c8', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Payment', '045a4c5a-76e5-4750-9797-70251f960390', 'PR-250126-00001', 'Purchase Receipt', '2026-01-25 00:00:00', 'Supplier Payment', 'Payment', 8875.000000, 0.000000, 'admin-id', '2026-01-25 11:46:14', 'admin-id', '2026-01-25 11:46:14', 1),
('c19fcc23-80cd-4ed9-adb9-31f71f43a5a9', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '4b231906-8a75-4ef2-90cb-1a843589dcf3', 'PB-270126-00001', 'Purchase Booking', '2026-01-27 00:00:00', 'Supplier Goods', 'Products', 0.000000, 2518.750000, 'admin-id', '2026-01-27 01:20:49', 'admin-id', '2026-01-27 01:20:49', 1),
('d8c470fc-e22e-4769-99e9-ded79378e79c', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '045a4c5a-76e5-4750-9797-70251f960390', 'PR-250126-00001', 'Purchase Receipt', '2026-01-25 00:00:00', 'Supplier Goods', 'Products', 0.000000, 8875.000000, 'admin-id', '2026-01-25 11:46:14', 'admin-id', '2026-01-25 11:46:14', 1),
('e73d8cc3-d52c-4c2f-a3d7-90bb719f3214', 'admin-id', '3881b053-9509-49db-835a-3f8dd8976cda', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '8e8b248f-8675-4829-b04b-ce3332da77dc', 'PB-250126-00001', 'Purchase Booking', '2026-01-26 00:00:00', '', 'Payment', 7772.000000, 0.000000, 'admin-id', '2026-01-26 15:46:02', 'admin-id', '2026-01-26 15:46:02', 1);

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

-- --------------------------------------------------------

--
-- Table structure for table `tmub_tickt`
--

CREATE TABLE `tmub_tickt` (
  `id` varchar(50) NOT NULL,
  `tickt_users` varchar(50) NOT NULL,
  `tickt_types` varchar(50) NOT NULL,
  `tickt_cmnte` varchar(300) NOT NULL,
  `tickt_cmdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tickt_rsnte` varchar(300) DEFAULT NULL,
  `tickt_rspnt` int(11) NOT NULL DEFAULT 0,
  `tickt_cmsts` varchar(50) DEFAULT 'Opened',
  `tickt_rsdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tickt_actve` tinyint(1) NOT NULL DEFAULT 1,
  `tickt_crusr` varchar(50) NOT NULL,
  `tickt_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tickt_upusr` varchar(50) NOT NULL,
  `tickt_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tickt_rvnmr` int(11) NOT NULL DEFAULT 1
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
-- Indexes for table `tmcb_cntct`
--
ALTER TABLE `tmcb_cntct`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmcb_dzone`
--
ALTER TABLE `tmcb_dzone`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmcb_rutes`
--
ALTER TABLE `tmcb_rutes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmcb_tarea`
--
ALTER TABLE `tmcb_tarea`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmib_attrb`
--
ALTER TABLE `tmib_attrb`
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
-- Indexes for table `tmpb_cbkng`
--
ALTER TABLE `tmpb_cbkng`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_cinvc`
--
ALTER TABLE `tmpb_cinvc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_crcpt`
--
ALTER TABLE `tmpb_crcpt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_expns`
--
ALTER TABLE `tmpb_expns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_mbkng`
--
ALTER TABLE `tmpb_mbkng`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_minvc`
--
ALTER TABLE `tmpb_minvc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmpb_mrcpt`
--
ALTER TABLE `tmpb_mrcpt`
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
-- Indexes for table `tmtb_paybl`
--
ALTER TABLE `tmtb_paybl`
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

--
-- Indexes for table `tmub_tickt`
--
ALTER TABLE `tmub_tickt`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
