--
-- Table structure for table tmhb_lvntl
--

CREATE TABLE tmhb_lvntl (
  id VARCHAR(50) PRIMARY KEY,

  lvntl_users VARCHAR(50) NOT NULL,
  lvntl_bsins VARCHAR(50) NOT NULL,
  lvntl_yerid integer NOT NULL DEFAULT 0,
  lvntl_atnst VARCHAR(50) NOT NULL,
  lvntl_nmbol integer NOT NULL DEFAULT 1,

   -- default
  lvntl_actve boolean NOT NULL DEFAULT true,
  lvntl_crusr VARCHAR(50) NOT NULL,
  lvntl_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvntl_upusr VARCHAR(50) NOT NULL,
  lvntl_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvntl_rvnmr integer NOT NULL DEFAULT 1
);