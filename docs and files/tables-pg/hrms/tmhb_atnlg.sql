--
-- Table structure for table tmhb_atnlg
--

CREATE TABLE tmhb_atnlg (
  id VARCHAR(50) PRIMARY KEY,

  atnlg_users VARCHAR(50) NOT NULL,
  atnlg_bsins VARCHAR(50) NOT NULL,
  atnlg_ecode VARCHAR(50) NOT NULL,
  atnlg_crdno VARCHAR(50) NOT NULL,
  atnlg_lgtim timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnlg_trmnl VARCHAR(50),

   -- default
  atnlg_actve boolean NOT NULL DEFAULT true,
  atnlg_crusr VARCHAR(50) NOT NULL,
  atnlg_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnlg_upusr VARCHAR(50) NOT NULL,
  atnlg_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atnlg_rvnmr integer NOT NULL DEFAULT 1
);

select *
FROM tmhb_attnd tnd
JOIN tmhb_atnlg nlg ON tnd.attnd_users = nlg.atnlg_users AND tnd.attnd_bsins = nlg.atnlg_bsins
WHERE tnd.attnd_atdat >= DATE '2026-03-28'
AND tnd.attnd_atdat <  DATE '2026-03-29'