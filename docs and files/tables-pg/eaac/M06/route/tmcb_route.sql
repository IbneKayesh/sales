--
-- Table structure for table tmcb_route
--

CREATE TABLE tmcb_route (
  id varchar(50) PRIMARY KEY,

  route_users varchar(50) NOT NULL,
  route_bsins varchar(50) NOT NULL,
  route_ccode varchar(50) NOT NULL,
  route_rname varchar(50) NOT NULL,
  route_dname varchar(50) NOT NULL,
  route_trtry varchar(50) NOT NULL,  
  -- optional
  -- default  
  route_srial integer NOT NULL DEFAULT 1,


  route_actve boolean NOT NULL DEFAULT true,
  route_crusr varchar(50) NOT NULL,
  route_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  route_upusr varchar(50) NOT NULL,
  route_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  route_rvnmr integer NOT NULL DEFAULT 1
);