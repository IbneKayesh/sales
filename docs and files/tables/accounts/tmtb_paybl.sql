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
  -- optional
  `paybl_descr` varchar(100) DEFAULT NULL,
  -- default
  `paybl_notes` varchar(50) NOT NULL,
  `paybl_dbamt` decimal(18,6) NOT NULL DEFAULT 0,
  `paybl_cramt` decimal(18,6) NOT NULL DEFAULT 0,
  `paybl_crusr` varchar(50) NOT NULL,
  `paybl_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `paybl_upusr` varchar(50) NOT NULL,
  `paybl_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `paybl_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmtb_paybl`
--
ALTER TABLE `tmtb_paybl`
  ADD PRIMARY KEY (`id`);