--
-- Table structure for table `tmsb_crgrn`
--

CREATE TABLE `tmsb_crgrn` (
  `id` varchar(50) NOT NULL,
  `crgrn_users` varchar(50) NOT NULL,
  `crgrn_bsins` varchar(50) NOT NULL,
  `crgrn_tblnm` varchar(50) NOT NULL,
  -- optional
  `crgrn_tbltx` varchar(50) DEFAULT NULL,
  `crgrn_refno` varchar(50) DEFAULT NULL,
  -- default
  `crgrn_dbgrn` decimal(18,6) NOT NULL DEFAULT 0,
  `crgrn_crgrn` decimal(18,6) NOT NULL DEFAULT 0,
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
-- Indexes for table `tmsb_crgrn`
--
ALTER TABLE `tmsb_crgrn`
  ADD PRIMARY KEY (`id`);