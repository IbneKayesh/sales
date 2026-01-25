--
-- Table structure for table tmib_attrb
-- item attributes

CREATE TABLE tmib_attrb (
  `id` VARCHAR(50) NOT NULL,
  `attrb_users` VARCHAR(50) NOT NULL,
  `attrb_aname` VARCHAR(50) NOT NULL,
  `attrb_dtype` VARCHAR(50) NOT NULL,
  `attrb_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `attrb_crusr` VARCHAR(50) NOT NULL,
  `attrb_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `attrb_upusr` VARCHAR(50) NOT NULL,
  `attrb_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `attrb_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmib_attrb
--
ALTER TABLE tmib_attrb
  ADD PRIMARY KEY (id);