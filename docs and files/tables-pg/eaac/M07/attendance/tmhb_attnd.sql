--
-- Table structure for table tmhb_attnd
-- Processed Attendance Sheet (One daily attendance result per employee per duty date)
--

CREATE TABLE tmhb_attnd (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  attnd_users VARCHAR(50) NOT NULL,
  attnd_bsins VARCHAR(50) NOT NULL,
  attnd_ccode VARCHAR(50) NOT NULL,

  -- custom
  attnd_emply VARCHAR(50) NOT NULL, -- employee id
  attnd_ddate date NOT NULL, -- duty date
  attnd_wkshf VARCHAR(50), -- shift id
  attnd_emprd VARCHAR(50), -- duty roster id
  attnd_schin timestamp, -- scheduled shift IN datetime
  attnd_schou timestamp, -- scheduled shift OUT datetime
  attnd_actin timestamp, -- actual IN datetime
  attnd_actou timestamp, -- actual OUT datetime
  attnd_schmn integer NOT NULL DEFAULT 0, -- scheduled minutes
  attnd_wrkmn integer NOT NULL DEFAULT 0, -- actual worked minutes
  attnd_latmn integer NOT NULL DEFAULT 0, -- late minutes (preserved actual late duration)
  attnd_earmn integer NOT NULL DEFAULT 0, -- early out minutes (preserved actual early duration)
  attnd_ovtmn integer NOT NULL DEFAULT 0, -- overtime minutes
  attnd_astat VARCHAR(50) NOT NULL DEFAULT 'PRESENT', -- attendance status [PRESENT, LATE, EARLY_OUT, LATE_EARLY_OUT, ABSENT, HALF_DAY, LEAVE, HOLIDAY, WEEKEND, ROSTER_OFF, MISSING_PUNCH]
  attnd_prsnt boolean NOT NULL DEFAULT false, -- is present
  attnd_absnt boolean NOT NULL DEFAULT false, -- is absent
  attnd_islev boolean NOT NULL DEFAULT false, -- is leave
  attnd_ishld boolean NOT NULL DEFAULT false, -- is holiday
  attnd_iswko boolean NOT NULL DEFAULT false, -- is weekly off / weekend
  attnd_lvapp VARCHAR(50), -- leave application id
  attnd_atprc VARCHAR(50), -- attendance processing run id
  attnd_paybl boolean NOT NULL DEFAULT true, -- is payable day for payroll
  attnd_ipaid boolean NOT NULL DEFAULT false, -- is processed in payroll
  attnd_notes VARCHAR(255), -- remarks / notes

  -- default 2
  attnd_actve boolean NOT NULL DEFAULT true,
  attnd_crusr VARCHAR(50) NOT NULL,
  attnd_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_upusr VARCHAR(50) NOT NULL,
  attnd_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attnd_rvnmr integer NOT NULL DEFAULT 1
);
