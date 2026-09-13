--
-- Table structure for table tmhb_lvdys
-- Leave Application Days (Breakdown of specific calendar dates in a leave request)
--

CREATE TABLE tmhb_lvdys (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvdys_users VARCHAR(50) NOT NULL,
  lvdys_bsins VARCHAR(50) NOT NULL,
  lvdys_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvdys_lvapp VARCHAR(50) NOT NULL, -- leave application id
  lvdys_lvdat date NOT NULL, -- specific leave date
  lvdys_dtype VARCHAR(20) NOT NULL DEFAULT 'FULL', -- day fraction [FULL, FIRST_HALF, SECOND_HALF]
  lvdys_lvnum decimal(3,2) NOT NULL DEFAULT 1.00, -- day value (1.00 or 0.50)
  lvdys_iswko boolean NOT NULL DEFAULT false, -- falls on weekly off
  lvdys_ishld boolean NOT NULL DEFAULT false, -- falls on holiday
  lvdys_ispay boolean NOT NULL DEFAULT true, -- is payable day
  lvdys_notes VARCHAR(255), -- remarks

  -- default 2
  lvdys_actve boolean NOT NULL DEFAULT true,
  lvdys_crusr VARCHAR(50) NOT NULL,
  lvdys_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvdys_upusr VARCHAR(50) NOT NULL,
  lvdys_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvdys_rvnmr integer NOT NULL DEFAULT 1
);
