-- PROCEDURE: public.prc_jrnlm(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm(text, text, text, text);

CREATE OR REPLACE PROCEDURE public.prc_jrnlm(
	IN p_user_s text,
	IN p_user_c text,
	IN p_user_b text,
	IN p_user_d text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    rec_pen_mrr RECORD;
	rec_pen_mrr_child RECORD;
	rec_pen_mrr_paym RECORD;
	rec_pen_mrr_excs RECORD;
    v_acprd_id TEXT;
    v_fsyar_id TEXT;
    v_jv_no TEXT;
    v_jv_id TEXT;
	v_pay_party_id TEXT;
	v_pay_chtac_id TEXT;
	v_payable_value DECIMAL;
	v_payble_ivat DECIMAL;
BEGIN
    SELECT prd.id, prd.acprd_fsyar
    INTO v_acprd_id, v_fsyar_id
    FROM tmtb_acprd prd
    WHERE prd.acprd_dpart = p_user_d
      AND prd.acprd_bsins = p_user_b
      AND prd.acprd_users = p_user_c
      AND prd.acprd_stats = 'Open'
      AND prd.acprd_iscur = TRUE
      AND prd.acprd_actve = TRUE
    LIMIT 1;
	--MRR
    --GET PENDING MRR
    FOR rec_pen_mrr IN
        SELECT mrm.id, mrm.mrrdm_users,  mrm.mrrdm_bsins, mrm.mrrdm_dpart, mrm.mrrdm_crncy,
               mrm.mrrdm_cntct, mrm.mrrdm_trnno, mrm.mrrdm_ttype, mrm.mrrdm_pyamt
        FROM tmpb_mrrdm mrm
        LEFT JOIN tmtb_jrnlm jrm ON mrm.mrrdm_trnno = jrm.jrnlm_refno
        WHERE jrm.jrnlm_refno IS NULL
		AND mrm.mrrdm_users = p_user_c
		AND mrm.mrrdm_bsins = p_user_b
		AND mrm.mrrdm_dpart = p_user_d
    LOOP
        v_jv_id := gen_random_uuid()::text;
		
        v_jv_no := func_gen_new_trn(
            p_user_c,
            p_user_b,
            p_user_d,
            'tmtb_jrnlm',
            'Purchase Voucher'
        );

       INSERT INTO tmtb_jrnlm (id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
			jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
			jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_crusr, jrnlm_upusr )
       VALUES (v_jv_id, p_user_c, p_user_b, p_user_d, v_fsyar_id, v_acprd_id,
            rec_pen_mrr.mrrdm_crncy, 'Purchase Voucher',  v_jv_no, CURRENT_DATE, rec_pen_mrr.mrrdm_trnno, rec_pen_mrr.mrrdm_ttype,
            0,  0, 'Posted', p_user_s, p_user_s );
			
            FOR rec_pen_mrr_child IN		
				-- GET INVENTORY COST = amount - item discount - invoice discount + ivat + fix cost + include cost + exclude cost
				SELECT mrd.id, mrd.mrrdc_users, mrd.mrrdc_bsins, mrd.mrrdc_mrrdm, mrd.mrrdc_items,
					(mrd.mrrdc_itamt + mrd.mrrdc_ivamt + mrd.mrrdc_fcamt + mrd.mrrdc_icamt + mrd.mrrdc_ecamt)
					- (mrd.mrrdc_dsamt + mrd.mrrdc_edamt) as inv_cost,
				     pty.party_chtac AS chtac_id, pty.id AS party_id
				FROM tmpb_mrrdc mrd
				JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
				WHERE mrd.mrrdc_mrrdm = rec_pen_mrr.id
			LOOP
				--INS INVENTORY COST
				INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
							jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
							jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
				VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_mrr_child.chtac_id,
							rec_pen_mrr_child.party_id, rec_pen_mrr_child.inv_cost, 0, 'To Products Inventory', rec_pen_mrr.mrrdm_ttype, rec_pen_mrr_child.id,
							1, p_user_s, p_user_s); --1 will replace by line
			END LOOP;

			--GET PAYABLE SUPPLIER COST ACCOUNTS
			SELECT pty.id , pty.party_chtac
			INTO v_pay_party_id, v_pay_chtac_id
	          FROM tmtb_prtyn ptn
	          JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
	          WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
	          AND ptn.prtyn_ctype = 'PAYABLE'
			  AND pty.party_vndor = rec_pen_mrr.mrrdm_cntct
			  LIMIT 1;
			--GET PAYABLE SUPPLIER COST VALUES
			SELECT SUM((mrd.mrrdc_itrat * mrd.mrrdc_itqty) - (mrd.mrrdc_dsamt + mrd.mrrdc_edamt)),
				   SUM(mrd.mrrdc_ivamt)
			INTO v_payable_value, v_payble_ivat
			FROM tmpb_mrrdc mrd
			JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
			WHERE mrd.mrrdc_mrrdm = rec_pen_mrr.id
			LIMIT 1;
			--INS PAYABLE SUPPLIER COST VALUES
			INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
				        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
				        jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
	      	VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
					v_pay_party_id, 0, v_payable_value, 'From Supplier Payable - MRR', rec_pen_mrr.mrrdm_ttype, rec_pen_mrr.id,
					1, p_user_s, p_user_s); -- 1 line with replace

			-- GET COST EXT VALUES LIB
			FOR rec_pen_mrr_excs IN
				SELECT mcs.id mrrpy_id, mcs.mrrcs_party party_id, mcs.mrrcs_value, pty.party_chtac chtac_id
				FROM tmpb_mrrcs mcs
				JOIN tmtb_party pty ON  mcs.mrrcs_party = pty.id
				LEFT JOIN tmtb_jrnlc jnc ON mcs.id = jnc.jrnlc_refid
				WHERE mcs.mrrcs_mrrdm = rec_pen_mrr.id
				--AND mcs.mrrcs_csmod = 'Exclude'
				AND jnc.jrnlc_refid IS NULL
			LOOP
			-- INS COST EXT VALUES LIB
			INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
				        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
				        jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
	        VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_mrr_excs.chtac_id,
					rec_pen_mrr_excs.party_id, 0, rec_pen_mrr_excs.mrrcs_value, 'From Cost Payble - MRR', rec_pen_mrr.mrrdm_ttype, rec_pen_mrr_paym.mrrpy_id,
					1, p_user_s, p_user_s); -- 1 line with replace

			--INS COST EXT VALUES PAY
			--	SELECT pty.id , pty.party_chtac
				--INTO v_pay_party_id, v_pay_chtac_id
		          --FROM tmtb_prtyn ptn
		          --JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
		          --WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
		          --AND ptn.prtyn_ctype = 'PAYMENTS_EXPENSES'
				  --AND pty.party_users = p_user_c
				  --LIMIT 1;

				----INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
			---			jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
				--		jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
		--		VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
			--			v_pay_party_id, 0, rec_pen_mrr_excs.mrrcs_value, 'Expense Payment - MRR', rec_pen_mrr.mrrdm_ttype, rec_pen_mrr.id,
				--		1, p_user_s, p_user_s); -- 1 line with replace
			END LOOP;
    END LOOP;
	--MRR Payments
    --GET MRR PAYMENT VALUES
    FOR rec_pen_mrr_paym IN
        SELECT mpy.id mrrpy_id, mpy.mrrpy_party party_id, mpy.mrrpy_pdamt pdamt_value, pty.party_chtac chtac_id,
        mrm.mrrdm_crncy, mrm.mrrdm_ttype, mrm.mrrdm_cntct
        FROM tmpb_mrrpy mpy
        JOIN tmpb_mrrdm mrm ON mpy.mrrpy_mrrdm = mrm.id
        JOIN tmtb_party pty ON mpy.mrrpy_party = pty.id
        LEFT JOIN tmtb_jrnlc jnc ON mpy.id = jnc.jrnlc_refid
        WHERE jnc.jrnlc_refid IS NULL
        AND mpy.mrrpy_users = p_user_c
        AND mpy.mrrpy_bsins = p_user_b
        AND mrm.mrrdm_dpart = p_user_d      
    LOOP
    v_jv_id := gen_random_uuid()::text;
    v_jv_no := func_gen_new_trn(
    p_user_c,
    p_user_b,
    p_user_d,
    'tmtb_jrnlm',
    'Payment Voucher'
    );
    
	--GET PAYABLE SUPPLIER COST ACCOUNTS
    SELECT pty.id , pty.party_chtac
    INTO v_pay_party_id, v_pay_chtac_id
        FROM tmtb_prtyn ptn
        JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
        WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
        AND ptn.prtyn_ctype = 'PAYABLE'
        AND pty.party_vndor = rec_pen_mrr_paym.mrrdm_cntct
        LIMIT 1;

    --INS PAYMENT VALUES Asset/Cr
    INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
                jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
                jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
    VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_mrr_paym.chtac_id,
            rec_pen_mrr_paym.party_id, 0, rec_pen_mrr_paym.pdamt_value, 'From Current Assets - MRR', rec_pen_mrr_paym.mrrdm_ttype, rec_pen_mrr_paym.mrrpy_id,
            1, p_user_s, p_user_s); -- 1 line with replace

    --INS PAYMENT VALUES Liabilities/Dr
    INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
    VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
            v_pay_party_id, rec_pen_mrr_paym.pdamt_value, 0, 'To Supplier Liablities Clear - MRR', rec_pen_mrr_paym.mrrdm_ttype, rec_pen_mrr_paym.mrrpy_id,
            1, p_user_s, p_user_s); -- 1 line with replace

    END LOOP;

	
    COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_jrnlm(text, text, text, text)
    OWNER TO sgdpg;