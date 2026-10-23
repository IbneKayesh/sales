
PROCEDURE insert_po_master_RFQ(p_oid out varchar2,p_mrq_id in varchar2, p_supp_id in varchar2,p_trntyp_id in varchar2,p_po_dt in date, p_delv_dt in date, p_delv_loc in varchar2, 
                             p_delv_add in varchar2,p_po_ref in varchar2, p_ref_dt in varchar2,p_notes in varchar2, p_posted in varchar2, p_post_dt in date, p_status in varchar2,
                             p_iuser in varchar2, p_sysuser in varchar2, p_sysname in varchar2, p_sysip in varchar2, p_loc_id in number, p_rcv_loc_id in number )
 is
 newid varchar2(40); 
 sahd varchar2(20);
 rcv_sahd varchar2(20);
 is_supplier_tagged varchar2(50);
 v_loc_id number;
 v_wh_id number;
 v_cunit_id number;
 
 begin
    select nvl(payee_oid,'x') into is_supplier_tagged
       from t_suppliers
   where upper(supp_id)=upper(p_supp_id);

   
   if(is_supplier_tagged!='x') then
   
   select 'PO'||substr(p_mrq_id,10,4)||to_char(to_date(p_po_dt,'dd/MM/yyyy'),'MMyy')||(nvl(max(to_number(substr(POM_ID,-5,5))),10000)+1) into newid from V_PO_CODE_GEN
   where  substr(MRQ_ID,10,4) = substr(p_mrq_id,10,4) and to_char(to_date(POM_DT,'dd/MM/yyyy'),'MMyy') = to_char(to_date(p_po_dt,'dd/MM/yyyy'),'MMyy');
   
   select l.SAHD_OID into sahd from t_locations l where l.LOC_ID = p_loc_id;
   select l.SAHD_OID into rcv_sahd from t_locations l where l.LOC_ID = p_rcv_loc_id;
   select prm.wh_id, prm.dept_id, prm.loc_id into v_wh_id,v_cunit_id, v_loc_id from t_mrq_master prm where mrq_id = p_mrq_id;
   
   insert into T_PO_MASTER( POM_ID,
                            POM_NO,
                            MRQ_ID,                                                      
                            SUPP_ID,
                            TRN_TYPE_ID,                                                    
                            POM_DT,
                            DELV_DT,
                            SHIPTO_LOC,
                            SHIPTO_ADD,
                            POM_REF,
                            REF_DT,
                            POM_NOTES,                            
                            IS_POSTED,
                            POSTED_DATE,
                            POM_STATUS,
                            PO_BY,
                            IUSER,
                            DT_INSERTED,
                            ROGUID,
                            SYSUSER,
                            SYSNAME,
                            SYSIP,
                            LOC_ID,
                            SAHD_OID,
                            RCV_SAHD_OID,
                            PR_LOC_ID,
                            PR_WH_ID,
                            CUNIT_ID,
                            PAY_SAHD_OID,
                            TYPE_FLAG
                            )
                values     ('POMxxx'||newid,
                            newid,
                            p_mrq_id,                                               
                            p_supp_id,
                            p_trntyp_id,                                                    
                            p_po_dt,
                            p_delv_dt,
                            p_delv_loc,
                            p_delv_add,
                            p_po_ref,
                            p_ref_dt,
                            p_notes,
                            'Y',
                            sysdate,
                            p_status,
                            p_iuser,
                            p_iuser,
                            sysdate,
                            SYS_GUID(),
                            p_sysuser,
                            p_sysname,
                            p_sysip,
                            p_loc_id,
                            sahd, 
                            rcv_sahd,
                            v_loc_id,
                            v_wh_id,
                            v_cunit_id,
                            sahd,
                            'RFQ'
                           -- DECODE(sahd,'SAHDxxx002','SAHDxxx002','SAHDxxx001')
                            );
                            
                            
             update t_chal_recv
                    set po_made = 'Y',
                    po_dt = to_date(sysdate, 'dd/MM/yyyy')
                    where pr_no = substr(p_mrq_id, -15,15) ;  
  

   commit;
   
   p_oid:= 'POMxxx' || newid;
