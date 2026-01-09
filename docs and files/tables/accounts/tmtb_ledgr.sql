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
  -- optional
  `ledgr_notes` varchar(100) DEFAULT NULL,
  -- default  
  `ledgr_dbamt` decimal(18,6) NOT NULL DEFAULT 0,
  `ledgr_cramt` decimal(18,6) NOT NULL DEFAULT 0,
  `ledgr_crusr` varchar(50) NOT NULL,
  `ledgr_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `ledgr_upusr` varchar(50) NOT NULL,
  `ledgr_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ledgr_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmtb_ledgr`
--
ALTER TABLE `tmtb_ledgr`
  ADD PRIMARY KEY (`id`);