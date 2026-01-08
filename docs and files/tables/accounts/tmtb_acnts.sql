--
-- Table structure for table `tmtb_acnts`
--

CREATE TABLE `tmtb_acnts` (
  `id` varchar(50) NOT NULL,
  `bacts_users` varchar(50) NOT NULL,
  `bacts_bankn` varchar(100) NOT NULL,
  -- optional
  `bacts_brnch` varchar(100) DEFAULT NULL,
  `bacts_acnam` varchar(100) DEFAULT NULL,
  `bacts_acnum` varchar(100) DEFAULT NULL,
  `bacts_routn` varchar(50) DEFAULT NULL,
  `bacts_notes` varchar(300) DEFAULT NULL,
  -- default
  `bacts_opdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bacts_crbln` decimal(18,6) NOT NULL DEFAULT 0,
  `bacts_isdef` tinyint(1) NOT NULL DEFAULT 1,
  `bacts_actve` tinyint(1) NOT NULL DEFAULT 1,
  `bacts_crusr` varchar(50) NOT NULL,
  `bacts_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `bacts_upusr` varchar(50) NOT NULL,
  `bacts_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bacts_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmtb_acnts`
--
ALTER TABLE `tmtb_acnts`
  ADD PRIMARY KEY (`id`);