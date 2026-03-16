DROP DATABASE shopdb;
CREATE DATABASE shopdb;
USE shopdb;


-- purchase invoice
DELETE FROM tmpb_cinvc;
DELETE FROM tmpb_minvc;
DELETE FROM tmtb_paybl;
DELETE FROM tmpb_expns;


-- sales invoice
DELETE FROM tmeb_cinvc;
DELETE FROM tmeb_minvc;
DELETE FROM tmtb_rcvbl;
DELETE FROM tmeb_expns;

-- stock reset
UPDATE tmib_bitem SET bitem_gstkq = 0, bitem_bstkq = 0, bitem_istkq = 0, bitem_pbqty = 0, bitem_sbqty = 0;


-- purchase booking
DELETE FROM tmpb_cbkng;
DELETE FROM tmpb_mbkng;


-- purchase receipt
DELETE FROM tmpb_crcpt;
DELETE FROM tmpb_mrcpt;


-- inventory
DELETE FROM tmib_expns;
DELETE FROM tmib_ctrsf;
DELETE FROM tmib_mtrsf;



DROP DATABASE sgddb WITH (FORCE);
CREATE DATABASE sgddb;