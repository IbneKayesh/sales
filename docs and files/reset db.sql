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
--sale invoice
delete from tmob_invcm;
delete from tmob_invcc;
delete from tmob_invcs;
delete from tmob_invpy;
--update party balance
update tmtb_party set party_crbal = 0;
--production process
delete from tmmb_prsfg;
delete from tmmb_prfoh;
delete from tmmb_prrpm;
delete from tmmb_promf;
delete from tmmb_prbtc;
--production bom
delete from tmmb_bommf;
delete from tmmb_borpm;
delete from tmmb_bofoh;
delete from tmmb_bosfg;
--adjustment
delete from tmib_adjsc;
delete from tmib_adjsm;
--stock merge trnsactions
delete from tmib_stkmg;