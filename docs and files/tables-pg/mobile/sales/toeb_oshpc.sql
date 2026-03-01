--
-- Table structure for table toeb_oshpc
-- sales booking list

CREATE TABLE toeb_oshpc (
  id varchar(50) PRIMARY KEY,
  
  oshpc_oshpm VARCHAR(50) NOT NULL,
  oshpc_bitem VARCHAR(50) NOT NULL,
  oshpc_items VARCHAR(50) NOT NULL,
  oshpc_itrat decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_itqty decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_itamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_dspct decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_dsamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_vtpct decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_vtamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_csrat decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_ntamt decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_notes VARCHAR(50),
  oshpc_attrb VARCHAR(300),
  oshpc_attrn VARCHAR(300),
  oshpc_dlqty decimal(20,6) NOT NULL DEFAULT 0,
  oshpc_dgqty decimal(20,6) NOT NULL DEFAULT 0,

  -- default
  oshpc_actve boolean NOT NULL DEFAULT true,
  oshpc_crusr VARCHAR(50) NOT NULL,
  oshpc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oshpc_upusr VARCHAR(50) NOT NULL,
  oshpc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oshpc_rvnmr integer NOT NULL DEFAULT 1
);

