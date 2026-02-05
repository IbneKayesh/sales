DROP DATABASE shopdb;
CREATE DATABASE shopdb;
USE shopdb;


-- purchase
DELETE FROM tmtb_paybl;
DELETE FROM tmpb_expns;

DELETE FROM tmpb_cbkng;
DELETE FROM tmpb_mbkng;

DELETE FROM tmpb_crcpt;
DELETE FROM tmpb_mrcpt;

DELETE FROM tmpb_cinvc;
DELETE FROM tmpb_minvc;

-- sales
DELETE FROM tmtb_rcvbl;
DELETE FROM tmeb_expns;

DELETE FROM tmeb_cinvc;
DELETE FROM tmeb_minvc;

-- inventory
DELETE FROM tmib_expns;

DELETE FROM tmib_ctrsf;
DELETE FROM tmib_mtrsf;

UPDATE tmib_bitem SET bitem_gstkq = 0, bitem_bstkq = 0, bitem_istkq = 0, bitem_pbqty = 0, bitem_sbqty = 0;