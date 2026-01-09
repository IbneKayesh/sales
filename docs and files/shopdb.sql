-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jan 09, 2026 at 06:19 PM
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
('0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'admin-id', 'My Shop BD', 'Badda, Dhaka', 'admin@sgd.com', '01722688266', NULL, 'BIN-123456', 'Clothing Store, Grocery', 'Bangladesh', '2026-01-09 00:00:00', 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 08:39:57', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:45', 2);

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
('0758720d-ea22-4aee-9b69-c898d2ffe29f', 'user@sgd.com', 'password', 'recover', 'General User', '123456', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'User', 'admin-id', 0, 'Standard', '2026-01-09 12:08:38', NULL, '2026-01-09 12:08:38', '2026-01-09 12:08:38', 'Welcome Note', 'Any Notes', 0.00, 0, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:08:38', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:26:35', 1),
('admin-id', 'admin@sgd.com', 'password', 'recover', 'Admin User', '01722688266', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Admin', 'admin-id', 0, 'Standard', '2026-01-09 08:39:57', NULL, '2026-01-09 08:39:57', '2026-01-09 08:39:57', 'Welcome Note', 'User Note', 10.00, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 08:39:57', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 18:13:39', 2);

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
('267bb3aa-9177-43d2-8d8b-e0137578cf98', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Supplier', 'Local', 'Bulk Store', 'Mr Person', '0123456', 'email@email.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:10', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:38', 1),
('d5eefaf0-9979-4edf-8fbd-68f3157c4105', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Customer', 'Local', 'Daily Needs Grocery Store', 'Mr Person', '0123456', 'email@email.com', 'Badda, Dhaka', 'Badda, Dhaka', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:02:29', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:35', 1),
('internal', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Internal', 'Local', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Internal A/C', 'Bangladesh', '0', 0.000000, 0.000000, 0.000000, 0.000000, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 13:04:25', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 14:22:31', 2);

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
('14bc4749-859b-46aa-aa67-29b926f88083', 'admin-id', 'Brac Bank PLC', '', '', '', '', '', '2026-01-09 00:00:00', 5000.000000, 0, 1, 'admin-id', '2026-01-09 17:37:49', 'admin-id', '2026-01-09 18:17:10', 1),
('c306af10-f4c2-4ee8-8593-85de14c35b76', 'admin-id', 'Cash Account', 'Cash Account', '0', 'Cash Account', '123456', 'Cash Account', '2026-01-09 00:00:00', 9500.000000, 1, 1, '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 12:06:49', '4a0149be-7eb1-4e01-b3d2-b372ad335609', '2026-01-09 18:17:10', 1);

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
('18c37470-5f3e-47c2-b6d8-50df28d0de20', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z103', 'd5eefaf0-9979-4edf-8fbd-68f3157c4105', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-09 00:00:00', 'ref-123', '', 500.000000, 0.000000, 'admin-id', '2026-01-09 16:55:20', 'admin-id', '2026-01-09 17:08:31', 4),
('74546221-8a4f-41c7-bfcc-a87547822755', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z101', 'd5eefaf0-9979-4edf-8fbd-68f3157c4105', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-09 00:00:00', 'ref-123', '', 0.000000, 15000.000000, 'admin-id', '2026-01-09 16:55:54', 'admin-id', '2026-01-09 17:05:11', 2),
('b642fbd0-a081-4a91-99ff-f167d069bbea', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z602', 'internal', '14bc4749-859b-46aa-aa67-29b926f88083', 'Cash', '2026-01-10 00:00:00', '5000', '', 0.000000, 5000.000000, 'admin-id', '2026-01-09 18:17:10', 'admin-id', '2026-01-09 18:17:10', 1),
('ea4dbc4b-da84-49f1-988a-3cd294077399', 'admin-id', '0410da9c-2a16-43b3-b0b6-4015eeb245a8', 'Z601', 'internal', 'c306af10-f4c2-4ee8-8593-85de14c35b76', 'Cash', '2026-01-10 00:00:00', '5000', '', 5000.000000, 0.000000, 'admin-id', '2026-01-09 18:17:10', 'admin-id', '2026-01-09 18:17:10', 1);

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
('Z101', 'admin-id', 'Sales Booking (+)', 'Sales', 'In', 'Customer', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z102', 'admin-id', 'Sales Invoice (-)', 'Sales', 'Out', 'Customer', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z103', 'admin-id', 'Sales Order (+)', 'Sales', 'In', 'Customer', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z104', 'admin-id', 'Sales Return (-)', 'Sales', 'Out', 'Customer', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z105', 'admin-id', 'Sales Customer Expense (+)', 'Sales', 'In', 'Customer', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z106', 'admin-id', 'Sales Expense (-)', 'Sales', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z107', 'admin-id', 'Sales Discount (-)', 'Sales', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z108', 'admin-id', 'Sales VAT (+)', 'Sales', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z201', 'admin-id', 'Purchase Booking (-)', 'Purchases', 'Out', 'Supplier', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z202', 'admin-id', 'Purchase Invoice (+)', 'Purchases', 'In', 'Supplier', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z203', 'admin-id', 'Purchase Order (-)', 'Purchases', 'Out', 'Supplier', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z204', 'admin-id', 'Purchase Return (+)', 'Purchases', 'In', 'Supplier', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z205', 'admin-id', 'Purchase Purchase Expense (-)', 'Purchases', 'Out', 'Supplier', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z206', 'admin-id', 'Purchase Expense (-)', 'Purchases', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z207', 'admin-id', 'Purchase Discount (+)', 'Purchases', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z208', 'admin-id', 'Purchase VAT (+)', 'Purchases', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z301', 'admin-id', 'Stock Out (-)', 'Inventory', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z302', 'admin-id', 'Stock In (+)', 'Inventory', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z401', 'admin-id', 'Gain (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z402', 'admin-id', 'Salary Deduction (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z403', 'admin-id', 'Rent Advance Received (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z404', 'admin-id', 'Rent Adjustment (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z405', 'admin-id', 'Bank Profit (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z406', 'admin-id', 'Loan Taken (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z407', 'admin-id', 'Deposit (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z408', 'admin-id', 'Asset Sale (+)', 'Assets', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z409', 'admin-id', 'Other Income (+)', 'Income', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z501', 'admin-id', 'Loss (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z502', 'admin-id', 'Salary Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z503', 'admin-id', 'Rent Advance Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z504', 'admin-id', 'Rent Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z505', 'admin-id', 'Electricity Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z506', 'admin-id', 'Internet Bill (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z507', 'admin-id', 'Transport Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z508', 'admin-id', 'Bank Charges (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z509', 'admin-id', 'Tax Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z510', 'admin-id', 'Maintenance Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z511', 'admin-id', 'Loan Payment (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z512', 'admin-id', 'Asset Purchase (-)', 'Assets', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z513', 'admin-id', 'Other Expense (-)', 'Expense', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z514', 'admin-id', 'Withdraw (-)', 'Income', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z601', 'admin-id', 'Transfer Out (-)', 'Transfer', 'Out', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1),
('Z602', 'admin-id', 'Transfer In (+)', 'Transfer', 'In', 'Internal', 1, 'admin-id', '2026-01-09 14:43:19', 'admin-id', '2026-01-09 14:43:19', 1);

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
