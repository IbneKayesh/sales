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
  -- optional
  `rcvbl_descr` varchar(100) DEFAULT NULL,
  -- default
  `rcvbl_notes` varchar(50) NOT NULL,
  `rcvbl_dbamt` decimal(18,6) NOT NULL DEFAULT 0,
  `rcvbl_cramt` decimal(18,6) NOT NULL DEFAULT 0,
  `rcvbl_crusr` varchar(50) NOT NULL,
  `rcvbl_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rcvbl_upusr` varchar(50) NOT NULL,
  `rcvbl_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rcvbl_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmtb_rcvbl`
--
ALTER TABLE `tmtb_rcvbl`
  ADD PRIMARY KEY (`id`);