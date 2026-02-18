--
-- Table structure for table `tmcb_cntrt`
--

CREATE TABLE `tmcb_cntrt` (
  `id` varchar(50) NOT NULL,
  `cnrut_users` varchar(50) NOT NULL,
  `cnrut_bsins` varchar(50) NOT NULL,
  `cnrut_cntct` varchar(50) NOT NULL,
  `cnrut_rutes` varchar(50) NOT NULL,
  `cnrut_sraid` varchar(50) NOT NULL,
  -- optional
  -- default
  `cnrut_srlno` int(11) NOT NULL DEFAULT 0,
  `cnrut_lvdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cnrut_actve` tinyint(1) NOT NULL DEFAULT 1,
  `cnrut_crusr` varchar(50) NOT NULL,
  `cnrut_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `cnrut_upusr` varchar(50) NOT NULL,
  `cnrut_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cnrut_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_cntrt`
--
ALTER TABLE `tmcb_cntrt`
  ADD PRIMARY KEY (`id`);