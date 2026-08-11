delete from tmmb_bosfg;
delete from tmmb_borpm;
delete from tmmb_bofoh;
delete from tmmb_bommf;


--mrr
delete from tmpb_mrrdm;
delete from tmpb_mrrdc;
delete from tmpb_mrrcs;
delete from tmpb_mrrpy;
--mrr stock
delete from tmib_stock;
--journal
delete from tmtb_jrnlm;
delete from tmtb_jrnlc;
--price stock
update tmib_price set price_gdstk = 0, price_bdstk = 0;
--contact balance
update tmcb_cntct set cntct_crbal = 0;



CALL prc_jrnlm(
    '6a45d609-f616-4cf8-97a9-8577ff39f753',
    '7d0a6d8b-efae-48a0-a595-15706cf41d2f',
    '4dee378c-acc5-49eb-ab9e-a4e85e1e1903',
    '7d0a6d8b-efae-48a1-a595-15706cf41d2f'
);

select * from tmsb_dpart


select * from tmtb_jrnlm;
select * from tmtb_jrnlc;




create table tmsb_dpart_bk AS
select * from tmsb_dpart;

drop table tmsb_dpart;


CREATE TABLE tmsb_dpart (
    -- default 1
  id varchar(50) PRIMARY KEY,
  dpart_users varchar(50) NOT NULL,
  dpart_bsins varchar(50) NOT NULL,
  dpart_ccode varchar(50) NOT NULL,

-- custom
  dpart_cname varchar(50) NOT NULL,
  dpart_ofadr varchar(50),
  dpart_emcap integer NOT NULL DEFAULT 1,
  dpart_stdst boolean NOT NULL DEFAULT true,
  dpart_stpur boolean NOT NULL DEFAULT true,
  dpart_stsal boolean NOT NULL DEFAULT true,
  dpart_stnsf boolean NOT NULL DEFAULT true,
  dpart_stpro boolean NOT NULL DEFAULT true,

  -- default 2
  dpart_actve boolean NOT NULL DEFAULT true,
  dpart_crusr varchar(50) NOT NULL,
  dpart_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_upusr varchar(50) NOT NULL,
  dpart_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dpart_rvnmr integer NOT NULL DEFAULT 1
);


insert into tmsb_dpart
SELECT id, dpart_users, dpart_bsins, dpart_ccode, dpart_cname, dpart_ofadr, dpart_emcap,
true,true,true,true,true,
dpart_actve, dpart_crusr, dpart_crdat, dpart_upusr, dpart_updat, dpart_rvnmr
	FROM public.tmsb_dpart_bk;

drop table tmsb_dpart_bk;


create table tmib_items_bk
AS
select * from tmib_items;

drop table tmib_items;

CREATE TABLE tmib_items (
  -- default 1
  id varchar(50) PRIMARY KEY,
  items_users VARCHAR(50) NOT NULL,
  items_bsins VARCHAR(50) NOT NULL,
  items_ccode VARCHAR(50) NOT NULL,

  -- custom
  items_icode VARCHAR(50),
  items_iname VARCHAR(100) NOT NULL,
  items_brcod VARCHAR(50),
  items_hscod VARCHAR(50),
  items_notes VARCHAR(50),
  items_runit VARCHAR(50),
  items_pkqty integer NOT NULL DEFAULT 1,
  items_punit VARCHAR(50),
  items_szqty integer NOT NULL DEFAULT 1,
  items_sunit VARCHAR(50),
  items_sgrup VARCHAR(50),
  items_scatg VARCHAR(50),
  items_itype VARCHAR(2) DEFAULT 'FG', --RM,PM,WIP,FG,FOH,SVC
  items_brand VARCHAR(50),
  items_tstck boolean DEFAULT true,
  items_pivat decimal(4,2) DEFAULT 0.00,
  items_pdvat decimal(4,2) DEFAULT 0.00,
  items_sdvat decimal(4,2) DEFAULT 0.00,
  items_smrgn decimal(4,2) DEFAULT 0.00,
  items_fxcst decimal(4,2) DEFAULT 0.00,
  items_image VARCHAR(50),
  items_stpur boolean NOT NULL DEFAULT true,
  items_stsal boolean NOT NULL DEFAULT true,
  items_stnsf boolean NOT NULL DEFAULT true,
  
  -- default 2
  items_actve boolean NOT NULL DEFAULT true,
  items_crusr VARCHAR(50) NOT NULL,
  items_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  items_upusr VARCHAR(50) NOT NULL,
  items_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  items_rvnmr integer NOT NULL DEFAULT 1
);


insert into tmib_items
SELECT id, items_users, items_bsins, items_ccode, items_icode, items_iname, items_brcod, items_hscod, items_notes, items_runit, items_pkqty, items_punit, items_szqty, items_sunit, items_sgrup, items_scatg, items_itype, items_brand, items_tstck, 0, 0, items_sdvat, items_smrgn, items_fxcst, items_image, items_stpur, items_stsal, items_stnsf, items_actve, items_crusr, items_crdat, items_upusr, items_updat, items_rvnmr
	FROM tmib_items_bk;
  
drop table tmib_items_bk;