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
  -- optional
  `rcvpy_notes` varchar(100) DEFAULT NULL,
  -- default  
  `rcvpy_pyamt` decimal(18,6) NOT NULL DEFAULT 0,
  `rcvpy_crusr` varchar(50) NOT NULL,
  `rcvpy_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `rcvpy_upusr` varchar(50) NOT NULL,
  `rcvpy_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rcvpy_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmtb_rcvpy`
--
ALTER TABLE `tmtb_rcvpy`
  ADD PRIMARY KEY (`id`);