--
-- Table structure for table tmcb_trtry
--

CREATE TABLE tmcb_trtry (
  id varchar(50) PRIMARY KEY,

  trtry_users varchar(50) NOT NULL,
  trtry_bsins varchar(50) NOT NULL,
  trtry_tarea varchar(50) NOT NULL,
  trtry_wname varchar(50) NOT NULL,

  -- default
  trtry_actve boolean NOT NULL DEFAULT true,
  trtry_crusr varchar(50) NOT NULL,
  trtry_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trtry_upusr varchar(50) NOT NULL,
  trtry_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trtry_rvnmr integer NOT NULL DEFAULT 1
);


  SELECT cnt.cntct_cntnm, crt.cnrut_srlno, crt.cnrut_lvdat, rts.rutes_rname, rts.rutes_dname, rty.trtry_wname
FROM tmcb_cntct cnt
JOIN tmcb_cntrt crt ON cnt.id = crt.cnrut_cntct
JOIN tmcb_rutes rts ON crt.cnrut_rutes = rts.id
JOIN tmcb_trtry rty ON rts.rutes_trtry = rty.id
WHERE crt.cnrut_sraid = 'staff1'