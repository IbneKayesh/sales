-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Feb 23, 2026 at 06:20 AM
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
('08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'user1', 'business1', 'Supplier', 'Local', 'Bengal Fresh Foods', 'Nusrat Jahan', '01822-000002', 'email@sgd.com', 'TIN-123456', 'TRADE-123456', 'Chittagong Wholesale Market', 'Chittagong Wholesale Market', 'sirajganj-sadar', 'sirajganj', 'Bangladesh', '0', 10.000000, 20000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-14 09:17:52', 'user1', '2026-01-31 10:14:56', 6),
('11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'user1', 'business1', 'Customer', 'Local', 'Al Noor Store', 'Javed Hasan', '01623-100104', 'email@sgd.com', 'TIN-123456', 'TRADE-123456', 'Sylhet Zindabazar', 'Sylhet Zindabazar', 'bogra-sadar', 'bogra', 'Bangladesh', '0', 10.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:24:23', 'user1', '2026-02-05 09:58:53', 5),
('267bb3aa-9177-43d2-8d8b-e0137578cf98', 'user1', 'business1', 'Supplier', 'Local', 'Dhaka Agro Traders', 'Md. Kamal Hossain', '01711-000001', 'email@email.com', '', '', 'Kawran Bazar, Dhaka', 'Kawran Bazar, Dhaka', 'araihazar', 'narayanganj', 'Bangladesh', '0', 0.000000, 20000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 12:02:10', 'user1', '2026-01-31 10:14:56', 4),
('41981c62-d7fc-4238-a8f1-8c70bd2c1e0e', 'user1', 'business1', 'Customer', 'Local', 'Bismillah Traders', 'Hafiz Uddin', '01921-100103', '', 'TIN-123-123', 'TRADE-123-123', 'Cumilla Sadar', 'Cumilla Sadar', 'araihazar', 'narayanganj', 'Bangladesh', '0', 0.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:24:02', 'user1', '2026-02-05 09:59:08', 4),
('521e18fc-b57a-48c4-a0a7-d7772edb4b76', 'user1', 'business1', 'Customer', 'Local', 'M/S Amin Enterprise', 'Aminul Islam', '01534-100105', '', '', '', 'Khulna Boyra', 'Khulna Boyra', 'kachpur', 'narayanganj', 'Bangladesh', '0', 10.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:24:45', 'user1', '2026-02-05 09:59:20', 3),
('639611f4-97e5-4589-904e-190ef11f7f4e', 'user1', 'business1', 'Supplier', 'Local', 'Jisan Dairy Source', 'Akhi Khatun', '01555-000005', '', '', '', 'Mirpur-10, Dhaka', 'Mirpur-10, Dhaka', 'enayetpur', 'sirajganj', 'Bangladesh', '0', 0.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:10:29', 'user1', '2026-01-31 10:14:56', 2),
('6a0619ca-84e9-4df5-b225-7dd7acb91b86', 'user1', 'business1', 'Supplier', 'Local', 'Green Farm Ltd.', 'Abdul Karim', '01933-000003', '', '', '', 'Bogura Sadar, Bogura', 'Bogura Sadar, Bogura', 'bogra-sadar', 'bogra', 'Bangladesh', '0', 10.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:09:12', 'user1', '2026-01-31 10:14:56', 2),
('be93309a-ec2b-40d0-9c62-8abe7796b547', 'user1', 'business1', 'Supplier', 'Local', 'Golden Grain Supply', 'Rashed Mahmud', '01644-000004', '', '', '', 'Jashore Industrial Area', 'Jashore Industrial Area', 'kamarkhanda', 'sirajganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:09:47', 'user1', '2026-01-31 10:14:56', 2),
('both', 'user1', 'business1', 'Both', 'Local', 'Both A/C', 'Both A/C', 'Both A/C', 'Both A/C', '', '', 'Both A/C', 'Both A/C', 'sherpur', 'bogra', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 13:04:25', 'user1', '2026-01-31 10:14:56', 3),
('c370a9f5-7ccf-4e2d-9d7a-7d5873293ddc', 'user1', 'business1', 'Customer', 'Local', 'Shapno Mini Mart', 'Farzana Islam', '01819-100102', 'email@sgd.com', '', '', 'Uttara Sector 7, Dhaka', 'Uttara Sector 7, Dhaka', 'belkuchi', 'sirajganj', 'Bangladesh', '0', 5.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-14 09:23:59', 'user1', '2026-02-05 09:59:30', 4),
('d5eefaf0-9979-4edf-8fbd-68f3157c4105', 'user1', 'business1', 'Customer', 'Local', 'Rahman General Store', 'Anisur Rahman', '01712-100101', 'email@email.com', '', '', 'Mohammadpur, Dhaka', 'Mohammadpur, Dhaka', 'adamdighi', 'bogra', 'Bangladesh', '0', 0.000000, 50000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 12:02:29', 'user1', '2026-01-31 10:14:56', 4),
('internal', 'user1', 'business1', 'Internal', 'Local', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', '', '', 'Internal A/C', 'Internal A/C', 'sherpur', 'bogra', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 13:04:25', 'user1', '2026-01-31 10:14:56', 3),
('outlet1', 'user1', 'business1', 'Outlet', 'Local', 'Maa Enterprise', '', '', '', '', '', '', '', 'badda', 'dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-02-18 05:54:24', 'user1', '2026-02-18 05:55:17', 1),
('outlet2', 'user1', 'business1', 'Outlet', 'Local', 'Bhai Bhai Store', '', '', '', '', '', '', '', 'badda', 'dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-02-18 08:07:44', 'user1', '2026-02-18 08:07:58', 1),
('outlet3', 'user1', 'business1', 'Outlet', 'Local', 'Din Confectionary', '', '', '', '', '', '', '', 'badda', 'dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-02-18 08:07:44', 'user1', '2026-02-18 08:07:58', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_cntrt`
--

CREATE TABLE `tmcb_cntrt` (
  `id` varchar(50) NOT NULL,
  `cnrut_users` varchar(50) NOT NULL,
  `cnrut_bsins` varchar(50) NOT NULL,
  `cnrut_cntct` varchar(50) NOT NULL,
  `cnrut_rutes` varchar(50) NOT NULL,
  `cnrut_empid` varchar(50) NOT NULL,
  `cnrut_srlno` int(11) NOT NULL DEFAULT 0,
  `cnrut_lvdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cnrut_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cnrut_crusr` varchar(50) NOT NULL,
  `cnrut_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cnrut_upusr` varchar(50) NOT NULL,
  `cnrut_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cnrut_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmcb_cntrt`
--

INSERT INTO `tmcb_cntrt` (`id`, `cnrut_users`, `cnrut_bsins`, `cnrut_cntct`, `cnrut_rutes`, `cnrut_empid`, `cnrut_srlno`, `cnrut_lvdat`, `cnrut_actve`, `cnrut_crusr`, `cnrut_crdat`, `cnrut_upusr`, `cnrut_updat`, `cnrut_rvnmr`) VALUES
('1fb6f947-26d4-44fb-8154-60c7bb80445c', 'user1', 'business1', 'outlet2', 'route4', '850d5993-1d5f-411e-ad8a-b2ceba393e0d', 1, '2026-02-23 06:19:48', 1, 'user1', '2026-02-23 06:19:48', 'user1', '2026-02-23 06:19:48', 1),
('7dd5b92e-dfdf-4582-a23a-88ba20c0c99f', 'user1', 'business1', 'outlet3', 'route2', '850d5993-1d5f-411e-ad8a-b2ceba393e0d', 2, '2026-02-23 06:19:21', 1, 'user1', '2026-02-23 06:19:21', 'user1', '2026-02-23 06:19:21', 1),
('8a65db7a-ef7e-442f-9d9c-4dc7d77f9eab', 'user1', 'business1', 'outlet3', 'route1', '850d5993-1d5f-411e-ad8a-b2ceba393e0d', 1, '2026-02-23 06:19:55', 1, 'user1', '2026-02-23 06:19:55', 'user1', '2026-02-23 06:19:55', 1),
('9210d87d-e640-4c3e-bbcc-75601d7eaf80', 'user1', 'business1', 'outlet1', 'route2', '850d5993-1d5f-411e-ad8a-b2ceba393e0d', 3, '2026-02-23 06:19:28', 1, 'user1', '2026-02-23 06:19:28', 'user1', '2026-02-23 06:19:28', 1),
('cec79be1-3497-40a6-9cb3-51b863cc930e', 'user1', 'business1', 'outlet2', 'route2', '850d5993-1d5f-411e-ad8a-b2ceba393e0d', 1, '2026-02-23 06:01:30', 1, 'user1', '2026-02-23 06:01:30', 'user1', '2026-02-23 06:01:30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_dlvan`
--

CREATE TABLE `tmcb_dlvan` (
  `id` varchar(50) NOT NULL,
  `dlvan_users` varchar(50) NOT NULL,
  `dlvan_bsins` varchar(50) NOT NULL,
  `dlvan_vname` varchar(50) NOT NULL,
  `dlvan_dname` varchar(50) DEFAULT NULL,
  `dlvan_actve` tinyint(1) NOT NULL DEFAULT 1,
  `dlvan_crusr` varchar(50) NOT NULL,
  `dlvan_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `dlvan_upusr` varchar(50) NOT NULL,
  `dlvan_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dlvan_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmcb_dlvan`
--

INSERT INTO `tmcb_dlvan` (`id`, `dlvan_users`, `dlvan_bsins`, `dlvan_vname`, `dlvan_dname`, `dlvan_actve`, `dlvan_crusr`, `dlvan_crdat`, `dlvan_upusr`, `dlvan_updat`, `dlvan_rvnmr`) VALUES
('54aeb07f-f041-423d-914f-c5de7915f14f', 'user1', 'business1', 'Delivery Van 1', '', 1, 'user1', '2026-02-19 08:07:28', 'user1', '2026-02-19 08:07:28', 1),
('b9f74607-1419-4559-8188-6f1b5bdc5165', 'user1', 'business1', 'Pickup No 1', '', 1, 'user1', '2026-02-19 08:07:47', 'user1', '2026-02-19 08:07:47', 1);

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
('bogra', 'user1', 'business1', 'Bangladesh', 'Bogra', 1, 'user1', '2026-01-25 04:45:54', 'user1', '2026-02-22 07:21:33', 4),
('d40b3bdc-9f1c-49b7-a75c-c6bd244b7414', 'user1', 'business1', 'Bangladesh', 'Narshindi', 1, 'user1', '2026-02-22 07:21:44', 'user1', '2026-02-22 07:22:13', 3),
('dhaka', 'user1', 'business1', 'Bangladesh', 'Dhaka', 1, 'user1', '2026-01-25 04:45:54', 'user1', '2026-01-31 10:15:30', 1),
('narayanganj', 'user1', 'business1', 'Bangladesh', 'Narayanganj', 1, 'user1', '2026-01-25 04:45:54', 'user1', '2026-01-31 10:15:30', 1),
('sirajganj', 'user1', 'business1', 'Bangladesh', 'Sirajganj', 1, 'user1', '2026-01-25 04:45:54', 'user1', '2026-01-31 10:15:30', 1);

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
  `rutes_trtry` varchar(50) NOT NULL,
  `rutes_lvdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rutes_actve` tinyint(1) NOT NULL DEFAULT 1,
  `rutes_crusr` varchar(50) NOT NULL,
  `rutes_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rutes_upusr` varchar(50) NOT NULL,
  `rutes_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rutes_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmcb_rutes`
--

INSERT INTO `tmcb_rutes` (`id`, `rutes_users`, `rutes_bsins`, `rutes_rname`, `rutes_dname`, `rutes_trtry`, `rutes_lvdat`, `rutes_actve`, `rutes_crusr`, `rutes_crdat`, `rutes_upusr`, `rutes_updat`, `rutes_rvnmr`) VALUES
('route1', 'user1', 'business1', 'Hossain Market', 'Sunday', 'uttar-badda', '2026-02-18 05:45:22', 1, '', '2026-02-18 05:45:22', 'user1', '2026-02-23 03:53:57', 4),
('route2', 'user1', 'business1', 'Adarshanagar', 'Monday', 'uttar-badda', '2026-02-18 09:14:23', 1, 'user1', '2026-02-18 09:14:23', 'user1', '2026-02-23 04:57:05', 3),
('route3', 'user1', 'business1', 'Satarkul', 'Thursday', 'uttar-badda', '2026-02-22 09:35:11', 1, 'user1', '2026-02-22 09:35:11', 'user1', '2026-02-23 04:57:10', 2),
('route4', 'user1', 'business1', 'Baganbari', 'Tuesday', 'uttar-badda', '2026-02-22 09:39:40', 1, 'user1', '2026-02-22 09:39:40', 'user1', '2026-02-23 04:57:15', 2),
('route5', 'user1', 'business1', 'North Badda', 'Saturday', 'uttar-badda', '2026-02-18 09:12:06', 1, 'user1', '2026-02-18 09:12:06', 'user1', '2026-02-23 04:57:18', 4);

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
('adamdighi', 'user1', 'business1', 'bogra', 'Adamdighi', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-02-22 07:44:54', 4),
('araihazar', 'user1', 'business1', 'narayanganj', 'Araihazar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('b4dfa361-9d64-43a9-9330-bdcfe91d82c4', 'user1', 'business1', 'dhaka', 'Gulshan', 1, 'user1', '2026-02-22 09:13:29', 'user1', '2026-02-22 09:13:29', 1),
('badda', 'user1', 'business1', 'dhaka', 'Badda', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('bandar', 'user1', 'business1', 'narayanganj', 'Bandar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('belkuchi', 'user1', 'business1', 'sirajganj', 'Belkuchi', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('bhairob', 'user1', 'business1', 'narayanganj', 'Bhairob', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('bogra-sadar', 'user1', 'business1', 'bogra', 'Bogra Sadar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-02-22 07:44:38', 2),
('chauhali', 'user1', 'business1', 'sirajganj', 'Chauhali', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('dhunat', 'user1', 'business1', 'bogra', 'Dhunat', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('dhupchanchia', 'user1', 'business1', 'bogra', 'Dhupchanchia', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('enayetpur', 'user1', 'business1', 'sirajganj', 'Enayetpur', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('gabtali', 'user1', 'business1', 'bogra', 'Gabtali', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('jamuna-river', 'user1', 'business1', 'sirajganj', 'Jamuna River', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('kachpur', 'user1', 'business1', 'narayanganj', 'Kachpur', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('kahaloo', 'user1', 'business1', 'bogra', 'Kahaloo', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('kamarkhanda', 'user1', 'business1', 'sirajganj', 'Kamarkhanda', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('kazipur', 'user1', 'business1', 'sirajganj', 'Kazipur', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('nandigram', 'user1', 'business1', 'bogra', 'Nandigram', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('narayanganj-city-corporation', 'user1', 'business1', 'narayanganj', 'Narayanganj City Corporation', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('narayanganj-sadar', 'user1', 'business1', 'narayanganj', 'Narayanganj Sadar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('raiganj', 'user1', 'business1', 'sirajganj', 'Raiganj', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('rupganj', 'user1', 'business1', 'narayanganj', 'Rupganj', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('sariakandi', 'user1', 'business1', 'bogra', 'Sariakandi', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('shahjadpur', 'user1', 'business1', 'sirajganj', 'Shahjadpur', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('shajahanpur', 'user1', 'business1', 'bogra', 'Shajahanpur', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('sherpur', 'user1', 'business1', 'bogra', 'Sherpur', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('shibganj', 'user1', 'business1', 'bogra', 'Shibganj', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('sirajganj-sadar', 'user1', 'business1', 'sirajganj', 'Sirajganj Sadar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('sonargaon', 'user1', 'business1', 'narayanganj', 'Sonargaon', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('sonatala', 'user1', 'business1', 'bogra', 'Sonatala', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('tarash', 'user1', 'business1', 'sirajganj', 'Tarash', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmcb_trtry`
--

CREATE TABLE `tmcb_trtry` (
  `id` varchar(50) NOT NULL,
  `trtry_users` varchar(50) NOT NULL,
  `trtry_bsins` varchar(50) NOT NULL,
  `trtry_tarea` varchar(50) NOT NULL,
  `trtry_wname` varchar(50) NOT NULL,
  `trtry_actve` tinyint(1) NOT NULL DEFAULT 1,
  `trtry_crusr` varchar(50) NOT NULL,
  `trtry_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `trtry_upusr` varchar(50) NOT NULL,
  `trtry_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `trtry_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmcb_trtry`
--

INSERT INTO `tmcb_trtry` (`id`, `trtry_users`, `trtry_bsins`, `trtry_tarea`, `trtry_wname`, `trtry_actve`, `trtry_crusr`, `trtry_crdat`, `trtry_upusr`, `trtry_updat`, `trtry_rvnmr`) VALUES
('3231dde2-0d26-4af6-8042-4836cce8e7a1', 'user1', 'business1', 'sherpur', 'Chandaikona', 1, 'user1', '2026-02-22 09:06:08', 'user1', '2026-02-22 09:06:08', 1),
('953aaae2-de9b-4b9d-96bb-d21292738ca0', 'user1', 'business1', 'badda', 'South Badda', 1, 'user1', '2026-02-22 09:00:01', 'user1', '2026-02-22 09:00:12', 3),
('f38bb6ac-acd3-4e0c-95f8-c74b3e27b9b4', 'user1', 'business1', 'b4dfa361-9d64-43a9-9330-bdcfe91d82c4', 'Gulshan 1 Circle', 1, 'user1', '2026-02-22 09:16:27', 'user1', '2026-02-22 09:16:27', 1),
('middle-badda', 'user1', 'business1', 'badda', 'Middle Badda', 1, 'user1', '2026-02-18 05:36:57', 'user1', '2026-02-18 05:44:00', 1),
('uttar-badda', 'user1', 'business1', 'badda', 'Uttar Badda', 1, 'user1', '2026-02-18 05:36:57', 'user1', '2026-02-18 05:43:55', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_cbkng`
--

CREATE TABLE `tmeb_cbkng` (
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
  `cbkng_srcnm` varchar(50) NOT NULL,
  `cbkng_refid` varchar(50) NOT NULL,
  `cbkng_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cbkng_crusr` varchar(50) NOT NULL,
  `cbkng_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cbkng_upusr` varchar(50) NOT NULL,
  `cbkng_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cbkng_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_cinvc`
--

CREATE TABLE `tmeb_cinvc` (
  `id` varchar(50) NOT NULL,
  `cinvc_minvc` varchar(50) NOT NULL,
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
  `cinvc_lprat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `cinvc_notes` varchar(50) DEFAULT NULL,
  `cinvc_attrb` varchar(300) DEFAULT NULL,
  `cinvc_srcnm` varchar(50) NOT NULL,
  `cinvc_refid` varchar(50) NOT NULL,
  `cinvc_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cinvc_crusr` varchar(50) NOT NULL,
  `cinvc_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cinvc_upusr` varchar(50) NOT NULL,
  `cinvc_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cinvc_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmeb_cinvc`
--

INSERT INTO `tmeb_cinvc` (`id`, `cinvc_minvc`, `cinvc_bitem`, `cinvc_items`, `cinvc_itrat`, `cinvc_itqty`, `cinvc_itamt`, `cinvc_dspct`, `cinvc_dsamt`, `cinvc_vtpct`, `cinvc_vtamt`, `cinvc_csrat`, `cinvc_ntamt`, `cinvc_lprat`, `cinvc_notes`, `cinvc_attrb`, `cinvc_srcnm`, `cinvc_refid`, `cinvc_actve`, `cinvc_crusr`, `cinvc_crdat`, `cinvc_upusr`, `cinvc_updat`, `cinvc_rvnmr`) VALUES
('65ca4a1b-436a-4277-8ded-72c499c4e2fa', '6a88d151-6a6e-4e7a-8c19-9b57194d0551', 'f241e3b7-3f83-42f4-ac10-af8def91799a', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 75.000000, 5.000000, 375.000000, 0.000000, 0.000000, 5.000000, 18.750000, 75.000000, 393.750000, 55.000000, '', '{}', 'Inventory Stock', 'f241e3b7-3f83-42f4-ac10-af8def91799a', 1, 'user1', '2026-02-15 07:45:02', 'user1', '2026-02-15 07:45:02', 1),
('cea7e6a2-d710-4a34-85da-7e7d5031b4c7', '6a88d151-6a6e-4e7a-8c19-9b57194d0551', '9a04c7bb-e9d8-4adf-8eff-1fe92e43c971', 'fa1b188a-c075-4b90-bbea-37e3733f50bb', 950.000000, 1.000000, 950.000000, 0.000000, 0.000000, 5.000000, 47.500000, 950.000000, 997.500000, 750.000000, '', '{\"Size\":\"1Kg\"}', 'Purchase Invoice', '2c5b4c35-1aee-44a7-9865-f02472a7ceb3', 1, 'user1', '2026-02-15 07:45:02', 'user1', '2026-02-15 07:45:02', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_crcpt`
--

CREATE TABLE `tmeb_crcpt` (
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
  `crcpt_srcnm` varchar(50) NOT NULL,
  `crcpt_refid` varchar(50) NOT NULL,
  `crcpt_actve` tinyint(1) NOT NULL DEFAULT 1,
  `crcpt_crusr` varchar(50) NOT NULL,
  `crcpt_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `crcpt_upusr` varchar(50) NOT NULL,
  `crcpt_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `crcpt_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_expns`
--

CREATE TABLE `tmeb_expns` (
  `id` varchar(50) NOT NULL,
  `expns_users` varchar(50) NOT NULL,
  `expns_bsins` varchar(50) NOT NULL,
  `expns_cntct` varchar(50) NOT NULL,
  `expns_refid` varchar(50) NOT NULL,
  `expns_refno` varchar(50) NOT NULL,
  `expns_srcnm` varchar(50) NOT NULL,
  `expns_trdat` datetime NOT NULL DEFAULT current_timestamp(),
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

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_fodrc`
--

CREATE TABLE `tmeb_fodrc` (
  `id` varchar(50) NOT NULL,
  `fodrc_fodrm` varchar(50) NOT NULL,
  `fodrc_bitem` varchar(50) NOT NULL,
  `fodrc_items` varchar(50) NOT NULL,
  `fodrc_itrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_itqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_itamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_dspct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_vtpct` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_csrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_ntamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_notes` varchar(50) DEFAULT NULL,
  `fodrc_attrb` varchar(300) DEFAULT NULL,
  `fodrc_dlqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_dgqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrc_srcnm` varchar(50) NOT NULL,
  `fodrc_refid` varchar(50) NOT NULL,
  `fodrc_actve` tinyint(1) NOT NULL DEFAULT 1,
  `fodrc_crusr` varchar(50) NOT NULL,
  `fodrc_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `fodrc_upusr` varchar(50) NOT NULL,
  `fodrc_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fodrc_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_fodrm`
--

CREATE TABLE `tmeb_fodrm` (
  `id` varchar(50) NOT NULL,
  `fodrm_users` varchar(50) NOT NULL,
  `fodrm_bsins` varchar(50) NOT NULL,
  `fodrm_cntct` varchar(50) NOT NULL,
  `fodrm_ocuid` varchar(50) NOT NULL,
  `fodrm_rutes` varchar(50) NOT NULL,
  `fodrm_trnno` varchar(50) NOT NULL,
  `fodrm_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `fodrm_trnte` varchar(100) DEFAULT NULL,
  `fodrm_odamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_dlamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_dsamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_vtamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_rnamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_ttamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_pyamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_pdamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_duamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `fodrm_ispad` tinyint(1) NOT NULL DEFAULT 0,
  `fodrm_ispst` tinyint(1) NOT NULL DEFAULT 0,
  `fodrm_iscls` tinyint(1) NOT NULL DEFAULT 0,
  `fodrm_vatcl` tinyint(1) NOT NULL DEFAULT 0,
  `fodrm_dlvan` varchar(50) NOT NULL,
  `fodrm_dldat` datetime NOT NULL DEFAULT current_timestamp(),
  `fodrm_actve` tinyint(1) NOT NULL DEFAULT 1,
  `fodrm_crusr` varchar(50) NOT NULL,
  `fodrm_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `fodrm_upusr` varchar(50) NOT NULL,
  `fodrm_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fodrm_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_mbkng`
--

CREATE TABLE `tmeb_mbkng` (
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

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_minvc`
--

CREATE TABLE `tmeb_minvc` (
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

--
-- Dumping data for table `tmeb_minvc`
--

INSERT INTO `tmeb_minvc` (`id`, `minvc_users`, `minvc_bsins`, `minvc_cntct`, `minvc_trnno`, `minvc_trdat`, `minvc_refno`, `minvc_trnte`, `minvc_odamt`, `minvc_dsamt`, `minvc_vtamt`, `minvc_vatpy`, `minvc_incst`, `minvc_excst`, `minvc_rnamt`, `minvc_ttamt`, `minvc_pyamt`, `minvc_pdamt`, `minvc_duamt`, `minvc_rtamt`, `minvc_ispad`, `minvc_ispst`, `minvc_iscls`, `minvc_vatcl`, `minvc_hscnl`, `minvc_actve`, `minvc_crusr`, `minvc_crdat`, `minvc_upusr`, `minvc_updat`, `minvc_rvnmr`) VALUES
('6a88d151-6a6e-4e7a-8c19-9b57194d0551', 'user1', 'business1', '11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'SI-150226-00001', '2026-02-15 00:00:00', '', '', 1325.000000, 0.000000, 66.250000, 1, 0.000000, 0.000000, 0.000000, 1391.250000, 1391.250000, 1391.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-15 07:45:02', 'user1', '2026-02-15 10:22:44', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmeb_mrcpt`
--

CREATE TABLE `tmeb_mrcpt` (
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

-- --------------------------------------------------------

--
-- Table structure for table `tmhb_emply`
--

CREATE TABLE `tmhb_emply` (
  `id` varchar(50) NOT NULL,
  `emply_users` varchar(50) NOT NULL,
  `emply_bsins` varchar(50) NOT NULL,
  `emply_ecode` varchar(50) DEFAULT NULL,
  `emply_crdno` varchar(50) DEFAULT NULL,
  `emply_ename` varchar(50) NOT NULL,
  `emply_econt` varchar(50) NOT NULL,
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
  `emply_desig` varchar(50) DEFAULT NULL,
  `emply_jndat` datetime DEFAULT current_timestamp(),
  `emply_cndat` datetime DEFAULT NULL,
  `emply_rgdat` datetime DEFAULT NULL,
  `emply_gssal` decimal(16,2) NOT NULL DEFAULT 0.00,
  `emply_otrat` decimal(16,2) NOT NULL DEFAULT 0.00,
  `emply_etype` varchar(50) DEFAULT NULL,
  `emply_pyacc` varchar(50) DEFAULT NULL,
  `emply_slcyl` varchar(50) DEFAULT NULL,
  `emply_wksft` varchar(50) DEFAULT NULL,
  `emply_supid` varchar(50) DEFAULT NULL,
  `emply_notes` varchar(50) DEFAULT NULL,
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
-- Dumping data for table `tmhb_emply`
--

INSERT INTO `tmhb_emply` (`id`, `emply_users`, `emply_bsins`, `emply_ecode`, `emply_crdno`, `emply_ename`, `emply_econt`, `emply_email`, `emply_natid`, `emply_bdate`, `emply_prnam`, `emply_gendr`, `emply_mstas`, `emply_bgrup`, `emply_rlgon`, `emply_edgrd`, `emply_psadr`, `emply_pradr`, `emply_desig`, `emply_jndat`, `emply_cndat`, `emply_rgdat`, `emply_gssal`, `emply_otrat`, `emply_etype`, `emply_pyacc`, `emply_slcyl`, `emply_wksft`, `emply_supid`, `emply_notes`, `emply_login`, `emply_pswrd`, `emply_pictr`, `emply_stats`, `emply_actve`, `emply_crusr`, `emply_crdat`, `emply_upusr`, `emply_updat`, `emply_rvnmr`) VALUES
('765581bf-b1ae-45de-a6af-2988d97a48ab', 'user1', 'business1', 'staff2', '', 'Staff 2', 'staff2', 'staff2@sgd.com', '', '2026-02-23 00:00:00', '', '', '', '', '', '', 'staff2', '', 'Trainee Executive', '2026-02-23 00:00:00', '2026-02-23 00:00:00', '2026-02-23 00:00:00', 0.00, 0.00, '', '', '', '', '', '', 1, '123', '', 'Active', 1, 'user1', '2026-02-23 05:35:32', 'user1', '2026-02-23 05:35:32', 1),
('850d5993-1d5f-411e-ad8a-b2ceba393e0d', 'user1', 'business1', 'staff1', '', 'Staff 1', 'staff1', 'staff1@sgd.com', '', '2026-02-23 00:00:00', '', '', '', '', '', '', 'staff1', '', 'Trainee Executive', '2026-02-23 00:00:00', '2026-02-23 00:00:00', '2026-02-23 00:00:00', 0.00, 0.00, '', '', '', '', '', '', 1, '123', '', 'Active', 1, 'user1', '2026-02-23 05:31:56', 'user1', '2026-02-23 05:34:46', 2),
('staff1', 'user1', 'business1', 'code', 'card', 'Jisan', '01722688266', 'jisan@sgd.com', '19915001', '2026-02-15 00:00:00', 'Father Mother', 'Male', 'Single', 'A+', 'Islam', 'Higher Secondary', 'Badda, Dhaka', 'Badda, Dhaka', 'Senior Manager', '2026-02-15 00:00:00', '2026-02-15 00:00:00', '2026-02-15 00:00:00', 0.00, 0.00, 'Regular', 'Cash', 'Full', 'Regular', 'Supervisor', 'notes', 0, '123456', '', 'Active', 1, 'user1', '2026-02-15 06:16:41', 'user1', '2026-02-23 05:31:29', 18),
('staff2', 'user1', 'business1', '', '', 'Jakia', '01713003745', 'admin@sgd.com', '', '2026-02-15 00:00:00', '', 'Female', 'Single', 'O+', '', '', 'Badda, Dhaka', '', 'Senior Manager', '2026-02-15 00:00:00', '2026-02-15 00:00:00', '2026-02-15 00:00:00', 0.00, 0.00, '', '', '', '', '', '', 0, '', '', 'Active', 1, 'user1', '2026-02-15 07:42:20', 'user1', '2026-02-18 05:48:27', 1);

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
('color', 'user1', 'Color', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('expiry', 'user1', 'Expiry', 'date', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('fabric', 'user1', 'Fabric', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('flavor', 'user1', 'Flavor', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('height', 'user1', 'Height', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('imei', 'user1', 'IMEI', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('model', 'user1', 'Model', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('serialno', 'user1', 'Serial No', 'number', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('size', 'user1', 'Size', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('weight', 'user1', 'Weight', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1),
('width', 'user1', 'Width', 'text', 1, 'user1', '2026-01-25 07:38:19', 'user1', '2026-01-31 10:17:08', 1);

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
  `bitem_istkq` decimal(20,6) NOT NULL DEFAULT 0.000000,
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

INSERT INTO `tmib_bitem` (`id`, `bitem_users`, `bitem_items`, `bitem_bsins`, `bitem_lprat`, `bitem_dprat`, `bitem_mcmrp`, `bitem_sddsp`, `bitem_snote`, `bitem_gstkq`, `bitem_bstkq`, `bitem_istkq`, `bitem_mnqty`, `bitem_mxqty`, `bitem_pbqty`, `bitem_sbqty`, `bitem_mpric`, `bitem_actve`, `bitem_crusr`, `bitem_crdat`, `bitem_upusr`, `bitem_updat`, `bitem_rvnmr`) VALUES
('1248204a-e407-4245-8952-924a1f832354', 'user1', '4b019cba-eda8-4ad3-a8ac-ece0e6478ffe', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 100.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:56:36', 'user1', '2026-02-16 04:49:28', 1),
('19debe39-1eaa-4cb1-ba16-3f361ff455ca', 'user1', 'e2e70dc1-9814-400c-8774-2b6b186b79e5', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:15', 'user1', '2026-02-02 05:57:45', 1),
('1b0483c5-ed8f-43ce-b128-9dbf717e8e67', 'user1', '8873e069-eea6-4f9e-acf0-dd1cb658f9c8', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:55:41', 'user1', '2026-01-31 10:55:41', 1),
('2188dcd0-244b-4750-ad51-f86397b196f1', 'user1', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 100.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:04', 'user1', '2026-02-15 11:08:35', 1),
('228076b3-b3df-4270-a1b3-a2520267818c', 'user1', '485d61c3-e84e-418b-b91b-2171c17f0391', 'business1', 140.000000, 0.000000, 190.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 24.800000, 1, 'user1', '2026-01-31 10:58:06', 'user1', '2026-02-09 08:14:17', 1),
('282533ed-53cf-496a-8611-c452785371fd', 'user1', '42ccd66a-70db-4c7f-93c4-36261a8f064f', 'business1', 300.000000, 0.000000, 380.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 20.000000, 1, 'user1', '2026-01-31 10:57:58', 'user1', '2026-02-08 07:56:52', 1),
('28738f75-f676-4f53-bb43-b74638699553', 'user1', 'e483bc2d-6ccd-4b72-8603-775dcd275249', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:49', 'user1', '2026-01-31 10:58:49', 1),
('586345fd-6f26-4577-90ab-dfb8bc49e187', 'user1', '471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 11:00:06', 'user1', '2026-01-31 11:00:06', 1),
('59dd7e4d-3748-4ee0-9531-8eb73cf03fed', 'user1', '940f8010-5d38-4de4-b66f-d12958ff9ecf', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:57:22', 'user1', '2026-01-31 10:57:22', 1),
('75860dc3-c9f8-43b9-a20f-f78104602fdf', 'user1', '4b100c2e-68a6-467b-94b7-617a6c7b43dc', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:55', 'user1', '2026-01-31 10:59:55', 1),
('85f84fc9-2d92-4327-81b6-31a4c6c6cc8a', 'user1', 'e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:57', 'user1', '2026-01-31 10:58:57', 1),
('8ce55060-f46d-445f-bcc1-7fb9d5f5f38e', 'user1', 'b3da1017-bea4-44fd-ad13-110e92a48965', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:41', 'user1', '2026-01-31 10:59:41', 1),
('9a04c7bb-e9d8-4adf-8eff-1fe92e43c971', 'user1', 'fa1b188a-c075-4b90-bbea-37e3733f50bb', 'business1', 750.000000, 0.000000, 950.000000, 5.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 17.500000, 1, 'user1', '2026-01-31 10:57:44', 'user1', '2026-02-17 01:50:01', 1),
('9a765ccf-f3c5-480a-863d-492c7d9fa196', 'user1', '4dab149a-e220-4cd8-a061-7660ab0168bb', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 11:00:36', 'user1', '2026-01-31 11:00:36', 1),
('b9b0e3b5-a1df-43ea-a736-04a54f5df89b', 'user1', '75b05c78-9b6b-42ba-aafa-e76e22f67722', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:31', 'user1', '2026-01-31 10:58:31', 1),
('bde13886-7498-42b9-bc4d-19bcb62ed918', 'user1', 'f7126510-80c0-416b-a34e-3a514e54d030', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:57:00', 'user1', '2026-01-31 10:57:00', 1),
('bf05a1d1-2b12-46e8-bf24-5e7edde46136', 'user1', '24614ec4-8ab0-4b50-b3c7-9f154a124770', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:47', 'user1', '2026-02-01 14:22:53', 1),
('c6fe2a29-7725-4db6-9bed-840c04301d0e', 'user1', 'ad014a04-77d0-4f46-acc9-dee2b02c64f2', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:56:46', 'user1', '2026-01-31 10:56:46', 1),
('d2b89636-0c00-4c61-aa9b-08ff5f37cac7', 'user1', 'f949a24a-3ff8-4349-9ca0-f853de9226c7', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:13', 'user1', '2026-01-31 10:59:13', 1),
('df364d84-6063-44c7-8b26-bb9d81fc0bc1', 'user1', '0e5de4e6-86dd-453a-8b94-963ee305e860', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:21', 'user1', '2026-01-31 10:59:21', 1),
('dfa047a4-4799-460d-ae14-74697a8f0466', 'user1', 'ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:42', 'user1', '2026-01-31 10:58:42', 1),
('e1e36ac3-d2b5-4f7b-a258-2c3ffcacd131', 'user1', '2bee4dba-5f29-4e65-b772-718c677e326c', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:56:51', 'user1', '2026-01-31 10:56:51', 1),
('eff83204-5f40-4920-9d42-67a27ec6a1a5', 'user1', '2c047e91-44f6-48bc-a591-9ab00deb7b72', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:30', 'user1', '2026-01-31 10:59:30', 1),
('f241e3b7-3f83-42f4-ac10-af8def91799a', 'user1', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 'business1', 55.000000, 0.000000, 75.000000, 0.000000, '', 95.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 11.750000, 1, 'user1', '2026-01-31 10:57:36', 'user1', '2026-02-15 11:08:22', 1),
('f4445732-0c3d-4388-b30a-b77cd0151b14', 'user1', '940f8010-5d38-4de4-b66f-d12958ff9ec2', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 11:00:20', 'user1', '2026-01-31 11:00:20', 1);

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
('204e4887-0af6-4908-add0-240ea380a53b', 'user1', 'Household Essentials', 1, 'user1', '2026-01-11 05:06:00', 'user1', '2026-01-31 10:27:26', 1),
('36886293-b080-44dc-9c8e-fed94ad161d3', 'user1', 'Rice & Grain', 1, 'user1', '2026-01-11 05:04:19', 'user1', '2026-01-31 10:27:26', 1),
('3ed137d4-3863-407a-8f4a-dd1000479780', 'user1', 'Dairy Products', 1, 'user1', '2026-01-11 05:04:25', 'user1', '2026-01-31 10:27:26', 1),
('b1df68d6-2888-42c7-a3a8-cdaedadf5408', 'user1', 'Toys and Gears', 1, 'user1', '2026-01-11 05:04:47', 'user1', '2026-01-31 10:27:26', 1),
('e69fe3b2-784f-44d5-9d88-4c228704242f', 'user1', 'Eggs & Poultry', 1, 'user1', '2026-01-11 05:04:10', 'user1', '2026-01-31 10:27:26', 1),
('feacdbbe-2519-4975-96fe-ad18c7899b53', 'user1', 'Beverages & Snacks', 1, 'user1', '2026-01-11 05:03:50', 'user1', '2026-01-31 10:27:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_ctrsf`
--

CREATE TABLE `tmib_ctrsf` (
  `id` varchar(50) NOT NULL,
  `ctrsf_mtrsf` varchar(50) NOT NULL,
  `ctrsf_bitem` varchar(50) NOT NULL,
  `ctrsf_items` varchar(50) NOT NULL,
  `ctrsf_itrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_itqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_itamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_csrat` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_ntamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_notes` varchar(50) DEFAULT NULL,
  `ctrsf_attrb` varchar(300) DEFAULT NULL,
  `ctrsf_rtqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_slqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_ohqty` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `ctrsf_srcnm` varchar(50) NOT NULL,
  `ctrsf_refid` varchar(50) NOT NULL,
  `ctrsf_actve` tinyint(1) NOT NULL DEFAULT 1,
  `ctrsf_crusr` varchar(50) NOT NULL,
  `ctrsf_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ctrsf_upusr` varchar(50) NOT NULL,
  `ctrsf_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ctrsf_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

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
  `expns_trdat` datetime NOT NULL DEFAULT current_timestamp(),
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
  `items_trcks` tinyint(1) NOT NULL DEFAULT 0,
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

INSERT INTO `tmib_items` (`id`, `items_users`, `items_icode`, `items_bcode`, `items_hscod`, `items_iname`, `items_idesc`, `items_puofm`, `items_dfqty`, `items_suofm`, `items_ctgry`, `items_itype`, `items_trcks`, `items_sdvat`, `items_costp`, `items_image`, `items_nofbi`, `items_actve`, `items_crusr`, `items_crdat`, `items_upusr`, `items_updat`, `items_rvnmr`) VALUES
('0e5de4e6-86dd-453a-8b94-963ee305e860', 'user1', 'HE-003', 'HE-003', 'HE-003', 'Floor Cleaner', 'Floor Cleaner', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 1, '1f240f2c-50ab-407f-b77d-0ce95922fd6c', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 7.50, 16.00, NULL, 1, 1, 'user1', '2026-01-18 12:08:34', 'user1', '2026-01-31 10:59:21', 1),
('24614ec4-8ab0-4b50-b3c7-9f154a124770', 'user1', 'RG-003', 'RG-003', 'RG-003', 'Basmati Rice', 'Basmati Rice', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 5.00, 16.00, NULL, 1, 1, 'user1', '2026-01-12 06:16:06', 'user1', '2026-01-31 10:59:47', 1),
('2bee4dba-5f29-4e65-b772-718c677e326c', 'user1', 'BS-004', 'BS-004', 'BS-004', 'Potato Chips', 'Potato Chips', '344eb4c8-48c4-475b-b74c-307a0e492622', 20, 'f5ccd3c1-fd1e-4f0e-93be-59dd878c881a', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 10.00, 20.00, NULL, 1, 1, 'user1', '2026-01-18 12:23:51', 'user1', '2026-01-31 10:56:51', 1),
('2c047e91-44f6-48bc-a591-9ab00deb7b72', 'user1', 'RG-005', 'RG-005', 'RG-005', 'Masur Dal', 'Masur Dal', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 5.00, 15.00, NULL, 1, 1, 'user1', '2026-01-18 11:49:45', 'user1', '2026-01-31 10:59:30', 1),
('38b496e9-6652-4324-8331-ba0ecb0cfeae', 'user1', 'DP-001', 'DP-001', 'DP-001', 'Fresh Milk', 'Fresh Milk', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 1, '1f240f2c-50ab-407f-b77d-0ce95922fd6c', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 5.00, 15.00, NULL, 1, 1, 'user1', '2026-01-18 11:51:08', 'user1', '2026-01-31 10:57:36', 1),
('42ccd66a-70db-4c7f-93c4-36261a8f064f', 'user1', 'DP-003', 'DP-003', 'DP-003', 'Yogurt', 'Yogurt', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 5.00, 20.00, NULL, 1, 1, 'user1', '2026-01-18 11:53:02', 'user1', '2026-01-31 10:57:58', 1),
('471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', 'user1', 'HE-005', 'HE-005', 'HE-005', 'Tissue Roll', 'Tissue Roll', '344eb4c8-48c4-475b-b74c-307a0e492622', 6, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 7.50, 18.00, NULL, 1, 1, 'user1', '2026-01-18 12:10:46', 'user1', '2026-01-31 11:00:06', 1),
('485d61c3-e84e-418b-b91b-2171c17f0391', 'user1', 'DP-004', 'DP-004', 'DP-004', 'Butter', 'Butter', '344eb4c8-48c4-475b-b74c-307a0e492622', 1, '344eb4c8-48c4-475b-b74c-307a0e492622', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 5.00, 18.00, NULL, 1, 1, 'user1', '2026-01-18 11:54:16', 'user1', '2026-01-31 10:58:06', 1),
('4b019cba-eda8-4ad3-a8ac-ece0e6478ffe', 'user1', 'BS-002', 'BS-002', 'BS-002', 'Mineral Water 1L', 'Mineral Water 1L', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, 'c1ab2f8e-5030-40a4-85a3-569ad7cc6dd7', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 10.00, 14.00, NULL, 1, 1, 'user1', '2026-01-18 12:21:19', 'user1', '2026-01-31 10:56:36', 1),
('4b100c2e-68a6-467b-94b7-617a6c7b43dc', 'user1', 'HE-004', 'HE-004', 'HE-004', 'Toilet Cleaner', 'Toilet Cleaner', '344eb4c8-48c4-475b-b74c-307a0e492622', 6, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 7.50, 20.00, NULL, 1, 1, 'user1', '2026-01-18 12:09:36', 'user1', '2026-01-31 10:59:55', 1),
('4dab149a-e220-4cd8-a061-7660ab0168bb', 'user1', 'RG-002', 'RG-002', 'RG-002', 'Nazirshail Rice', 'Nazirshail Rice', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 5.00, 14.00, NULL, 1, 1, 'user1', '2026-01-12 06:20:57', 'user1', '2026-01-31 11:00:36', 1),
('75b05c78-9b6b-42ba-aafa-e76e22f67722', 'user1', 'HE-001', 'HE-001', 'HE-001', 'Laundry Soap', 'Laundry Soap', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '78a63632-6a35-49ab-8cac-4b5c0d4fb418', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 7.50, 20.00, NULL, 1, 1, 'user1', '2026-01-18 12:05:41', 'user1', '2026-01-31 10:58:31', 1),
('8873e069-eea6-4f9e-acf0-dd1cb658f9c8', 'user1', 'BS-001', 'BS-001', 'BS-001', 'Soft Drink 250ml', 'Soft Drink 250ml', '344eb4c8-48c4-475b-b74c-307a0e492622', 24, 'f5d78785-c08b-46b7-a77f-dcf1a8700dd0', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 10.00, 15.00, NULL, 1, 1, 'user1', '2026-01-18 12:20:20', 'user1', '2026-01-31 11:11:12', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ec2', 'user1', 'RG-001', 'RG-001', 'RG-001', 'Miniket Rice', 'Miniket Rice', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 5.00, 15.00, NULL, 1, 1, 'user1', '2026-01-11 06:06:23', 'user1', '2026-01-31 11:00:20', 1),
('940f8010-5d38-4de4-b66f-d12958ff9ecf', 'user1', 'EP-003', 'EP-003', 'EP-003', 'Layer Egg (Dozen)', 'Layer Egg (Dozen)', '61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 30, 'f5d78785-c08b-46b7-a77f-dcf1a8700dd0', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 5.00, 15.00, NULL, 1, 1, 'user1', '2026-01-11 06:06:23', 'user1', '2026-01-31 10:57:22', 1),
('ad014a04-77d0-4f46-acc9-dee2b02c64f2', 'user1', 'BS-003', 'BS-003', 'BS-003', 'Juice Pack', 'Juice Pack', '344eb4c8-48c4-475b-b74c-307a0e492622', 10, 'cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 10.00, 18.00, NULL, 1, 1, 'user1', '2026-01-18 12:22:34', 'user1', '2026-01-31 10:56:46', 1),
('ae0a4ae3-77f6-4357-8ca9-c05cc1796a7e', 'user1', 'EP-001', 'EP-001', 'EP-001', 'Layer Egg', 'Layer Egg', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 5.00, 20.00, NULL, 1, 1, 'user1', '2026-01-12 06:17:33', 'user1', '2026-01-31 10:58:42', 1),
('b3da1017-bea4-44fd-ad13-110e92a48965', 'user1', 'RG-004', 'RG-004', 'RG-004', 'Wheat', 'Wheat', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '36886293-b080-44dc-9c8e-fed94ad161d3', 'Finished Goods', 0, 5.00, 12.00, NULL, 1, 1, 'user1', '2026-01-18 11:49:00', 'user1', '2026-01-31 10:59:41', 1),
('dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 'user1', 'EP-002', 'EP-002', 'EP-002', 'Duck Egg', 'Duck Egg', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 5.00, 18.00, NULL, 1, 1, 'user1', '2026-01-12 06:38:50', 'user1', '2026-01-31 10:59:04', 1),
('e2e70dc1-9814-400c-8774-2b6b186b79e5', 'user1', 'DP-005', 'DP-005', 'DP-005', 'Cheese Slice', 'Cheese Slice', '344eb4c8-48c4-475b-b74c-307a0e492622', 10, '50d3582c-909a-4818-afd7-54a8db8c1a44', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 0, 5.00, 18.00, NULL, 1, 1, 'user1', '2026-01-18 11:55:20', 'user1', '2026-01-31 10:58:15', 1),
('e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', 'user1', 'EP-004', 'EP-004', 'EP-004', 'Broiler Chicken', 'Broiler Chicken', 'f13c1fb3-3493-4640-9b13-02bd824b4977', 1000, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 5.00, 12.00, NULL, 1, 1, 'user1', '2026-01-11 06:38:46', 'user1', '2026-01-31 10:58:57', 1),
('e483bc2d-6ccd-4b72-8603-775dcd275249', 'user1', 'EP-005', 'EP-005', 'EP-005', 'Deshi Chicken', 'Deshi Chicken', 'f13c1fb3-3493-4640-9b13-02bd824b4977', 1000, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'e69fe3b2-784f-44d5-9d88-4c228704242f', 'Finished Goods', 0, 5.00, 10.00, NULL, 1, 1, 'user1', '2026-01-12 06:12:16', 'user1', '2026-01-31 10:58:49', 1),
('f7126510-80c0-416b-a34e-3a514e54d030', 'user1', 'BS-005', 'BS-005', 'BS-005', 'Biscuit', 'Biscuit', '344eb4c8-48c4-475b-b74c-307a0e492622', 12, '50d3582c-909a-4818-afd7-54a8db8c1a44', 'feacdbbe-2519-4975-96fe-ad18c7899b53', 'Finished Goods', 0, 10.00, 15.00, NULL, 1, 1, 'user1', '2026-01-18 12:24:41', 'user1', '2026-01-31 10:57:00', 1),
('f949a24a-3ff8-4349-9ca0-f853de9226c7', 'user1', 'HE-002', 'HE-002', 'HE-002', 'Dishwashing Liquid', 'Dishwashing Liquid', '1f240f2c-50ab-407f-b77d-0ce95922fd6c', 1, '1f240f2c-50ab-407f-b77d-0ce95922fd6c', '204e4887-0af6-4908-add0-240ea380a53b', 'Finished Goods', 0, 7.50, 18.00, NULL, 1, 1, 'user1', '2026-01-18 12:06:48', 'user1', '2026-01-31 10:59:13', 1),
('fa1b188a-c075-4b90-bbea-37e3733f50bb', 'user1', 'DP-002', 'DP-002', 'DP-002', 'Powder Milk', 'Powder Milk', '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 1, '22b30ed6-ee7a-421d-a9a3-dc6c710b9229', '3ed137d4-3863-407a-8f4a-dd1000479780', 'Finished Goods', 1, 5.00, 18.00, NULL, 1, 1, 'user1', '2026-01-18 11:52:20', 'user1', '2026-01-31 14:17:25', 1);

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
('024a6dbf-85cb-48d6-91e0-41f4b977bcd4', 'user1', 'Ml', 'Volume', 1, 'user1', '2026-01-18 12:07:30', 'user1', '2026-01-31 10:11:36', 1),
('1f240f2c-50ab-407f-b77d-0ce95922fd6c', 'user1', 'Ltr', 'Volume', 1, 'user1', '2026-01-11 04:40:38', 'user1', '2026-01-31 10:11:36', 1),
('2276a903-fc68-4c43-8448-8ceab9aee99d', 'user1', 'Bulk', 'Mass', 1, 'user1', '2026-01-12 06:39:04', 'user1', '2026-01-31 10:11:36', 1),
('22b30ed6-ee7a-421d-a9a3-dc6c710b9229', 'user1', 'Kg', 'Weight', 1, 'user1', '2026-01-11 04:43:41', 'user1', '2026-01-31 10:11:36', 1),
('2993fee8-3e34-4e2e-8cb9-63461934a6ef', 'user1', 'Inch', 'Length', 1, 'user1', '2026-01-14 08:34:51', 'user1', '2026-01-31 10:11:36', 1),
('324249dc-432a-44b8-8191-cb1bfe2ad530', 'user1', 'Ton', 'Weight', 1, 'user1', '2026-01-14 08:33:44', 'user1', '2026-01-31 10:11:36', 1),
('344eb4c8-48c4-475b-b74c-307a0e492622', 'user1', 'Pcs', 'Countable', 1, 'user1', '2026-01-11 04:40:18', 'user1', '2026-01-31 10:11:36', 1),
('50d3582c-909a-4818-afd7-54a8db8c1a44', 'user1', 'Pack', 'Countable', 1, 'user1', '2026-01-11 04:40:31', 'user1', '2026-01-31 10:11:36', 1),
('53640e3f-20b8-44a6-8872-5844630bfed0', 'user1', 'Gal', 'Volume', 1, 'user1', '2026-01-14 08:34:28', 'user1', '2026-01-31 10:11:36', 1),
('61accd0f-ebd7-4c2c-9e33-ba5f92e091d1', 'user1', 'Dzn', 'Countable', 1, 'user1', '2026-01-11 04:40:57', 'user1', '2026-01-31 10:11:36', 1),
('674e6bee-5066-415a-9f35-b6e72f978a08', 'user1', 'Yard', 'Length', 1, 'user1', '2026-01-11 04:43:59', 'user1', '2026-01-31 10:11:36', 1),
('78a63632-6a35-49ab-8cac-4b5c0d4fb418', 'user1', 'Box', 'Countable', 1, 'user1', '2026-01-11 04:40:52', 'user1', '2026-01-31 10:11:36', 1),
('9233b04b-3367-4205-9b3c-bb569e1bebb6', 'user1', 'Inch', 'Length', 1, 'user1', '2026-01-14 08:34:34', 'user1', '2026-01-31 10:11:36', 1),
('a08ee30c-cb3d-467c-aff6-d347c74c9e8b', 'user1', 'Cm', 'Length', 1, 'user1', '2026-01-14 08:34:39', 'user1', '2026-01-31 10:11:36', 1),
('abc985a3-68b1-4b98-825b-ebe79903d033', 'user1', 'Bottle', 'Countable', 1, 'user1', '2026-01-14 08:33:58', 'user1', '2026-01-31 10:11:36', 1),
('c1ab2f8e-5030-40a4-85a3-569ad7cc6dd7', 'user1', 'Cage', 'Countable', 1, 'user1', '2026-01-14 08:34:18', 'user1', '2026-01-31 10:11:36', 1),
('cdd3a6c9-d31b-4a41-8762-69700e2a1108', 'user1', 'Ctn', 'Countable', 1, 'user1', '2026-01-11 04:40:23', 'user1', '2026-01-31 10:11:36', 1),
('f13c1fb3-3493-4640-9b13-02bd824b4977', 'user1', 'Gm', 'Weight', 1, 'user1', '2026-01-14 08:33:32', 'user1', '2026-01-31 10:11:36', 1),
('f2fa8d7c-69d4-439d-9dea-66fba7aac17b', 'user1', 'Bag', 'Mass', 1, 'user1', '2026-01-14 08:34:10', 'user1', '2026-01-31 10:11:36', 1),
('f5ccd3c1-fd1e-4f0e-93be-59dd878c881a', 'user1', 'Poly', 'Countable', 1, 'user1', '2026-01-14 08:25:05', 'user1', '2026-01-31 10:11:36', 1),
('f5d78785-c08b-46b7-a77f-dcf1a8700dd0', 'user1', 'Crate', 'Mass', 1, 'user1', '2026-01-14 08:33:25', 'user1', '2026-01-31 10:11:36', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmib_mtrsf`
--

CREATE TABLE `tmib_mtrsf` (
  `id` varchar(50) NOT NULL,
  `mtrsf_users` varchar(50) NOT NULL,
  `mtrsf_bsins` varchar(50) NOT NULL,
  `mtrsf_bsins_to` varchar(50) NOT NULL,
  `mtrsf_trnno` varchar(50) NOT NULL,
  `mtrsf_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mtrsf_refno` varchar(50) DEFAULT NULL,
  `mtrsf_trnte` varchar(100) DEFAULT NULL,
  `mtrsf_odamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mtrsf_excst` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mtrsf_ttamt` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `mtrsf_ispst` tinyint(1) NOT NULL DEFAULT 0,
  `mtrsf_isrcv` tinyint(1) NOT NULL DEFAULT 0,
  `mtrsf_rcusr` varchar(50) DEFAULT NULL,
  `mtrsf_rcdat` datetime DEFAULT NULL,
  `mtrsf_actve` tinyint(1) NOT NULL DEFAULT 1,
  `mtrsf_crusr` varchar(50) NOT NULL,
  `mtrsf_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mtrsf_upusr` varchar(50) NOT NULL,
  `mtrsf_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mtrsf_rvnmr` int(11) NOT NULL DEFAULT 1
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
('1ec155a7-40b9-428a-af89-c645a39ba92a', 'e88946ca-dc18-4691-b746-1daad2ee3cc5', '1248204a-e407-4245-8952-924a1f832354', '4b019cba-eda8-4ad3-a8ac-ece0e6478ffe', 45.000000, 100.000000, 4500.000000, 0.000000, 0.000000, 10.000000, 450.000000, 49.500000, 4950.000000, '', '{}', 0.000000, 0.000000, 100.000000, 1, 'user1', '2026-02-16 04:49:28', 'user1', '2026-02-16 04:49:28', 1),
('7768a67d-225c-4f18-a98f-ee47689f8627', '5534e810-94d1-4fd9-a4ed-1b3c80ccbc56', 'f241e3b7-3f83-42f4-ac10-af8def91799a', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 55.000000, 100.000000, 5500.000000, 0.000000, 0.000000, 5.000000, 275.000000, 55.000000, 5775.000000, '', '{}', 0.000000, 100.000000, 0.000000, 1, 'user1', '2026-02-14 09:00:10', 'user1', '2026-02-15 11:08:22', 1),
('8ff51565-1efa-4065-b78e-c5e6a8f29b6e', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', '2188dcd0-244b-4750-ad51-f86397b196f1', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 25.000000, 100.000000, 2500.000000, 0.000000, 0.000000, 0.000000, 0.000000, 25.000000, 2500.000000, '', '{}', 0.000000, 100.000000, 0.000000, 1, 'user1', '2026-02-15 08:26:28', 'user1', '2026-02-15 11:08:35', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmpb_cinvc`
--

CREATE TABLE `tmpb_cinvc` (
  `id` varchar(50) NOT NULL,
  `cinvc_minvc` varchar(50) NOT NULL,
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
  `cinvc_attrb` varchar(300) DEFAULT NULL,
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

--
-- Dumping data for table `tmpb_cinvc`
--

INSERT INTO `tmpb_cinvc` (`id`, `cinvc_minvc`, `cinvc_bitem`, `cinvc_items`, `cinvc_itrat`, `cinvc_itqty`, `cinvc_itamt`, `cinvc_dspct`, `cinvc_dsamt`, `cinvc_vtpct`, `cinvc_vtamt`, `cinvc_csrat`, `cinvc_ntamt`, `cinvc_notes`, `cinvc_attrb`, `cinvc_rtqty`, `cinvc_slqty`, `cinvc_ohqty`, `cinvc_actve`, `cinvc_crusr`, `cinvc_crdat`, `cinvc_upusr`, `cinvc_updat`, `cinvc_rvnmr`) VALUES
('2c5b4c35-1aee-44a7-9865-f02472a7ceb3', 'b75b9ebe-7f90-4711-9751-09101930b204', '9a04c7bb-e9d8-4adf-8eff-1fe92e43c971', 'fa1b188a-c075-4b90-bbea-37e3733f50bb', 750.000000, 1.000000, 750.000000, 0.000000, 0.000000, 5.000000, 37.500000, 750.000000, 787.500000, '', '{\"Size\":\"1Kg\"}', 0.000000, 1.000000, 0.000000, 1, 'user1', '2026-02-14 09:02:25', 'user1', '2026-02-15 07:45:02', 1);

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
('07f98ded-2ffc-4da4-9190-b1881a0ea6d2', '28b5a0c0-94a4-40ea-9acc-2ed21d5a7414', 'f241e3b7-3f83-42f4-ac10-af8def91799a', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 55.000000, 10.000000, 550.000000, 0.000000, 0.000000, 5.000000, 27.500000, 57.750000, 577.500000, '', '{}', 0.000000, 0.000000, 10.000000, '7768a67d-225c-4f18-a98f-ee47689f8627', 1, 'user1', '2026-02-14 09:00:29', 'user1', '2026-02-14 09:00:29', 1),
('1d33a51b-6897-4510-9d79-92fbe144131a', 'e95c4fc1-64dc-4c40-8df5-b5ff3da43b9f', 'f241e3b7-3f83-42f4-ac10-af8def91799a', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 55.000000, 90.000000, 5500.000000, 0.000000, 0.000000, 5.000000, 275.000000, 55.000000, 5775.000000, '', '{}', 0.000000, 0.000000, 90.000000, '7768a67d-225c-4f18-a98f-ee47689f8627', 1, 'user1', '2026-02-15 11:08:22', 'user1', '2026-02-15 11:08:22', 1),
('3107a9c2-51fe-4e61-b95f-70d6330b15ba', '0046b8f7-53fe-4a0c-9613-aefc522cfc8d', '2188dcd0-244b-4750-ad51-f86397b196f1', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 25.000000, 100.000000, 2500.000000, 0.000000, 0.000000, 0.000000, 0.000000, 25.000000, 2500.000000, '', '{}', 0.000000, 0.000000, 100.000000, '8ff51565-1efa-4065-b78e-c5e6a8f29b6e', 1, 'user1', '2026-02-15 11:08:35', 'user1', '2026-02-15 11:08:35', 1);

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
  `expns_trdat` date NOT NULL DEFAULT current_timestamp(),
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
('5534e810-94d1-4fd9-a4ed-1b3c80ccbc56', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PB-140226-00001', '2026-02-14 00:00:00', '', '', 5500.000000, 0.000000, 275.000000, 1, 0.000000, 0.000000, 0.000000, 5775.000000, 5775.000000, 5775.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-14 09:00:10', 'user1', '2026-02-15 09:45:47', 1),
('ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'PB-150226-00001', '2026-02-15 00:00:00', '', '', 2500.000000, 0.000000, 0.000000, 1, 0.000000, 0.000000, 0.000000, 2500.000000, 2500.000000, 2500.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-15 08:26:28', 'user1', '2026-02-15 09:45:47', 1),
('e88946ca-dc18-4691-b746-1daad2ee3cc5', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PB-160226-00001', '2026-02-16 00:00:00', '', '', 4500.000000, 0.000000, 450.000000, 1, 0.000000, 0.000000, 0.000000, 4950.000000, 4950.000000, 0.000000, 4950.000000, 0.000000, 0, 1, 0, 0, 0, 1, 'user1', '2026-02-16 04:49:28', 'user1', '2026-02-16 04:49:28', 1);

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

--
-- Dumping data for table `tmpb_minvc`
--

INSERT INTO `tmpb_minvc` (`id`, `minvc_users`, `minvc_bsins`, `minvc_cntct`, `minvc_trnno`, `minvc_trdat`, `minvc_refno`, `minvc_trnte`, `minvc_odamt`, `minvc_dsamt`, `minvc_vtamt`, `minvc_vatpy`, `minvc_incst`, `minvc_excst`, `minvc_rnamt`, `minvc_ttamt`, `minvc_pyamt`, `minvc_pdamt`, `minvc_duamt`, `minvc_rtamt`, `minvc_ispad`, `minvc_ispst`, `minvc_iscls`, `minvc_vatcl`, `minvc_hscnl`, `minvc_actve`, `minvc_crusr`, `minvc_crdat`, `minvc_upusr`, `minvc_updat`, `minvc_rvnmr`) VALUES
('b75b9ebe-7f90-4711-9751-09101930b204', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PI-140226-00001', '2026-02-14 00:00:00', '', '', 750.000000, 0.000000, 37.500000, 1, 0.000000, 0.000000, 0.000000, 787.500000, 787.500000, 788.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-14 09:02:25', 'user1', '2026-02-14 09:02:25', 1);

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
('0046b8f7-53fe-4a0c-9613-aefc522cfc8d', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'PR-150226-00002', '2026-02-15 00:00:00', '', '', 2500.000000, 0.000000, 0.000000, 1, 0.000000, 0.000000, 0.000000, 2500.000000, 2500.000000, 2500.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-15 11:08:35', 'user1', '2026-02-15 11:08:35', 1),
('28b5a0c0-94a4-40ea-9acc-2ed21d5a7414', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PR-140226-00001', '2026-02-14 00:00:00', '', '', 550.000000, 0.000000, 27.500000, 1, 0.000000, 0.000000, 0.000000, 577.500000, 577.500000, 577.500000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-14 09:00:29', 'user1', '2026-02-14 09:00:29', 1),
('e95c4fc1-64dc-4c40-8df5-b5ff3da43b9f', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PR-150226-00001', '2026-02-15 00:00:00', '', '', 4950.000000, 0.000000, 275.000000, 1, 0.000000, 0.000000, 0.000000, 5225.000000, 5225.000000, 5225.000000, 0.000000, 0.000000, 1, 1, 0, 0, 0, 1, 'user1', '2026-02-15 11:08:22', 'user1', '2026-02-15 11:08:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_bsins`
--

CREATE TABLE `tmsb_bsins` (
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
  `bsins_bstyp` varchar(50) DEFAULT NULL,
  `bsins_tstrn` tinyint(1) NOT NULL DEFAULT 1,
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
-- Dumping data for table `tmsb_bsins`
--

INSERT INTO `tmsb_bsins` (`id`, `bsins_users`, `bsins_bname`, `bsins_addrs`, `bsins_email`, `bsins_cntct`, `bsins_image`, `bsins_binno`, `bsins_btags`, `bsins_cntry`, `bsins_bstyp`, `bsins_tstrn`, `bsins_prtrn`, `bsins_sltrn`, `bsins_stdat`, `bsins_pbviw`, `bsins_actve`, `bsins_crusr`, `bsins_crdat`, `bsins_upusr`, `bsins_updat`, `bsins_rvnmr`) VALUES
('business1', 'user1', 'Green Mart – Uttara', 'Sector 10, Uttara, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'GT-9872-6871-5555', 'Retail', 'Bangladesh', 'Store', 1, 1, 1, '2026-01-31 00:00:00', 0, 1, 'user1', '2026-01-31 08:03:14', 'user1', '2026-01-31 09:28:38', 6),
('business2', 'user1', 'White Mart – Dhanmondi', 'Road 27, Dhanmondi, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'CT2025-0978-22364', 'Retail', 'Bangladesh', 'Store', 1, 1, 1, '2026-01-31 00:00:00', 0, 1, 'user1', '2026-01-31 08:03:14', 'user1', '2026-01-31 09:28:40', 3),
('business3', 'user1', 'Red Mart - Badda', 'Uttar Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'CT2025-0978-22364', 'Retail', 'Bangladesh', 'Store', 1, 1, 1, '2026-01-31 00:00:00', 0, 1, 'user1', '2026-01-31 08:03:14', 'user1', '2026-01-31 09:28:42', 3),
('business4', 'user1', 'Central Distribution Warehouse', 'Uttar Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'CT2025-0978-22364', 'Retail', 'Bangladesh', 'Warehouse', 1, 1, 1, '2026-01-31 00:00:00', 0, 1, 'user1', '2026-01-31 08:03:14', 'user1', '2026-01-31 09:28:43', 7);

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
('e0bdba06-a4d9-4010-90dc-ab4d433cb413', 'u1', 'b1', 'tmsb_crgrn', 'Registration', 'My Shop BD', 0.000000, 1000.000000, '2026-01-31 08:03:14', '2026-01-31 08:03:14', 1, 'u1', '2026-01-31 08:03:14', 'u1', '2026-01-31 08:04:27', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_mdule`
--

CREATE TABLE `tmsb_mdule` (
  `id` varchar(50) NOT NULL,
  `mdule_mname` varchar(50) NOT NULL,
  `mdule_pname` varchar(50) NOT NULL,
  `mdule_micon` varchar(50) DEFAULT NULL,
  `mdule_color` varchar(50) DEFAULT NULL,
  `mdule_notes` varchar(50) DEFAULT NULL,
  `mdule_odrby` int(11) NOT NULL DEFAULT 0,
  `mdule_actve` tinyint(1) NOT NULL DEFAULT 1,
  `mdule_crusr` varchar(50) NOT NULL,
  `mdule_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `mdule_upusr` varchar(50) NOT NULL,
  `mdule_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mdule_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmsb_mdule`
--

INSERT INTO `tmsb_mdule` (`id`, `mdule_mname`, `mdule_pname`, `mdule_micon`, `mdule_color`, `mdule_notes`, `mdule_odrby`, `mdule_actve`, `mdule_crusr`, `mdule_crdat`, `mdule_upusr`, `mdule_updat`, `mdule_rvnmr`) VALUES
('accounts', 'Accounts', 'basic', 'pi-wallet', 'bg-teal-500', NULL, 1, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-03 06:16:02', 1),
('crm', 'CRM', 'basic', 'pi-phone', 'bg-purple-500', NULL, 2, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-03 06:16:05', 1),
('hrms', 'HRMS', 'basic', 'pi-address-book', 'bg-green-500', NULL, 3, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-03 08:23:33', 1),
('reports', 'Reports', 'basic', 'pi-file', 'bg-cyan-500', NULL, 6, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-16 05:41:49', 1),
('setup', 'Setup', 'basic', 'pi-cog', 'bg-gray-500', NULL, 5, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-03 08:23:48', 1),
('shop', 'Shop', 'basic', 'pi-home', 'bg-orange-500', NULL, 4, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-03 06:16:17', 1),
('support', 'Support', 'basic', 'pi-question-circle', 'bg-blue-500', NULL, 6, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-03 06:18:44', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_menus`
--

CREATE TABLE `tmsb_menus` (
  `id` varchar(50) NOT NULL,
  `menus_mdule` varchar(50) NOT NULL,
  `menus_gname` varchar(50) NOT NULL,
  `menus_gicon` varchar(50) NOT NULL,
  `menus_mname` varchar(50) NOT NULL,
  `menus_pname` varchar(50) DEFAULT NULL,
  `menus_micon` varchar(50) DEFAULT NULL,
  `menus_mlink` varchar(255) DEFAULT NULL,
  `menus_notes` varchar(255) DEFAULT NULL,
  `menus_odrby` int(11) NOT NULL DEFAULT 0,
  `menus_actve` tinyint(1) NOT NULL DEFAULT 1,
  `menus_crusr` varchar(50) NOT NULL,
  `menus_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `menus_upusr` varchar(50) NOT NULL,
  `menus_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `menus_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmsb_menus`
--

INSERT INTO `tmsb_menus` (`id`, `menus_mdule`, `menus_gname`, `menus_gicon`, `menus_mname`, `menus_pname`, `menus_micon`, `menus_mlink`, `menus_notes`, `menus_odrby`, `menus_actve`, `menus_crusr`, `menus_crdat`, `menus_upusr`, `menus_updat`, `menus_rvnmr`) VALUES
('accounts-accounts', 'accounts', 'Accounts', 'pi pi-money-bill', 'Accounts', 'basic', 'pi pi-money-bill', '/home/accounts/accounts', NULL, 711, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:32:01', 1),
('accounts-expenses', 'accounts', 'Transactions', 'pi pi-folder-plus', 'Expenses', 'basic', 'pi pi-money-bill', '/home/accounts/expenses', NULL, 703, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:32:21', 1),
('accounts-heads', 'accounts', 'Accounts', 'pi pi-money-bill', 'Heads', 'basic', 'pi pi-objects-column', '/home/accounts/heads', NULL, 710, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:31:49', 1),
('accounts-ledger', 'accounts', 'Transactions', 'pi pi-folder-plus', 'Ledger', 'basic', 'pi pi-arrow-right-arrow-left', '/home/accounts/ledger', NULL, 700, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:32:06', 1),
('accounts-payables', 'accounts', 'Transactions', 'pi pi-folder-plus', 'Payables', 'basic', 'pi pi-money-bill', '/home/accounts/payables', NULL, 701, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:32:13', 1),
('accounts-receivables', 'accounts', 'Transactions', 'pi pi-folder-plus', 'Receivables', 'basic', 'pi pi-money-bill', '/home/accounts/receivables', NULL, 702, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:32:18', 1),
('crm-contacts', 'crm', 'CRM', 'pi pi-address-book', 'Contacts', 'basic', 'pi pi-id-card', '/home/crm/contact', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:11:05', 1),
('crm-delivery-van', 'crm', 'CRM', 'pi pi-address-book', 'Delivery Van', 'basic', 'pi pi-truck', '/home/crm/delivery-van', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-19 08:33:32', 1),
('crm-dzone', 'crm', 'Territory', 'pi pi-address-book', 'Zone', 'basic', 'pi pi-id-card', '/home/crm/dzone', NULL, 4, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-22 07:11:01', 1),
('crm-order-route', 'crm', 'Territory', 'pi pi-address-book', 'Routes', 'basic', 'pi pi-directions', '/home/crm/order-route', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-18 08:40:19', 1),
('crm-tarea', 'crm', 'Territory', 'pi pi-address-book', 'Area', 'basic', 'pi pi-id-card', '/home/crm/tarea', NULL, 3, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-22 07:33:20', 1),
('crm-territory', 'crm', 'Territory', 'pi pi-address-book', 'Territory', 'basic', 'pi pi-id-card', '/home/crm/territory', NULL, 2, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-18 08:23:31', 1),
('hrms-employees', 'hrms', 'Employee', 'pi pi-users', 'Employee', 'basic', 'pi pi-user', '/home/hrms/employees', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:24:23', 1),
('inventory-category', 'shop', 'Inventory', 'pi pi-box', 'Category', 'basic', 'pi pi-list-check', '/home/inventory/category', NULL, 321, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:30:30', 1),
('inventory-product', 'shop', 'Inventory', 'pi pi-box', 'Product', 'basic', 'pi pi-box', '/home/inventory/products', NULL, 300, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:29:53', 1),
('inventory-stock-transfer', 'shop', 'Inventory', 'pi pi-box', 'Stock Transfer', 'basic', 'pi pi-arrow-right-arrow-left', '/home/inventory/itransfer', NULL, 302, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:30:05', 1),
('inventory-tracking-stock', 'shop', 'Inventory', 'pi pi-box', 'Tracking Stock', 'basic', 'pi pi-file', '/home/inventory/stockreports', NULL, 301, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:30:01', 1),
('inventory-unit', 'shop', 'Inventory', 'pi pi-box', 'Unit', 'basic', 'pi pi-tags', '/home/inventory/unit', NULL, 320, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:30:12', 1),
('purchase-booking', 'shop', 'Purchase', 'pi pi-shopping-cart', 'Booking', 'basic', 'pi pi-check-square', '/home/purchase/pbooking', NULL, 200, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:29:03', 1),
('purchase-invoice', 'shop', 'Purchase', 'pi pi-shopping-cart', 'Invoice', 'basic', 'pi pi-file-edit', '/home/purchase/pinvoice', NULL, 202, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:29:21', 1),
('purchase-receipt', 'shop', 'Purchase', 'pi pi-shopping-cart', 'Receipt', 'basic', 'pi pi-receipt', '/home/purchase/preceipt', NULL, 201, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:29:16', 1),
('reports-dashboard', 'reports', 'Shop', 'pi pi-box', 'Summary', 'basic', 'pi pi-tags', '/home/reports/shop', NULL, 320, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:30:12', 1),
('sales-booking', 'shop', 'Sales', 'pi pi-shopping-cart', 'Booking', 'basic', 'pi pi-check-square', '/home/sales/sbooking', NULL, 100, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-15 07:51:07', 1),
('sales-invoice', 'shop', 'Sales', 'pi pi-shopping-bag', 'Invoice', 'basic', 'pi pi-file-edit', '/home/sales/sinvoice', NULL, 102, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-15 07:51:03', 1),
('sales-receipt', 'shop', 'Sales', 'pi pi-shopping-cart', 'Receipt', 'basic', 'pi pi-receipt', '/home/sales/sreceipt', NULL, 101, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:29:16', 1),
('setup-business', 'setup', 'Business', 'pi pi-cog', 'Business', 'basic', 'pi pi-shop', '/home/setup/business', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:11:05', 1),
('setup-database', 'setup', 'Database', 'pi pi-database', 'Backup', 'basic', 'pi pi-save', '/home/setup/database', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:27:53', 1),
('setup-default-data', 'setup', 'Business', 'pi pi-cog', 'Default Data', 'basic', 'pi pi-list', '/home/setup/default-data', '', 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:11:05', 1),
('setup-users', 'setup', 'Business', 'pi pi-cog', 'Users', 'basic', 'pi pi-users', '/home/setup/users', NULL, 1, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-03 08:11:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_ucnfg`
--

CREATE TABLE `tmsb_ucnfg` (
  `id` varchar(50) NOT NULL,
  `ucnfg_users` varchar(50) NOT NULL,
  `ucnfg_bsins` varchar(50) NOT NULL,
  `ucnfg_cname` varchar(50) DEFAULT NULL,
  `ucnfg_gname` varchar(50) DEFAULT NULL,
  `ucnfg_label` varchar(50) DEFAULT NULL,
  `ucnfg_value` varchar(50) DEFAULT NULL,
  `ucnfg_notes` varchar(50) DEFAULT NULL,
  `ucnfg_actve` tinyint(1) NOT NULL DEFAULT 1,
  `ucnfg_crusr` varchar(50) NOT NULL,
  `ucnfg_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ucnfg_upusr` varchar(50) NOT NULL,
  `ucnfg_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ucnfg_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmsb_ucnfg`
--

INSERT INTO `tmsb_ucnfg` (`id`, `ucnfg_users`, `ucnfg_bsins`, `ucnfg_cname`, `ucnfg_gname`, `ucnfg_label`, `ucnfg_value`, `ucnfg_notes`, `ucnfg_actve`, `ucnfg_crusr`, `ucnfg_crdat`, `ucnfg_upusr`, `ucnfg_updat`, `ucnfg_rvnmr`) VALUES
('c1', 'user1', 'business1', 'Purchase', 'Booking', 'mbkng_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 11:32:36', 13),
('c10', 'user1', 'business1', 'Purchase', 'Invoice', 'cinvc_vtpct', '1', 'Product VAT %', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-16 12:44:39', 17),
('c11', 'user1', 'business1', 'Purchase', 'Invoice', 'cinvc_dspct', '1', 'Product Discount %', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 12:44:46', 13),
('c12', 'user1', 'business1', 'Sales', 'Booking', 'cbkng_dspct', '1', 'Product Discount %', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-17 01:55:55', 21),
('c13', 'user1', 'business1', 'Sales', 'Booking', 'cbkng_vtpct', '1', 'Product VAT %', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-16 12:01:25', 21),
('c14', 'user1', 'business1', 'Sales', 'Booking', 'mbkng_ispst', '1', 'Posted Checked', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-17 11:06:55', 25),
('c15', 'user1', 'business1', 'Sales', 'Booking', 'mbkng_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-17 01:56:07', 13),
('c16', 'user1', 'business1', 'Sales', 'Booking', 'nostock_0_stock_1', '1', 'All Items (Unchecked) Only Stock (Checked)', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-17 12:22:51', 47),
('c17', 'user1', 'business1', 'Sales', 'Booking', 'dprat_0_mcmrp_1', '1', 'DP (Unchecked) MRP (Checked)', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-17 11:07:55', 47),
('c2', 'user1', 'business1', 'Purchase', 'Booking', 'mbkng_ispst', '1', 'Posted Checked', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-16 12:00:07', 17),
('c3', 'user1', 'business1', 'Purchase', 'Receipt', 'mrcpt_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 11:32:22', 9),
('c4', 'user1', 'business1', 'Sales', 'Invoice', 'minvc_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 12:34:26', 29),
('c5', 'user1', 'business1', 'Sales', 'Invoice', 'minvc_ispst', '1', 'Posted Checked', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 12:35:53', 23),
('c6', 'user1', 'business1', 'Purchase', 'Invoice', 'minvc_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 11:37:43', 11),
('c7', 'user1', 'business1', 'Purchase', 'Invoice', 'minvc_ispst', '1', 'Posted Checked', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-14 12:35:55', 17),
('c8', 'user1', 'business1', 'Purchase', 'Booking', 'cbkng_dspct', '1', 'Product Discount %', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-16 12:00:49', 17),
('c9', 'user1', 'business1', 'Purchase', 'Booking', 'cbkng_vtpct', '1', 'Product VAT %', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-16 12:01:25', 21);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_users`
--

CREATE TABLE `tmsb_users` (
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
-- Dumping data for table `tmsb_users`
--

INSERT INTO `tmsb_users` (`id`, `users_email`, `users_pswrd`, `users_recky`, `users_oname`, `users_cntct`, `users_bsins`, `users_drole`, `users_users`, `users_stats`, `users_regno`, `users_regdt`, `users_ltokn`, `users_lstgn`, `users_lstpd`, `users_wctxt`, `users_notes`, `users_nofcr`, `users_isrgs`, `users_actve`, `users_crusr`, `users_crdat`, `users_upusr`, `users_updat`, `users_rvnmr`) VALUES
('user1', 'admin@sgd.com', 'password', 'recover', 'Admin', '01722688266', 'business1', 'Admin', 'user1', 0, 'Standard', '2026-01-31 08:03:14', NULL, '2026-01-31 08:03:14', '2026-01-31 09:43:39', 'Welcome Note', 'User Note', 1000.00, 1, 1, 'u1', '2026-01-31 08:03:14', 'user1', '2026-01-31 09:43:48', 5),
('user2', 'user@sgd.com', 'password', 'recover', 'Common User', '01722688266', 'business1', 'Admin', 'user1', 0, 'Standard', '2026-01-31 09:29:44', NULL, '2026-01-31 09:29:44', '2026-01-31 09:29:44', 'Welcome Note', 'User Note', 0.00, 0, 1, 'user1', '2026-01-31 09:29:44', 'user1', '2026-01-31 09:35:42', 1);

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
('322544db-ccf2-4326-94ea-c92325654f99', 'user1', 'business1', 'Z901', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'rent-5656', '', 1500.000000, 0.000000, 'user1', '2026-01-10 08:17:42', 'user1', '2026-02-03 08:47:59', 1),
('3ddc69c4-c35d-4131-bf89-6af78de59c4f', 'user1', 'business1', 'Z701', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-17 00:00:00', '#Cash Excess', '', 0.000000, 365.000000, 'user1', '2026-01-17 06:39:45', 'user1', '2026-02-03 08:47:59', 1),
('57635f84-7cae-4a10-8927-cd34447800de', 'user1', 'business1', 'Z904', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'nov', '', 500.000000, 0.000000, 'user1', '2026-01-10 08:19:11', 'user1', '2026-02-03 08:47:59', 1),
('5bb72d2a-7ef7-42c3-a12d-17ea7e874344', 'user1', 'business1', 'Z702', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', 'cash investment', '', 0.000000, 25000.000000, 'user1', '2026-01-10 08:16:12', 'user1', '2026-02-03 08:47:59', 1),
('665b8fac-564b-470a-a922-4c484bfe1474', 'user1', 'business1', 'Z602', 'internal', '14bc4749-859b-46aa-aa67-29b926f88083', 'Bank', '2026-01-10 00:00:00', 'transfer', '', 0.000000, 5000.000000, 'user1', '2026-01-10 08:16:47', 'user1', '2026-02-03 08:47:59', 1),
('6bf954fd-fea2-4898-9821-48874ac98e4d', 'user1', 'business1', 'Z903', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'MFS', '2026-01-10 00:00:00', 'nov', '', 500.000000, 0.000000, 'user1', '2026-01-10 08:18:22', 'user1', '2026-02-03 08:47:59', 1),
('8cddba78-957f-4745-b9fd-e5d2381222f0', 'user1', 'business1', 'Z1002', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-17 00:00:00', 'scap sales', '', 0.000000, 5600.000000, 'user1', '2026-01-17 06:43:49', 'user1', '2026-02-03 08:47:59', 1),
('efaade64-7c50-4fe7-b1d3-f033622e800d', 'user1', 'business1', 'Z601', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Bank', '2026-01-10 00:00:00', 'transfer', '', 5000.000000, 0.000000, 'user1', '2026-01-10 08:16:47', 'user1', '2026-02-03 08:47:59', 1);

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
('094a82f8-af65-4518-8a6c-7d7064f990b0', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Payment', '0046b8f7-53fe-4a0c-9613-aefc522cfc8d', 'PR-150226-00002', 'Purchase Receipt', '2026-02-15 00:00:00', 'Supplier Payment', 'Payment', 2500.000000, 0.000000, 'user1', '2026-02-15 11:08:35', 'user1', '2026-02-15 11:08:35', 1),
('0b0bd913-b1e7-43e9-95d3-f902425733f4', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Payment', 'e95c4fc1-64dc-4c40-8df5-b5ff3da43b9f', 'PR-150226-00001', 'Purchase Receipt', '2026-02-15 00:00:00', 'Supplier Payment', 'Payment', 5225.000000, 0.000000, 'user1', '2026-02-15 11:08:22', 'user1', '2026-02-15 11:08:22', 1),
('0e782a40-faf6-442e-a20b-74f2a5ec84d0', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Cash', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'PB-150226-00001', 'Purchase Booking', '2026-02-15 00:00:00', '', 'Payment', 150.000000, 0.000000, 'user1', '2026-02-15 09:41:41', 'user1', '2026-02-15 09:41:41', 1),
('0fa3af6c-63d2-4d1a-9812-5e6a526cf7d0', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Cash', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'PB-150226-00001', 'Purchase Booking', '2026-02-15 00:00:00', '', 'Payment', 150.000000, 0.000000, 'user1', '2026-02-15 09:41:22', 'user1', '2026-02-15 09:41:22', 1),
('177412d7-7bd5-48cf-8776-eefbe7cabdd6', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Cash', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'PB-150226-00001', 'Purchase Booking', '2026-02-15 00:00:00', '', 'Payment', 200.000000, 0.000000, 'user1', '2026-02-15 09:37:31', 'user1', '2026-02-15 09:37:31', 1),
('2750a352-6480-48d8-a8d0-758f2e140fd3', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '5534e810-94d1-4fd9-a4ed-1b3c80ccbc56', 'PB-140226-00001', 'Purchase Booking', '2026-02-14 00:00:00', 'Supplier Goods', 'Products', 0.000000, 5775.000000, 'user1', '2026-02-14 09:00:10', 'user1', '2026-02-14 09:00:10', 1),
('40d73c82-1976-46a9-9f2e-d85927add62e', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '28b5a0c0-94a4-40ea-9acc-2ed21d5a7414', 'PR-140226-00001', 'Purchase Receipt', '2026-02-14 00:00:00', 'Supplier Goods', 'Products', 0.000000, 577.500000, 'user1', '2026-02-14 09:00:29', 'user1', '2026-02-14 09:00:29', 1),
('44da3f73-ff71-425c-b269-989ccde90a92', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', 'e95c4fc1-64dc-4c40-8df5-b5ff3da43b9f', 'PR-150226-00001', 'Purchase Receipt', '2026-02-15 00:00:00', 'Supplier Goods', 'Products', 0.000000, 5225.000000, 'user1', '2026-02-15 11:08:22', 'user1', '2026-02-15 11:08:22', 1),
('73a0d2df-188c-4614-a8e7-b4772a8a82b5', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Payment', '28b5a0c0-94a4-40ea-9acc-2ed21d5a7414', 'PR-140226-00001', 'Purchase Receipt', '2026-02-14 00:00:00', 'Supplier Payment', 'Payment', 577.500000, 0.000000, 'user1', '2026-02-14 09:00:29', 'user1', '2026-02-14 09:00:29', 1),
('908abc03-fbb4-4dcf-b2bd-fe839977e5d3', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Inventory', '0046b8f7-53fe-4a0c-9613-aefc522cfc8d', 'PR-150226-00002', 'Purchase Receipt', '2026-02-15 00:00:00', 'Supplier Goods', 'Products', 0.000000, 2500.000000, 'user1', '2026-02-15 11:08:35', 'user1', '2026-02-15 11:08:35', 1),
('93400c06-4911-4e4d-8f42-1c5fa5cd234a', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', 'b75b9ebe-7f90-4711-9751-09101930b204', 'PI-140226-00001', 'Purchase Invoice', '2026-02-14 00:00:00', '', 'Payment', 788.000000, 0.000000, 'user1', '2026-02-14 09:02:25', 'user1', '2026-02-14 09:02:25', 1),
('a515a4f8-d1be-43c2-a7f0-c9aa3784cea7', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Cash', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'PB-150226-00001', 'Purchase Booking', '2026-02-15 00:00:00', '', 'Payment', 1500.000000, 0.000000, 'user1', '2026-02-15 08:27:43', 'user1', '2026-02-15 08:27:43', 1),
('a91a9e75-5cf7-4702-80e5-ebe1807895a4', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '5534e810-94d1-4fd9-a4ed-1b3c80ccbc56', 'PB-140226-00001', 'Purchase Booking', '2026-02-14 00:00:00', '', 'Payment', 5775.000000, 0.000000, 'user1', '2026-02-14 09:00:10', 'user1', '2026-02-14 09:00:10', 1),
('cdd28769-e71f-4ada-81e9-27c9d1ec6263', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Cash', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'PB-150226-00001', 'Purchase Booking', '2026-02-15 00:00:00', '', 'Payment', 500.000000, 0.000000, 'user1', '2026-02-15 08:44:48', 'user1', '2026-02-15 08:44:48', 1),
('d451346a-4720-44d4-b1e6-9535716b27fb', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', 'e88946ca-dc18-4691-b746-1daad2ee3cc5', 'PB-160226-00001', 'Purchase Booking', '2026-02-16 00:00:00', 'Supplier Goods', 'Products', 0.000000, 4950.000000, 'user1', '2026-02-16 04:49:28', 'user1', '2026-02-16 04:49:28', 1),
('d4ec1084-dd56-414c-9d38-a8803bd9a28d', 'user1', 'business1', '267bb3aa-9177-43d2-8d8b-e0137578cf98', 'Inventory', 'ccc8f811-1974-4140-8ba6-d26e5a6bba34', 'PB-150226-00001', 'Purchase Booking', '2026-02-15 00:00:00', 'Supplier Goods', 'Products', 0.000000, 2500.000000, 'user1', '2026-02-15 08:26:28', 'user1', '2026-02-15 08:26:28', 1),
('eae9cd39-e697-4589-9fbb-5647525339de', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', 'b75b9ebe-7f90-4711-9751-09101930b204', 'PI-140226-00001', 'Purchase Invoice', '2026-02-14 00:00:00', 'Supplier Goods', 'Products', 0.000000, 787.500000, 'user1', '2026-02-14 09:02:25', 'user1', '2026-02-14 09:02:25', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmtb_rcvbl`
--

CREATE TABLE `tmtb_rcvbl` (
  `id` varchar(50) NOT NULL,
  `rcvbl_users` varchar(50) NOT NULL,
  `rcvbl_bsins` varchar(50) NOT NULL,
  `rcvbl_cntct` varchar(50) NOT NULL,
  `rcvbl_pymod` varchar(50) NOT NULL,
  `rcvbl_refid` varchar(50) NOT NULL,
  `rcvbl_refno` varchar(50) NOT NULL,
  `rcvbl_srcnm` varchar(50) NOT NULL,
  `rcvbl_trdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rcvbl_descr` varchar(100) DEFAULT NULL,
  `rcvbl_notes` varchar(50) NOT NULL,
  `rcvbl_dbamt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rcvbl_cramt` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `rcvbl_crusr` varchar(50) NOT NULL,
  `rcvbl_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rcvbl_upusr` varchar(50) NOT NULL,
  `rcvbl_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rcvbl_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tmtb_rcvbl`
--

INSERT INTO `tmtb_rcvbl` (`id`, `rcvbl_users`, `rcvbl_bsins`, `rcvbl_cntct`, `rcvbl_pymod`, `rcvbl_refid`, `rcvbl_refno`, `rcvbl_srcnm`, `rcvbl_trdat`, `rcvbl_descr`, `rcvbl_notes`, `rcvbl_dbamt`, `rcvbl_cramt`, `rcvbl_crusr`, `rcvbl_crdat`, `rcvbl_upusr`, `rcvbl_updat`, `rcvbl_rvnmr`) VALUES
('4e7b7e1b-150b-4f4a-9c2f-21f3150e3742', 'user1', 'business1', '11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'Cash', '6a88d151-6a6e-4e7a-8c19-9b57194d0551', 'SI-150226-00001', 'Sales Invoice', '2026-02-15 00:00:00', '', 'Payment', 500.000000, 0.000000, 'user1', '2026-02-15 10:22:11', 'user1', '2026-02-15 10:22:11', 1),
('55fac060-c50a-47d6-873d-827b91265f8f', 'user1', 'business1', '11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'Inventory', '6a88d151-6a6e-4e7a-8c19-9b57194d0551', 'SI-150226-00001', 'Sales Invoice', '2026-02-15 00:00:00', 'Customer Goods', 'Products', 0.000000, 1391.250000, 'user1', '2026-02-15 07:45:02', 'user1', '2026-02-15 07:45:02', 1),
('738bc43c-82de-428e-af9a-f2619b822a16', 'user1', 'business1', '11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'Cash', '6a88d151-6a6e-4e7a-8c19-9b57194d0551', 'SI-150226-00001', 'Sales Invoice', '2026-02-15 00:00:00', '', 'Payment', 391.000000, 0.000000, 'user1', '2026-02-15 10:21:40', 'user1', '2026-02-15 10:21:40', 1),
('b6e632de-c5ff-46d8-8085-482bfc03feb0', 'user1', 'business1', '11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'Cash', '6a88d151-6a6e-4e7a-8c19-9b57194d0551', 'SI-150226-00001', 'Sales Invoice', '2026-02-15 00:00:00', '', 'Payment', 500.000000, 0.000000, 'user1', '2026-02-15 10:22:44', 'user1', '2026-02-15 10:22:44', 1);

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
('Z1001', 'user1', 'Asset Purchase (-)', 'Asset', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:31', 'user1', '2026-02-03 07:45:56', 1),
('Z1002', 'user1', 'Asset Sale (+)', 'Asset', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:31', 'user1', '2026-02-03 07:45:56', 1),
('Z101', 'user1', 'Sales Booking (+)', 'Sales', 'In', 'Customer', 1, 'user1', '2026-01-10 08:07:18', 'user1', '2026-02-03 07:45:56', 1),
('Z102', 'user1', 'Sales Invoice (+)', 'Sales', 'In', 'Customer', 1, 'user1', '2026-01-10 08:07:18', 'user1', '2026-02-03 07:45:56', 1),
('Z103', 'user1', 'Sales Order (+)', 'Sales', 'In', 'Customer', 1, 'user1', '2026-01-10 08:07:18', 'user1', '2026-02-03 07:45:56', 1),
('Z104', 'user1', 'Sales Return (-)', 'Sales', 'Out', 'Customer', 1, 'user1', '2026-01-10 08:07:18', 'user1', '2026-02-03 07:45:56', 1),
('Z105', 'user1', 'Sales Expense (-)', 'Sales', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:07:18', 'user1', '2026-02-03 07:45:56', 1),
('Z1101', 'user1', 'VAT Payment (-)', 'VAT', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:25', 'user1', '2026-02-03 07:45:56', 1),
('Z1102', 'user1', 'VAT Collection (+)', 'VAT', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:25', 'user1', '2026-02-03 07:45:56', 1),
('Z1201', 'user1', 'Tax Payment (-)', 'Tax', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:18', 'user1', '2026-02-03 07:45:56', 1),
('Z1202', 'user1', 'Tax Receipt (+)', 'Tax', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:18', 'user1', '2026-02-03 07:45:56', 1),
('Z1301', 'user1', 'Salary Payment (-)', 'HR', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:09', 'user1', '2026-02-03 07:45:56', 1),
('Z1302', 'user1', 'Salary Advance Payment (-)', 'HR', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:09', 'user1', '2026-02-03 07:45:56', 1),
('Z1303', 'user1', 'Salary Deduction (+)', 'HR', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:09', 'user1', '2026-02-03 07:45:56', 1),
('Z1304', 'user1', 'Salary Advance Deduction (+)', 'HR', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:09', 'user1', '2026-02-03 07:45:56', 1),
('Z201', 'user1', 'Purchase Booking (-)', 'Purchase', 'Out', 'Supplier', 1, 'user1', '2026-01-10 08:07:11', 'user1', '2026-02-03 07:45:56', 1),
('Z202', 'user1', 'Purchase Invoice (-)', 'Purchase', 'Out', 'Supplier', 1, 'user1', '2026-01-10 08:07:11', 'user1', '2026-02-03 07:45:56', 1),
('Z203', 'user1', 'Purchase Order (-)', 'Purchase', 'Out', 'Supplier', 1, 'user1', '2026-01-10 08:07:11', 'user1', '2026-02-03 07:45:56', 1),
('Z204', 'user1', 'Purchase Return (+)', 'Purchase', 'In', 'Supplier', 1, 'user1', '2026-01-10 08:07:11', 'user1', '2026-02-03 07:45:56', 1),
('Z205', 'user1', 'Purchase Expense (-)', 'Purchase', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:07:11', 'user1', '2026-02-03 07:45:56', 1),
('Z501', 'user1', 'Stock Out (-)', 'Inventory', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:07:05', 'user1', '2026-02-03 07:45:56', 1),
('Z502', 'user1', 'Stock In (+)', 'Inventory', 'In', 'Internal', 1, 'user1', '2026-01-10 08:07:05', 'user1', '2026-02-03 07:45:56', 1),
('Z601', 'user1', 'Transfer Out (-)', 'Transfer', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:58', 'user1', '2026-02-03 07:45:56', 1),
('Z602', 'user1', 'Transfer In (+)', 'Transfer', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:58', 'user1', '2026-02-03 07:45:56', 1),
('Z701', 'user1', 'Gain (+)', 'Income', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:52', 'user1', '2026-02-03 07:45:56', 1),
('Z702', 'user1', 'Investment (+)', 'Income', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:52', 'user1', '2026-02-03 07:45:56', 1),
('Z703', 'user1', 'Bank Profit (+)', 'Income', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:52', 'user1', '2026-02-03 07:45:56', 1),
('Z704', 'user1', 'Bank Loan Received (+)', 'Income', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:52', 'user1', '2026-02-03 07:45:56', 1),
('Z705', 'user1', 'Other Income (+)', 'Income', 'In', 'Internal', 1, 'user1', '2026-01-10 08:06:52', 'user1', '2026-02-03 07:45:56', 1),
('Z801', 'user1', 'Loss (-)', 'Expenditure', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:45', 'user1', '2026-02-03 07:45:56', 1),
('Z802', 'user1', 'Withdrawal (-)', 'Expenditure', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:45', 'user1', '2026-02-03 07:45:56', 1),
('Z803', 'user1', 'Bank Charges (-)', 'Expenditure', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:45', 'user1', '2026-02-03 07:45:56', 1),
('Z804', 'user1', 'Bank Loan Payment (-)', 'Expenditure', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:45', 'user1', '2026-02-03 07:45:56', 1),
('Z805', 'user1', 'Other Cost (-)', 'Expenditure', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:45', 'user1', '2026-02-03 07:45:56', 1),
('Z901', 'user1', 'Rent (-)', 'Expense', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:39', 'user1', '2026-02-03 07:45:56', 1),
('Z902', 'user1', 'Rent Advance (-)', 'Expense', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:39', 'user1', '2026-02-03 07:45:56', 1),
('Z903', 'user1', 'Electricity Bill (-)', 'Expense', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:39', 'user1', '2026-02-03 07:45:56', 1),
('Z904', 'user1', 'Internet Bill (-)', 'Expense', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:39', 'user1', '2026-02-03 07:45:56', 1),
('Z905', 'user1', 'Transport Bill (-)', 'Expense', 'Out', 'Internal', 1, 'user1', '2026-01-10 08:06:39', 'user1', '2026-02-03 07:45:56', 1);

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
('6e9a94bf-a9ec-4d3f-9ed1-e0da18c1c0f9', 'admin-id', 'Development in Progress', 'Development in Progress', '2026-01-15 01:56:00', 'Scheduled', 0, 'admin-id', '2026-01-14 07:58:44', 'admin-id', '2026-01-28 06:32:17', 6);

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
-- Indexes for table `tmcb_cntct`
--
ALTER TABLE `tmcb_cntct`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmcb_cntrt`
--
ALTER TABLE `tmcb_cntrt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmcb_dlvan`
--
ALTER TABLE `tmcb_dlvan`
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
-- Indexes for table `tmcb_trtry`
--
ALTER TABLE `tmcb_trtry`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_cbkng`
--
ALTER TABLE `tmeb_cbkng`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_cinvc`
--
ALTER TABLE `tmeb_cinvc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_crcpt`
--
ALTER TABLE `tmeb_crcpt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_expns`
--
ALTER TABLE `tmeb_expns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_fodrc`
--
ALTER TABLE `tmeb_fodrc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_fodrm`
--
ALTER TABLE `tmeb_fodrm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_mbkng`
--
ALTER TABLE `tmeb_mbkng`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_minvc`
--
ALTER TABLE `tmeb_minvc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_mrcpt`
--
ALTER TABLE `tmeb_mrcpt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmhb_emply`
--
ALTER TABLE `tmhb_emply`
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
-- Indexes for table `tmib_ctrsf`
--
ALTER TABLE `tmib_ctrsf`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmib_expns`
--
ALTER TABLE `tmib_expns`
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
-- Indexes for table `tmib_mtrsf`
--
ALTER TABLE `tmib_mtrsf`
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
-- Indexes for table `tmsb_bsins`
--
ALTER TABLE `tmsb_bsins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_bsins_users_bsins_bname` (`bsins_users`,`bsins_bname`);

--
-- Indexes for table `tmsb_crgrn`
--
ALTER TABLE `tmsb_crgrn`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmsb_mdule`
--
ALTER TABLE `tmsb_mdule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_mdule_mname` (`mdule_mname`);

--
-- Indexes for table `tmsb_menus`
--
ALTER TABLE `tmsb_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmsb_ucnfg`
--
ALTER TABLE `tmsb_ucnfg`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmsb_users`
--
ALTER TABLE `tmsb_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`users_email`);

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
-- Indexes for table `tmtb_rcvbl`
--
ALTER TABLE `tmtb_rcvbl`
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
