--
-- Table structure for table tmhb_wkshf
-- Work Shifts
--

CREATE TABLE tmhb_wkshf (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  wkshf_users VARCHAR(50) NOT NULL,
  wkshf_bsins VARCHAR(50) NOT NULL,
  wkshf_ccode VARCHAR(50) NOT NULL,

  -- custom
  wkshf_scode VARCHAR(50) NOT NULL, -- shift code
  wkshf_cname VARCHAR(100) NOT NULL, -- shift name
  wkshf_satim time NOT NULL, -- shift start time (e.g. 08:00)
  wkshf_entim time NOT NULL, -- shift end time (e.g. 17:00)
  wkshf_wkmin integer NOT NULL DEFAULT 480, -- total working minutes (e.g. 480 mins = 8 hrs)
  wkshf_gsmin integer NOT NULL DEFAULT 0, -- grace in minutes (e.g. 10 mins)
  wkshf_gemin integer NOT NULL DEFAULT 0, -- grace out minutes (e.g. 10 mins)
  wkshf_crday boolean NOT NULL DEFAULT false, -- cross midnight shift (overnight)
  wkshf_mfdmn integer NOT NULL DEFAULT 480, -- minimum minutes required for full day present
  wkshf_mhdmn integer NOT NULL DEFAULT 240, -- minimum minutes required for half day present
  wkshf_ovrtm boolean NOT NULL DEFAULT false, -- overtime eligible shift
  wkshf_notes VARCHAR(255), -- description / notes

  -- default 2
  wkshf_actve boolean NOT NULL DEFAULT true,
  wkshf_crusr VARCHAR(50) NOT NULL,
  wkshf_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkshf_upusr VARCHAR(50) NOT NULL,
  wkshf_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wkshf_rvnmr integer NOT NULL DEFAULT 1
);
