
procedure insert_po_details_RFQ(p_pom_id in varchar2,p_mrq_id in varchar2, p_mrqd_id in varchar2, p_itm_id in varchar2, p_unit_id in number, 
                            p_pr_qty in number, p_po_qty in number, p_itm_rate in number, p_lp_rate in number,p_vat in number, p_frght in number, p_dis in number,
                            p_rqrd_dt date, p_spec in varchar2, p_rmks in varchar2,p_iuser in varchar2, p_pur_type in varchar2, p_purchsr in varchar2, p_brnd_id in varchar2, 
                            p_add_charges in number,p_event_no in varchar2 )
 is
 newid varchar2(40);
 totrow number; v_req_qty number;v_po_qty number;
 pendqty number(20,2);
 v_lcflg varchar2(5);
 v_event_no varchar2(50);
 v_resp_child_id varchar2(50);
 v_event_exist number;
 v_supp varchar2(50);
 
 --cursor temp is select  po_qty from  T_PO_DETAILS where POM_ID= p_pom_id; 
 cursor temp is select  PEND_QTY  from  T_PO_DETAILS where POD_ID= 'PODxxx'||newid; 
 cur_rec temp%rowtype;

 begin
         select MRQ_QTY into v_req_qty 
             from T_MRQ_DETAILS
         where MRQ_DET_ID=p_mrqd_id;
          
         select  nvl(sum(po_qty),0) into v_po_qty
              from  T_PO_DETAILS
         where MRQ_DET_ID= p_mrqd_id and IS_REJCT='N';         
         
         select count(*) into v_event_exist from city_etender.vw_event_approved where mrq_det_id = p_mrqd_id;
         
         if v_event_exist>0 then
            
            select supp_id into v_supp  from t_po_master where pom_id = p_pom_id;
         
            select resp_child_id,event_no into v_resp_child_id, v_event_no 
            from city_etender.vw_event_approved where mrq_det_id = p_mrqd_id and upper(event_no) = upper(p_event_no) and vendor_code = v_supp;
         else
            v_event_no:='x'; 
            v_resp_child_id:='x';   
         end if;
         
 
