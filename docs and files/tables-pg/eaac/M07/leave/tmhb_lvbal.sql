--
-- Table structure for table tmhb_lvbal
-- Employee Leave Balances (Yearly opening, entitled, carried forward, used, pending, and remaining balance)
--

CREATE TABLE tmhb_lvbal (
  -- default 1
  id VARCHAR(50) PRIMARY KEY,
  lvbal_users VARCHAR(50) NOT NULL,
  lvbal_bsins VARCHAR(50) NOT NULL,
  lvbal_ccode VARCHAR(50) NOT NULL,

  -- custom
  lvbal_emply VARCHAR(50) NOT NULL, -- employee id
  lvbal_lvtyp VARCHAR(50) NOT NULL, -- leave type id
  lvbal_lvplc VARCHAR(50), -- leave policy id
  lvbal_lyear integer NOT NULL, -- leave year (e.g. 2026)
  lvbal_opbal decimal(5,2) NOT NULL DEFAULT 0.00, -- opening balance
  lvbal_entds decimal(5,2) NOT NULL DEFAULT 0.00, -- entitlement days for the year
  lvbal_crfds decimal(5,2) NOT NULL DEFAULT 0.00, -- carry forward days from previous year
  lvbal_adjds decimal(5,2) NOT NULL DEFAULT 0.00, -- manual adjustment days (+ or -)
  lvbal_totds decimal(5,2) NOT NULL DEFAULT 0.00, -- total available days (opbal + entds + crfds + adjds)
  lvbal_usdds decimal(5,2) NOT NULL DEFAULT 0.00, -- approved / used leave days
  lvbal_pndds decimal(5,2) NOT NULL DEFAULT 0.00, -- pending approval leave days
  lvbal_remds decimal(5,2) NOT NULL DEFAULT 0.00, -- remaining available balance (totds - usdds - pndds)
  lvbal_notes VARCHAR(255), -- remarks

  -- default 2
  lvbal_actve boolean NOT NULL DEFAULT true,
  lvbal_crusr VARCHAR(50) NOT NULL,
  lvbal_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvbal_upusr VARCHAR(50) NOT NULL,
  lvbal_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lvbal_rvnmr integer NOT NULL DEFAULT 1
);
