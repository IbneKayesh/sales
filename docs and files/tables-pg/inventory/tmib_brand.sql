--
-- Table structure for table tmib_brand
--

CREATE TABLE tmib_brand (
  id varchar(50) PRIMARY KEY,

  brand_users varchar(50) NOT NULL,
  brand_brnam varchar(50) NOT NULL,
  -- optional
  
  -- default
  brand_actve boolean NOT NULL DEFAULT true,
  brand_crusr varchar(50) NOT NULL,
  brand_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  brand_upusr varchar(50) NOT NULL,
  brand_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  brand_rvnmr integer NOT NULL DEFAULT 1
);