--   open p_cur for
--   select 'POMxxx' || newid pom_id from dual;
  
  else
  
     log_errors (p_error_message => SQLERRM || ' Supplers not tagged with acc. module ' || p_supp_id);   
     ROLLBACK;
  end if; 
      
    
   EXCEPTION
    WHEN OTHERS THEN
    log_errors (p_error_message => SQLERRM);
    ROLLBACK;
    
    
 end insert_po_master_RFQ; 




 




PROCEDURE INS_PI(P_JSON_OBJ IN CLOB, P_USER_ID IN VARCHAR2, P_CURSOR OUT SYS_REFCURSOR, P_ESP_MSG OUT VARCHAR2)
IS
V_SCOMP_ID VARCHAR2(50);
V_LCPIMSTR_SCOMP VARCHAR2(50);
V_LCPIMSTR_POMAS VARCHAR2(50);
V_LCPIMSTR_PODT DATE;
V_LCPIMSTR_PINO VARCHAR2(50);
V_LCPIMSTR_PIDT DATE;
V_LCPIMSTR_LSUPL VARCHAR2(50);
V_LCPIMSTR_SCUNTRY VARCHAR2(50);
V_LCPIMSTR_NOTE VARCHAR2(50);
V_LCPIMSTR_ACTV VARCHAR2(50);
V_LCPIMSTR_POSF VARCHAR2(50);
--GENERATED VALUES
V_LCPIMSTR_TRNO_ID VARCHAR2(50);
V_LCPIMSTR_TRNO VARCHAR2(50);
V_LCPIMSTR_SQNO VARCHAR2(50);
--GENERATED VALUES :: DETAIL
V_LCIMP_DETLS_ID VARCHAR2(50);
V_LINE_ID NUMBER :=1;
V_DATA_COUNT NUMBER :=0;
BEGIN
   P_ESP_MSG := 'OK';
    --MASTER DATA PARSE JSON VALUES
       SELECT JT.SCOMP_ID, JT.LCPIMSTR_SCOMP, JT.LCPIMSTR_POMAS, JT.LCPIMSTR_PODT, JT.LCPIMSTR_PINO, JT.LCPIMSTR_PIDT, JT.LCPIMSTR_LSUPL, JT.LCPIMSTR_SCUNTRY,
            JT.LCPIMSTR_NOTE, JT.LCPIMSTR_ACTV, JT.LCPIMSTR_POSF
            
       INTO V_SCOMP_ID, V_LCPIMSTR_SCOMP, V_LCPIMSTR_POMAS, V_LCPIMSTR_PODT, V_LCPIMSTR_PINO, V_LCPIMSTR_PIDT, V_LCPIMSTR_LSUPL, V_LCPIMSTR_SCUNTRY,
            V_LCPIMSTR_NOTE, V_LCPIMSTR_ACTV, V_LCPIMSTR_POSF
       FROM JSON_TABLE(
            P_JSON_OBJ,
            '$'
            COLUMNS(
                SCOMP_ID VARCHAR2(50) PATH '$.SCOMP_ID',
                LCPIMSTR_SCOMP VARCHAR2(50) PATH '$.LCPIMSTR_SCOMP',
                LCPIMSTR_POMAS VARCHAR2(50) PATH '$.LCPIMSTR_POMAS',
                LCPIMSTR_PODT DATE PATH '$.LCPIMSTR_PODT',
                LCPIMSTR_PINO VARCHAR2(50) PATH '$.LCPIMSTR_PINO',
                LCPIMSTR_PIDT DATE PATH '$.LCPIMSTR_PIDT',
                LCPIMSTR_LSUPL VARCHAR2(50) PATH '$.LCPIMSTR_LSUPL',
                LCPIMSTR_SCUNTRY VARCHAR2(50) PATH '$.LCPIMSTR_SCUNTRY',
                LCPIMSTR_NOTE VARCHAR2(100) PATH '$.LCPIMSTR_NOTE',
                LCPIMSTR_ACTV VARCHAR2(1) PATH '$.LCPIMSTR_ACTV',
                LCPIMSTR_POSF VARCHAR2(1) PATH '$.LCPIMSTR_POSF'
                )
        ) JT;
        
        SELECT COUNT(*) INTO V_DATA_COUNT
        FROM T_LCPI_MASTER
        WHERE LCPIMSTR_PINO = V_LCPIMSTR_PINO;
        
        IF V_DATA_COUNT > 0 THEN
            P_ESP_MSG := V_LCPIMSTR_PINO || ' - PI/Indent is already exists';
            RETURN;
        END IF;
        
        
