-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Feb 02, 2026 at 12:49 PM
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
('11f1664d-5d03-4724-a4dd-57ad3e01ad1a', 'user1', 'business1', 'Customer', 'Local', 'Al Noor Store', 'Javed Hasan', '01623-100104', 'email@sgd.com', 'TIN-123456', 'TRADE-123456', 'Sylhet Zindabazar', 'Sylhet Zindabazar', 'bogra-sadar', 'bogra', 'Bangladesh', '0', 10.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:24:23', 'user1', '2026-01-31 10:14:56', 4),
('267bb3aa-9177-43d2-8d8b-e0137578cf98', 'user1', 'business1', 'Supplier', 'Local', 'Dhaka Agro Traders', 'Md. Kamal Hossain', '01711-000001', 'email@email.com', '', '', 'Kawran Bazar, Dhaka', 'Kawran Bazar, Dhaka', 'araihazar', 'narayanganj', 'Bangladesh', '0', 0.000000, 20000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 12:02:10', 'user1', '2026-01-31 10:14:56', 4),
('41981c62-d7fc-4238-a8f1-8c70bd2c1e0e', 'user1', 'business1', 'Customer', 'Local', 'Bismillah Traders', 'Hafiz Uddin', '01921-100103', '', 'TIN-123-123', 'TRADE-123-123', 'Cumilla Sadar', 'Cumilla Sadar', 'araihazar', 'narayanganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:24:02', 'user1', '2026-01-31 10:14:56', 3),
('521e18fc-b57a-48c4-a0a7-d7772edb4b76', 'user1', 'business1', 'Customer', 'Local', 'M/S Amin Enterprise', 'Aminul Islam', '01534-100105', '', '', '', 'Khulna Boyra', 'Khulna Boyra', 'kachpur', 'narayanganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:24:45', 'user1', '2026-01-31 10:14:56', 2),
('639611f4-97e5-4589-904e-190ef11f7f4e', 'user1', 'business1', 'Supplier', 'Local', 'Jisan Dairy Source', 'Akhi Khatun', '01555-000005', '', '', '', 'Mirpur-10, Dhaka', 'Mirpur-10, Dhaka', 'enayetpur', 'sirajganj', 'Bangladesh', '0', 0.000000, 25000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:10:29', 'user1', '2026-01-31 10:14:56', 2),
('6a0619ca-84e9-4df5-b225-7dd7acb91b86', 'user1', 'business1', 'Supplier', 'Local', 'Green Farm Ltd.', 'Abdul Karim', '01933-000003', '', '', '', 'Bogura Sadar, Bogura', 'Bogura Sadar, Bogura', 'bogra-sadar', 'bogra', 'Bangladesh', '0', 10.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:09:12', 'user1', '2026-01-31 10:14:56', 2),
('be93309a-ec2b-40d0-9c62-8abe7796b547', 'user1', 'business1', 'Supplier', 'Local', 'Golden Grain Supply', 'Rashed Mahmud', '01644-000004', '', '', '', 'Jashore Industrial Area', 'Jashore Industrial Area', 'kamarkhanda', 'sirajganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-18 11:09:47', 'user1', '2026-01-31 10:14:56', 2),
('both', 'user1', 'business1', 'Both', 'Local', 'Both A/C', 'Both A/C', 'Both A/C', 'Both A/C', '', '', 'Both A/C', 'Both A/C', 'sherpur', 'bogra', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 13:04:25', 'user1', '2026-01-31 10:14:56', 3),
('c370a9f5-7ccf-4e2d-9d7a-7d5873293ddc', 'user1', 'business1', 'Customer', 'Local', 'Shapno Mini Mart', 'Farzana Islam', '01819-100102', 'email@sgd.com', '', '', 'Uttara Sector 7, Dhaka', 'Uttara Sector 7, Dhaka', 'belkuchi', 'sirajganj', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-14 09:23:59', 'user1', '2026-01-31 10:14:56', 3),
('d5eefaf0-9979-4edf-8fbd-68f3157c4105', 'user1', 'business1', 'Customer', 'Local', 'Rahman General Store', 'Anisur Rahman', '01712-100101', 'email@email.com', '', '', 'Mohammadpur, Dhaka', 'Mohammadpur, Dhaka', 'adamdighi', 'bogra', 'Bangladesh', '0', 0.000000, 50000.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 12:02:29', 'user1', '2026-01-31 10:14:56', 4),
('internal', 'user1', 'business1', 'Internal', 'Local', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', '', '', 'Internal A/C', 'Internal A/C', 'sherpur', 'bogra', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-09 13:04:25', 'user1', '2026-01-31 10:14:56', 3);

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
('bogra', 'user1', 'business1', 'Bangladesh', 'Bogra', 1, 'user1', '2026-01-25 04:45:54', 'user1', '2026-01-31 10:15:30', 1),
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
('adamdighi', 'user1', 'business1', 'bogra', 'Adamdighi', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('araihazar', 'user1', 'business1', 'narayanganj', 'Araihazar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('bandar', 'user1', 'business1', 'narayanganj', 'Bandar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('belkuchi', 'user1', 'business1', 'sirajganj', 'Belkuchi', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('bhairob', 'user1', 'business1', 'narayanganj', 'Bhairob', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
('bogra-sadar', 'user1', 'business1', 'bogra', 'Bogra Sadar', 1, 'user1', '2026-01-25 04:57:51', 'user1', '2026-01-31 10:16:17', 1),
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
('1248204a-e407-4245-8952-924a1f832354', 'user1', '4b019cba-eda8-4ad3-a8ac-ece0e6478ffe', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:56:36', 'user1', '2026-02-02 11:50:24', 1),
('19debe39-1eaa-4cb1-ba16-3f361ff455ca', 'user1', 'e2e70dc1-9814-400c-8774-2b6b186b79e5', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:15', 'user1', '2026-02-02 05:57:45', 1),
('1b0483c5-ed8f-43ce-b128-9dbf717e8e67', 'user1', '8873e069-eea6-4f9e-acf0-dd1cb658f9c8', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:55:41', 'user1', '2026-01-31 10:55:41', 1),
('2188dcd0-244b-4750-ad51-f86397b196f1', 'user1', 'dfe206f2-b3a3-4d6c-8b3c-7402582348eb', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:04', 'user1', '2026-01-31 10:59:04', 1),
('228076b3-b3df-4270-a1b3-a2520267818c', 'user1', '485d61c3-e84e-418b-b91b-2171c17f0391', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:06', 'user1', '2026-01-31 10:58:06', 1),
('282533ed-53cf-496a-8611-c452785371fd', 'user1', '42ccd66a-70db-4c7f-93c4-36261a8f064f', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:57:58', 'user1', '2026-01-31 10:57:58', 1),
('28738f75-f676-4f53-bb43-b74638699553', 'user1', 'e483bc2d-6ccd-4b72-8603-775dcd275249', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:49', 'user1', '2026-01-31 10:58:49', 1),
('586345fd-6f26-4577-90ab-dfb8bc49e187', 'user1', '471d3f7f-e3e5-4585-bdbf-5f0a35b05a93', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 11:00:06', 'user1', '2026-01-31 11:00:06', 1),
('59dd7e4d-3748-4ee0-9531-8eb73cf03fed', 'user1', '940f8010-5d38-4de4-b66f-d12958ff9ecf', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:57:22', 'user1', '2026-01-31 10:57:22', 1),
('75860dc3-c9f8-43b9-a20f-f78104602fdf', 'user1', '4b100c2e-68a6-467b-94b7-617a6c7b43dc', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:55', 'user1', '2026-01-31 10:59:55', 1),
('85f84fc9-2d92-4327-81b6-31a4c6c6cc8a', 'user1', 'e45670a3-981c-47c2-bd6a-a02bd8c0d7b0', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:58:57', 'user1', '2026-01-31 10:58:57', 1),
('8ce55060-f46d-445f-bcc1-7fb9d5f5f38e', 'user1', 'b3da1017-bea4-44fd-ad13-110e92a48965', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:59:41', 'user1', '2026-01-31 10:59:41', 1),
('9a04c7bb-e9d8-4adf-8eff-1fe92e43c971', 'user1', 'fa1b188a-c075-4b90-bbea-37e3733f50bb', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 0.000000, 0.000000, 100.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:57:44', 'user1', '2026-02-02 12:31:39', 1),
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
('f241e3b7-3f83-42f4-ac10-af8def91799a', 'user1', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 'business1', 0.000000, 0.000000, 0.000000, 0.000000, '', 100.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 1, 'user1', '2026-01-31 10:57:36', 'user1', '2026-02-02 12:31:39', 1),
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
('82c0605f-c238-4efd-92f5-393189778d30', '714f2d07-cffe-4921-8748-64a29b775513', '9a04c7bb-e9d8-4adf-8eff-1fe92e43c971', 'fa1b188a-c075-4b90-bbea-37e3733f50bb', 850.000000, 100.000000, 85000.000000, 0.000000, 0.000000, 5.000000, 4250.000000, 850.300000, 89250.000000, '', '{\"Flavor\":\"Raw\",\"Size\":\"1 KG\"}', 0.000000, 0.000000, 100.000000, 1, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1),
('f8e25740-84b6-4065-a121-31328aae066c', '714f2d07-cffe-4921-8748-64a29b775513', 'f241e3b7-3f83-42f4-ac10-af8def91799a', '38b496e9-6652-4324-8331-ba0ecb0cfeae', 85.000000, 100.000000, 8500.000000, 0.000000, 0.000000, 5.000000, 425.000000, 85.300000, 8925.000000, '', '{\"Weight\":\"10 Ltr\",\"Size\":\"Container Bottle\",\"Flavor\":\"Raw\"}', 0.000000, 0.000000, 100.000000, 1, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1);

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

--
-- Dumping data for table `tmpb_expns`
--

INSERT INTO `tmpb_expns` (`id`, `expns_users`, `expns_bsins`, `expns_cntct`, `expns_refid`, `expns_refno`, `expns_srcnm`, `expns_trdat`, `expns_inexc`, `expns_notes`, `expns_xpamt`, `expns_actve`, `expns_crusr`, `expns_crdat`, `expns_upusr`, `expns_updat`, `expns_rvnmr`) VALUES
('e337e69e-bfba-4684-b83c-860b0e727340', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', '714f2d07-cffe-4921-8748-64a29b775513', 'PI-020226-00001', 'Purchase Invoice', '2026-02-02', 1, '', 40.000000, 1, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1),
('ee94b228-b84e-4f67-b73f-a8830516ae12', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', '714f2d07-cffe-4921-8748-64a29b775513', 'PI-020226-00001', 'Purchase Invoice', '2026-02-02', 2, '', 20.000000, 1, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1);

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
('714f2d07-cffe-4921-8748-64a29b775513', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'PI-020226-00001', '2026-02-02 00:00:00', '', '', 93500.000000, 0.000000, 4675.000000, 1, 40.000000, 20.000000, 0.000000, 98215.000000, 98215.000000, 90000.000000, 8215.000000, 0.000000, 2, 1, 0, 0, 0, 1, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1);

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
  `mdule_notes` varchar(255) DEFAULT NULL,
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

INSERT INTO `tmsb_mdule` (`id`, `mdule_mname`, `mdule_pname`, `mdule_micon`, `mdule_notes`, `mdule_odrby`, `mdule_actve`, `mdule_crusr`, `mdule_crdat`, `mdule_upusr`, `mdule_updat`, `mdule_rvnmr`) VALUES
('setup', 'Setup', 'basic', 'pi pi-note', NULL, 2, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-02 09:53:24', 1),
('shop', 'Shop', 'basic', 'pi pi-note', NULL, 1, 1, 'user1', '2026-02-02 09:53:24', 'user1', '2026-02-02 09:53:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tmsb_menus`
--

CREATE TABLE `tmsb_menus` (
  `id` varchar(50) NOT NULL,
  `menus_mdule` varchar(50) NOT NULL,
  `menus_gname` varchar(50) NOT NULL,
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

INSERT INTO `tmsb_menus` (`id`, `menus_mdule`, `menus_gname`, `menus_mname`, `menus_pname`, `menus_micon`, `menus_mlink`, `menus_notes`, `menus_odrby`, `menus_actve`, `menus_crusr`, `menus_crdat`, `menus_upusr`, `menus_updat`, `menus_rvnmr`) VALUES
('sales-invoice', 'shop', 'Sales', 'Invoice', 'basic', 'pi pi-note', '/home/sinvoice', NULL, 0, 1, 'user1', '2026-02-02 09:58:00', 'user1', '2026-02-02 09:58:00', 1);

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
('c1', 'user1', 'business1', 'Purchase', 'Booking', 'mbkng_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-02 11:09:34', 1),
('c2', 'user1', 'business1', 'Purchase', 'Booking', 'mbkng_ispst', '1', 'Default Posted Checked', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-02 11:07:49', 1),
('c3', 'user1', 'business1', 'Purchase', 'Receipt', 'mrcpt_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-02 11:09:37', 1),
('c4', 'user1', 'business1', 'Sales', 'Invoice', 'minvc_vatpy', '1', 'Including VAT', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-02 11:09:37', 1),
('c5', 'user1', 'business1', 'Sales', 'Invoice', 'minvc_ispst', '1', 'Default Posted Checked', 1, 'user1', '2026-02-02 10:45:00', 'user1', '2026-02-02 11:07:49', 1);

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
('865c46fc-2661-43a5-b2cf-39b8e878d65d', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Inventory', '714f2d07-cffe-4921-8748-64a29b775513', 'PI-020226-00001', 'Purchase Booking', '2026-02-02 00:00:00', 'Supplier Goods', 'Products', 0.000000, 98215.000000, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1),
('9d16d00e-72ca-4239-b05d-f025f2feccef', 'user1', 'business1', '08eb3501-fcd0-4d99-84c3-ce5309bfe613', 'Cash', '714f2d07-cffe-4921-8748-64a29b775513', 'PI-020226-00001', 'Purchase Booking', '2026-02-02 00:00:00', '', 'Payment', 90000.000000, 0.000000, 'user1', '2026-02-02 12:31:39', 'user1', '2026-02-02 12:31:39', 1);

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
('Z1002', 'admin-id', 'Asset Sale (+)', 'Asset', 'In', 'Internal', 1, 'admin-id', '2026-01-10 08:06:31', 'admin-id', '2026-01-28 06:26:47', 1),
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
-- Indexes for table `tmeb_cinvc`
--
ALTER TABLE `tmeb_cinvc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_expns`
--
ALTER TABLE `tmeb_expns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tmeb_minvc`
--
ALTER TABLE `tmeb_minvc`
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
