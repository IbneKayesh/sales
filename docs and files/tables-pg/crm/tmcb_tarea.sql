--
-- Table structure for table tmcb_tarea
--

CREATE TABLE tmcb_tarea (
  id varchar(50) PRIMARY KEY,

  tarea_users varchar(50) NOT NULL,
  tarea_bsins varchar(50) NOT NULL,
  tarea_dzone varchar(50) NOT NULL,
  tarea_tname varchar(50) NOT NULL,

  -- default
  tarea_actve boolean NOT NULL DEFAULT true,
  tarea_crusr varchar(50) NOT NULL,
  tarea_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tarea_upusr varchar(50) NOT NULL,
  tarea_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tarea_rvnmr integer NOT NULL DEFAULT 1
);