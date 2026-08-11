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