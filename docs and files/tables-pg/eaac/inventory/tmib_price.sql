--
-- Table structure for table tmib_price
--

CREATE TABLE tmib_price (
  id varchar(50) PRIMARY KEY,

  price_apusr varchar(50) NOT NULL,
  price_bsins varchar(50) NOT NULL,
  price_mcode varchar(50) NOT NULL,
  price_mname varchar(50) NOT NULL,
  -- optional
  -- default
  price_actve boolean NOT NULL DEFAULT true,
  price_crusr varchar(50) NOT NULL,
  price_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  price_upusr varchar(50) NOT NULL,
  price_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  price_rvnmr integer NOT NULL DEFAULT 1
);