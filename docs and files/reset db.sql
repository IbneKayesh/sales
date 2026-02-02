drop table tmab_bsins;
drop table tmab_users;
drop table tmcb_cntct;
drop table tmib_bitem;
drop table tmib_ctgry;
drop table tmib_items;
drop table tmib_iuofm;
drop table tmsb_crgrn;
drop table tmtb_bacts;
drop table tmtb_ledgr;
drop table tmtb_trhed;
drop table tmpb_bking;
drop table tmtb_rcvpy;
drop table tmub_notes;
drop table tmub_tickt;
drop table tmpb_cbkng;
drop table tmpb_crcpt;
drop table tmpb_expns;
drop table tmpb_mrcpt;
drop table tmtb_paybl;
drop table tmpb_mbkng;
drop table tmcb_dzone;
drop table tmcb_rutes;
drop table tmcb_tarea;
drop table tmib_attrb;
drop table tmpb_cinvc;
drop table tmpb_minvc;
drop table tmib_ctrsf;
drop table tmib_mtrsf;



-- purchase
DELETE FROM tmpb_expns;
DELETE FROM tmtb_paybl;

DELETE FROM tmpb_mbkng;
DELETE FROM tmpb_cbkng;

DELETE FROM tmpb_mrcpt;
DELETE FROM tmpb_crcpt;

DELETE FROM tmpb_minvc;
DELETE FROM tmpb_cinvc;

UPDATE tmib_bitem SET bitem_gstkq = 0, bitem_bstkq = 0, bitem_istkq = 0, bitem_pbqty = 0, bitem_sbqty = 0;