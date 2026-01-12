--
-- Table structure for table `tmub_notes`
--

CREATE TABLE `tmub_notes` (
  `id` varchar(50) NOT NULL,
  `notes_users` varchar(50) NOT NULL,
  `notes_title` varchar(100) NOT NULL,
  `notes_descr` varchar(500) DEFAULT NULL,
  -- optional
  -- default
  `notes_dudat` datetime NOT NULL DEFAULT current_timestamp(),
  `notes_actve` tinyint(1) NOT NULL DEFAULT 1,
  `notes_crusr` varchar(50) NOT NULL,
  `notes_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `notes_upusr` varchar(50) NOT NULL,
  `notes_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notes_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmub_notes`
--
ALTER TABLE `tmub_notes`
  ADD PRIMARY KEY (`id`);