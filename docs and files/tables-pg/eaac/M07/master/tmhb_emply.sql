--
-- Table structure for table tmhb_emply
-- Employee Master
--

CREATE TABLE tmhb_emply (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  emply_users VARCHAR(50) NOT NULL,
  emply_bsins VARCHAR(50) NOT NULL,
  emply_ccode VARCHAR(50) NOT NULL,

  -- custom
  emply_ecode VARCHAR(50) NOT NULL, -- employee code
  emply_atcde VARCHAR(50), -- biometric / card attendance code
  emply_fname VARCHAR(50) NOT NULL, -- first name
  emply_mname VARCHAR(50), -- middle name
  emply_lname VARCHAR(50) NOT NULL, -- last name
  emply_cname VARCHAR(100) NOT NULL, -- full name / display name
  emply_gndsp VARCHAR(20) NOT NULL DEFAULT 'MALE', -- gender [MALE, FEMALE, OTHER]
  emply_dobdt date, -- date of birth
  emply_nidno VARCHAR(50), -- national ID
  emply_pprno VARCHAR(50), -- passport no
  emply_email VARCHAR(100), -- personal email
  emply_wkeml VARCHAR(100), -- work email
  emply_cntno VARCHAR(50) NOT NULL, -- mobile no
  emply_emgcn VARCHAR(100), -- emergency contact name
  emply_emgcp VARCHAR(50), -- emergency contact phone
  emply_joind date NOT NULL, -- joining date
  emply_confd date, -- confirmation date
  emply_termnd date, -- termination / resignation date
  emply_emptp VARCHAR(50) NOT NULL, -- employment type id / code
  emply_empst VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- status id / code [ACTIVE, PROBATION, SUSPENDED, TERMINATED, RESIGNED]
  emply_dpart VARCHAR(50) NOT NULL, -- department id
  emply_desig VARCHAR(50) NOT NULL, -- designation id
  emply_mngid VARCHAR(50), -- supervisor / reporting manager employee id
  emply_photo VARCHAR(255), -- profile photo reference
  emply_addrs VARCHAR(255), -- address
  emply_urole VARCHAR(50) NOT NULL DEFAULT 'USER', -- application role
  emply_islgn boolean NOT NULL DEFAULT false, -- login enabled

  -- default 2
  emply_actve boolean NOT NULL DEFAULT true,
  emply_crusr VARCHAR(50) NOT NULL,
  emply_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_upusr VARCHAR(50) NOT NULL,
  emply_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  emply_rvnmr integer NOT NULL DEFAULT 1
);
