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
  -- default
  `trhed_actve` tinyint(1) NOT NULL DEFAULT 1,
  `trhed_crusr` varchar(50) NOT NULL,
  `trhed_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `trhed_upusr` varchar(50) NOT NULL,
  `trhed_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `trhed_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmtb_trhed`
--
ALTER TABLE `tmtb_trhed`
  ADD PRIMARY KEY (`id`);