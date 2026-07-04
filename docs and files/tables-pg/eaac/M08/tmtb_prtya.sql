CREATE TABLE tmtb_prtya (
  -- default 1
  id varchar(50) PRIMARY KEY,
  prtya_users varchar(50) NOT NULL,
  prtya_bsins varchar(50) NOT NULL,
  prtya_ccode varchar(50) NOT NULL,

  -- custom
  prtya_sorce varchar(50) NOT NULL,
  prtya_chtac varchar(50) NOT NULL,
  prtya_notes varchar(50),
  
  -- default 2
  prtya_actve boolean NOT NULL DEFAULT true,
  prtya_crusr varchar(50) NOT NULL,
  prtya_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prtya_upusr varchar(50) NOT NULL,
  prtya_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prtya_rvnmr integer NOT NULL DEFAULT 1
);