--
-- Table structure for table tmhb_lvplc
-- Leave Policies (Entitlements and rules per leave group, leave type, and year)
--

CREATE TABLE tmhb_lvplc (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvplc_users VARCHAR(50) NOT NULL,
  lvplc_bsins VARCHAR(50) NOT NULL,
  lvplc_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvplc_lvgrp VARCHAR(50) NOT NULL, -- leave group id
  lvplc_lvtyp VARCHAR(50) NOT NULL, -- leave type id
  lvplc_pyear integer NOT NULL, -- policy year (e.g. 2026)
  lvplc_entds decimal(5,2) NOT NULL DEFAULT 0.00, -- annual entitlement days
  lvplc_acrmd VARCHAR(50) NOT NULL DEFAULT 'YEARLY_UPFRONT', -- accrual method [YEARLY_UPFRONT, MONTHLY_PRO_RATA]
  lvplc_alwcf boolean NOT NULL DEFAULT false, -- carry forward allowed
  lvplc_maxcf decimal(5,2) DEFAULT 0.00, -- maximum carry forward days limit
  lvplc_expru VARCHAR(50) DEFAULT 'YEAR_END', -- expiry rule [YEAR_END, ROLLING_12M, NO_EXPIRY]
  lvplc_maxcd integer DEFAULT 0, -- maximum consecutive days allowed (0 = unlimited)
  lvplc_minsv integer DEFAULT 0, -- minimum service days required before eligible
  lvplc_lftds decimal(5,2) DEFAULT 0.00, -- lifetime limit days (e.g. 180 for maternity, 90 for paternity)
  lvplc_notes VARCHAR(255), -- remarks

  -- default 2
  lvplc_actve boolean NOT NULL DEFAULT true,
  lvplc_crusr VARCHAR(50) NOT NULL,
  lvplc_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvplc_upusr VARCHAR(50) NOT NULL,
  lvplc_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvplc_rvnmr integer NOT NULL DEFAULT 1
);
