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
  -- optional
  `cntct_cntps` varchar(50) DEFAULT NULL,
  `cntct_cntno` varchar(50) DEFAULT NULL,
  `cntct_email` varchar(50) DEFAULT NULL,
  `cntct_ofadr` varchar(300) DEFAULT NULL,
  `cntct_fcadr` varchar(300) DEFAULT NULL,
  `cntct_cntry` varchar(50) DEFAULT NULL,  
  `cntct_cntad` varchar(50) DEFAULT NULL,
  -- default
  `cntct_crlmt` decimal(18,6) NOT NULL DEFAULT 0,
  `cntct_pybln` decimal(18,6) NOT NULL DEFAULT 0,
  `cntct_adbln` decimal(18,6) NOT NULL DEFAULT 0,
  `cntct_crbln` decimal(18,6) NOT NULL DEFAULT 0,
  `cntct_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cntct_crusr` varchar(50) NOT NULL,
  `cntct_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cntct_upusr` varchar(50) NOT NULL,
  `cntct_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cntct_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_cntcs`
--
ALTER TABLE `tmcb_cntcs`
  ADD PRIMARY KEY (`id`);