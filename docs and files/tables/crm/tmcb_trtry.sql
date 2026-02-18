--
-- Table structure for table `tmcb_trtry`
--

CREATE TABLE `tmcb_trtry` (
  `id` varchar(50) NOT NULL,
  `trtry_users` varchar(50) NOT NULL,
  `trtry_bsins` varchar(50) NOT NULL,
  `trtry_tarea` varchar(50) NOT NULL,
  `trtry_wname` varchar(50) NOT NULL,
  `trtry_actve` tinyint(1) NOT NULL DEFAULT 1,
  `trtry_crusr` varchar(50) NOT NULL,
  `trtry_crdat` datetime NOT NULL DEFAULT current_timestamp(),
  `trtry_upusr` varchar(50) NOT NULL,
  `trtry_updat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `trtry_rvnmr` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `tmcb_trtry`
--
ALTER TABLE `tmcb_trtry`
  ADD PRIMARY KEY (`id`);


  SELECT cnt.cntct_cntnm, crt.cnrut_srlno, crt.cnrut_lvdat, rts.rutes_rname, rts.rutes_dname, rty.trtry_wname
FROM tmcb_cntct cnt
JOIN tmcb_cntrt crt ON cnt.id = crt.cnrut_cntct
JOIN tmcb_rutes rts ON crt.cnrut_rutes = rts.id
JOIN tmcb_trtry rty ON rts.rutes_trtry = rty.id
WHERE crt.cnrut_sraid = 'staff1'