--            v_event_no:='x'; 
--            v_resp_child_id:='x'; 
            
    if(v_po_qty+p_po_qty<=v_req_qty)  then    
 
         select substr(p_pom_id,-15,15)|| (nvl(max(to_number(substr(POD_ID,-3,3))),100)+1) into newid from T_PO_DETAILS
         where substr(POM_ID,-15,15)=substr(p_pom_id,-15,15);
         
         select LC_FLG into v_lcflg  from t_po_master where pom_id = p_pom_id;
         
         insert into T_PO_DETAILS(POD_ID,
                                  POM_ID,
                                  MRQ_DET_ID,
                                  ITM_ID,
                                  ITMUNIT_ID,
                                  PR_QTY,
                                  PO_QTY,
                                  PEND_QTY,
                                  ITM_RATE,
                                  LINE_TOTAL,
                                  VAT,
                                  TOTAL_WITH_VAT,
                                  FREIGHT,
                                  DISCOUNT,
                                  RQRD_DT,
                                  ITM_SPEC,
                                  REMARKS,
                                  IUSER,
                                  DT_INSERTED,
                                  ROGUID,
                                  PUR_TYPE,
                                  PURCHSR,
                                  LP_RATE,
                                  BRND_ID,
                                  ADD_CHARGES,
                                  IS_APRVD,
                                  RESP_CHILD_ID,
                                  EVENT_NO
                                  )
                           values('PODxxx'||newid,
                                   p_pom_id,
                                   p_mrqd_id,
                                   p_itm_id,
                                   p_unit_id,
                                   p_pr_qty,
                                   p_po_qty,
                                   v_req_qty-(v_po_qty+p_po_qty),
                                   --v_req_qty-p_po_qty,
                                   p_itm_rate,
                                   p_po_qty*p_itm_rate,
                                   p_vat,
                                   ((p_po_qty*p_itm_rate)+((p_po_qty*p_itm_rate)*(p_vat/100))),
                                   p_frght,
                                   p_dis,
                                   p_rqrd_dt,
                                   p_spec,
                                   p_rmks,
                                   p_iuser,
                                   sysdate,
                                   SYS_GUID(),
                                   p_pur_type,
                                   p_purchsr,
                                   p_lp_rate,
                                   p_brnd_id,
                                   p_add_charges,
                                   'N',--decode(v_lcflg,'Y','Y','N')
                                   v_resp_child_id,
                                   v_event_no
                                   );
                                   
        
 

    open temp;

        loop
        
        fetch temp into cur_rec;
        exit when temp%notfound;   
                
            if cur_rec.PEND_QTY > 0 then                             
                update    T_MRQ_DETAILS set PO_MADE = 'N', PEND_PO_QTY = cur_rec.PEND_QTY, is_pend = 'Y'
                where MRQ_DET_ID =  p_mrqd_id;
               
            elsif cur_rec.PEND_QTY = 0 then
                update    T_MRQ_DETAILS set PO_MADE = 'Y',PEND_PO_QTY = cur_rec.PEND_QTY, is_pend = 'N'
                where MRQ_DET_ID =  p_mrqd_id;               
            end if; 
            
       end loop;                        
      

        if v_resp_child_id != 'x' then
        
            insert into CITY_ETENDER.T_RESP_PO (
                    POD_ID
                    ,POM_NO
                    ,POM_DT
                    ,PO_QTY
                    ,RESP_CHILD_ID
                    ,CREATE_USER
                    ,UPDATE_USER
                )
            values
                (
                    'PODxxx'||newid
                    ,substr(p_pom_id,-15,15)
                    ,to_date(to_char(sysdate,'dd/MM/yyyy'),'dd/MM/yyyy')
                    ,p_po_qty
                    ,v_resp_child_id
                    ,p_iuser
                    ,p_iuser
                )
           
            ;
            
            
            UPDATE CITY_ETENDER.T_RESP_MASTER RM
                SET RM.IS_PO = 'Y'
                ,RM.UPDATE_DATE = SYSDATE
                WHERE RM.IS_PO = 'N'
                AND RM.IS_SELECT = 1                
                AND EXISTS (
                    SELECT 1
                    FROM CITY_ETENDER.T_RESP_CHILD RC
                    WHERE RC.RESP_CHILD_ID = v_resp_child_id
                    AND RC.RESP_ID = RM.RESP_ID
                    );

            
        end if;



      
--            select  sum(PEND_QTY) into pendqty from  T_PO_DETAILS where MRQ_DET_ID= p_mrqd_id;
--                if pendqty > 0 then                             
--                    update    T_MRQ_DETAILS set PO_MADE = 'N', PEND_PO_QTY = pendqty, is_pend = 'Y'
--                    where MRQ_DET_ID =  p_mrqd_id;
--                   
--                elsif pendqty = 0 then
--                    update    T_MRQ_DETAILS set PO_MADE = 'Y',PEND_PO_QTY = pendqty, is_pend = 'N'
--                    where MRQ_DET_ID =  p_mrqd_id;               
--                end if;     
--                
               
--        select count(*) into totrow from T_MRQ_DETAILS where mrq_id = p_mrq_id and po_made = 'N' ;
--            if totrow = 0 then
--                update T_MRQ_MASTER set po_made = 'Y'
--                where mrq_id = p_mrq_id;
--                
--                update t_chal_rcvm set po_made = 'Y', po_dt = sysdate
--                where mrq_id = p_mrq_id;
--            end if;
      
    else /* PO > req */
        log_errors (p_error_message => 'PO qty > PR qty not allowed' || ' -- ' || p_pom_id  || ' - raised from RFQ PO details while inserting in T_PO_DETAILS');
    end if;
    
   commit;      
      
   EXCEPTION
   WHEN OTHERS THEN
   log_errors (p_error_message => SQLERRM || ' -- ' || p_pom_id  || ' - raised from RFQ PO details while inserting in T_PO_DETAILS');
   ROLLBACK;
 
 end insert_po_details_RFQ;   
 
 