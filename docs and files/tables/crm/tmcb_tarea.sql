--
-- Table structure for table `tmcb_tarea`
--

CREATE TABLE `tmcb_tarea` (
  `id` varchar(50) NOT NULL,
  `tarea_users` varchar(50) NOT NULL,
  `tarea_bsins` varchar(50) NOT NULL,
  `tarea_dzone` varchar(50) NOT NULL,
  `tarea_tname` varchar(50) NOT NULL,
  `tarea_actve` tinyint(1) NOT NULL DEFAULT 1,
  `tarea_crusr` varchar(50) NOT NULL,
  `tarea_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `tarea_upusr` varchar(50) NOT NULL,
  `tarea_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tarea_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_tarea`
--
ALTER TABLE `tmcb_tarea`
  ADD PRIMARY KEY (`id`);