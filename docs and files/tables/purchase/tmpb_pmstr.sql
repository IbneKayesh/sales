--
-- Table structure for table tmpb_pmstr
-- purchase master list

CREATE TABLE `tmpb_pmstr` (
  `id` VARCHAR(50) NOT NULL,
  `pmstr_users` VARCHAR(50) NOT NULL,
  `pmstr_bsins` VARCHAR(50) NOT NULL,
  `pmstr_cntct` VARCHAR(50) NOT NULL,
  `pmstr_odtyp` VARCHAR(50) NOT NULL,
  `pmstr_trnno` VARCHAR(50) NOT NULL,
  `pmstr_trdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `pmstr_trnte` VARCHAR(100) DEFAULT NULL,
  `pmstr_refno` VARCHAR(50) DEFAULT NULL,
  `pmstr_odamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_dsamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_vtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_vatpy` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_incst` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_excst` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_rnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_ttamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_pyamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_pdamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_duamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_rtamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_cnamt` decimal(20,6) NOT NULL DEFAULT 0,
  `pmstr_ispad` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_ispst` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_isret` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_iscls` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_vatcl` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_hscnl` TINYINT(1) NOT NULL DEFAULT 0,
  `pmstr_actve` TINYINT(1) NOT NULL DEFAULT 1,
  `pmstr_crusr` VARCHAR(50) NOT NULL,
  `pmstr_crdat` DATETIME NOT NULL DEFAULT current_timestamp(),
  `pmstr_upusr` VARCHAR(50) NOT NULL,
  `pmstr_updat` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pmstr_rvnmr` INT(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table tmpb_pmstr
--
ALTER TABLE tmpb_pmstr
  ADD PRIMARY KEY (id);


 -- pmstr_odtyp['Booking','Receipt', 'Invoice', 'Return']