--        SELECT * FROM T_LCPI_DETAILS FETCH FIRST 1 ROWS ONLY
    --Generete new PI no
--       SELECT TO_CHAR(SYSDATE, 'YYMM') || LPAD( NVL(COUNT(*), 0) + 1, 3, '0' ) INTO V_LCPIMSTR_TRNO
--       FROM T_LCPI_MASTER_TEST
--       WHERE TO_CHAR(TO_DATE(LCPIMSTR_PIDT,'dd/MM/yyyy'),'MMyy') = TO_CHAR(TO_DATE(SYSDATE,'dd/MM/yyyy'),'MMyy');
       
        SELECT 'PI' || TO_CHAR(TO_DATE(V_LCPIMSTR_PIDT,'dd/MM/yy'),'yyMM') ||
                SUBSTR(NVL(MAX(TO_NUMBER(SUBSTR(LCPIMSTR_TRNO,7,7))),0)+1000001,2,6) INTO V_LCPIMSTR_TRNO
        FROM T_LCPI_MASTER
        WHERE TO_CHAR(LCPIMSTR_PIDT,'yyMM') = TO_CHAR(TO_DATE(V_LCPIMSTR_PIDT,'dd/MM/yy'),'yyMM');
        
        
        SELECT SUBSTR(NVL(MAX(TO_NUMBER(SUBSTR(LCPIMSTR_SQNO,1,4))),0)+10001,2,4) ||'/'|| 
               TO_CHAR(TO_DATE(V_LCPIMSTR_PIDT,'dd/MM/yy'),'yy') INTO V_LCPIMSTR_SQNO
        FROM T_LCPI_MASTER
        WHERE SUBSTR(LCPIMSTR_SQNO,6,2) = TO_CHAR(TO_DATE(V_LCPIMSTR_PIDT,'dd/MM/yy'),'yy');


       
    --Generate PI Master ID
    SELECT 'LPIFMxxxxxx' || V_LCPIMSTR_TRNO INTO V_LCPIMSTR_TRNO_ID FROM DUAL;
    --Insert PI Master
    Insert into T_LCPI_MASTER
       (OID, LCPIMSTR_PINO, LCPIMSTR_PIDT, LCPIMSTR_LANO, LCPIMSTR_SCOMP, 
        LCPIMSTR_SCUNTRY, LCPIMSTR_SPDT, LCPIMSTR_EXDT, LCPIMSTR_ACTV, LCPIMSTR_POSF, 
        LCPIMSTR_SQNO, LCPIMSTR_NOTE, LCPIMSTR_LCTP, LCPIMSTR_POMAS, LCPIMSTR_PODT, 
        LCPIMSTR_POTYP, LCPIMSTR_COMPLT, LCPIMSTR_ADDNOTE, LCPIMSTR_NOTEFALG, LCPIMSTR_LSUPL, 
        IUSER, EUSER, IDAT, EDAT, LCPIMSTR_TRNO)
    Values
       (V_LCPIMSTR_TRNO_ID, V_LCPIMSTR_PINO, TO_DATE(V_LCPIMSTR_PIDT, 'DD/MM/YY'), NULL, V_SCOMP_ID, 
        V_LCPIMSTR_SCUNTRY, TRUNC(SYSDATE), TRUNC(SYSDATE), 'Y', 'Y', 
        V_LCPIMSTR_SQNO, V_LCPIMSTR_NOTE, 'I', V_LCPIMSTR_POMAS, TO_DATE(V_LCPIMSTR_PODT,'DD/MM/YY'), 
        '0', 'N', NULL, '0', V_LCPIMSTR_LSUPL, 
        P_USER_ID, P_USER_ID, SYSDATE,SYSDATE, V_LCPIMSTR_TRNO);
 
    --DETAIL DATA PARSE JSON VALUES
        FOR IJT IN (        
            SELECT LCPIDETL_LITEM, LCPIDETL_QNTY, LCPIDETL_SMUNT, LCPIDETL_RATE, LCPIDETL_LCNCY, LCPIDETL_BDT, LCPIDETL_PODTL,
            LCPIDETL_SCUNTRY
            FROM JSON_TABLE(
            P_JSON_OBJ,
            '$.ITEMS[*]'
            COLUMNS(
                LCPIDETL_LITEM VARCHAR2(50) PATH '$.LCPIDETL_LITEM',
                LCPIDETL_QNTY VARCHAR2(50) PATH '$.LCPIDETL_QNTY',
                LCPIDETL_SMUNT VARCHAR2(50) PATH '$.LCPIDETL_SMUNT',
                LCPIDETL_RATE NUMBER PATH '$.LCPIDETL_RATE',
                LCPIDETL_LCNCY VARCHAR2(50) PATH '$.LCPIDETL_LCNCY',
                LCPIDETL_BDT NUMBER PATH '$.LCPIDETL_BDT',
                LCPIDETL_PODTL VARCHAR2(50) PATH '$.LCPIDETL_PODTL',
                LCPIDETL_SCUNTRY VARCHAR2(50) PATH '$.LCPIDETL_SCUNTRY'
                   )
            )
        )
        
        --Insert IP Details within loop
        LOOP
        --Generate IP Detail ID
        --SELECT 'IPDxxx' || V_LCIMP_MASTER_TRNO || LPAD(TO_CHAR(V_LINE_ID), 3, '0') INTO V_LCIMP_DETLS_ID FROM DUAL;
        Insert into T_LCPI_DETAILS
           (OID, LCPIDETL_MASTER, LCPIDETL_LITEM, LCPIDETL_QNTY, LCPIDETL_SMUNT, 
            LCPIDETL_RATE, LCPIDETL_LCNCY, LCPIDETL_BDT, LCPIDETL_LINE, LCPIDETL_AMDF, 
            LCPIDETL_POSF, LCPIDETL_PODTL, LCPIDETL_SCUNTRY, LCPIDETL_DO_BREAK, 
            IUSER, EUSER, IDAT, EDAT)
         Values
           ('LPIFDxxxx' || V_LCPIMSTR_TRNO || V_LINE_ID, V_LCPIMSTR_TRNO_ID, IJT.LCPIDETL_LITEM, IJT.LCPIDETL_QNTY, IJT.LCPIDETL_SMUNT, 
            IJT.LCPIDETL_RATE, IJT.LCPIDETL_LCNCY, IJT.LCPIDETL_BDT , V_LINE_ID , '0', 
            'Y', IJT.LCPIDETL_PODTL, IJT.LCPIDETL_SCUNTRY, NULL,
            P_USER_ID, P_USER_ID, sysdate, sysdate);


        V_LINE_ID := V_LINE_ID + 1;  -- Increase value
        END LOOP;
       

    --DETAIL DATA PARSE JSON VALUES
      /*  FOR IJTB IN (        
            SELECT LCPI_MASTER_OID, POD_ID, LCIMP_DETLS_OID, LCIMP_DETLS_LITEM, LCIMP_DETLS_QNTY
            FROM JSON_TABLE(
            P_JSON_OBJ,
            '$.ITEMSIP[*]'
            COLUMNS(
                LCPI_MASTER_OID VARCHAR2(50) PATH '$.LCPI_MASTER_OID',
                POD_ID VARCHAR2(50) PATH '$.POD_ID',
                LCIMP_DETLS_OID VARCHAR2(50) PATH '$.LCIMP_DETLS_OID',
                LCIMP_DETLS_LITEM VARCHAR2(50) PATH '$.LCIMP_DETLS_LITEM',
                LCIMP_DETLS_QNTY NUMBER PATH '$.LCIMP_DETLS_QNTY'
                   )
            )
        )
        
        --Insert IP Details within loop
        LOOP
        --Generate IP Detail ID
        INSERT INTO T_LCPI_LCIMP_PO (LCPI_MASTER_OID, POD_ID, LCIMP_DETLS_OID, LCIMP_DETLS_LITEM, LCIMP_DETLS_QNTY,
            IUSER, EUSER, IDAT, EDAT) 
        VALUES (V_LCPIMSTR_TRNO_ID, IJTB.POD_ID, IJTB.LCIMP_DETLS_OID, IJTB.LCIMP_DETLS_LITEM, IJTB.LCIMP_DETLS_QNTY,
            P_USER_ID, P_USER_ID, sysdate, sysdate );
        END LOOP; 
 */
        COMMIT;
        
       OPEN P_CURSOR FOR
       SELECT V_LCPIMSTR_TRNO FROM DUAL;
EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
    P_ESP_MSG := 'Error: ' || SUBSTR(SQLERRM, 1, 4000);
END INS_PI;