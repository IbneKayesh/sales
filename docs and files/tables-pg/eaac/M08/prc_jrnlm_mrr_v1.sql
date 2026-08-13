-- PROCEDURE: public.prc_jrnlm_mrr(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm_mrr(text, text, text, text);

CALL prc_jrnlm_mrr(
    '6a45d609-f616-4cf8-97a9-8577ff39f753',
    '7d0a6d8b-efae-48a0-a595-15706cf41d2f',
    '4dee378c-acc5-49eb-ab9e-a4e85e1e1903',
    '7d0a6d8b-efae-48a1-a595-15706cf41d2f'
);


CREATE OR REPLACE PROCEDURE public.prc_jrnlm_mrr(
	IN p_user_s text,
	IN p_user_c text,
	IN p_user_b text,
	IN p_user_d text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    rec_pen_mrr RECORD;
	rec_pen_mrr_child RECORD;
    v_acprd_id TEXT;
    v_fsyar_id TEXT;
    v_jv_no TEXT;
    v_jv_id TEXT;
	v_pay_party_id TEXT;
	v_pay_chtac_id TEXT;
	v_payable_value DECIMAL;
	v_payble_ivat DECIMAL;
	v_line INTEGER := 1;
BEGIN
	--total dr cr calculation pending
	BEGIN
		-- GET CURRENT FISCAL YEAR
		-- 1 Values assigned normally
		SELECT prd.id, prd.acprd_fsyar
		INTO v_acprd_id, v_fsyar_id
		FROM tmtb_acprd prd
		WHERE prd.acprd_dpart = p_user_d
		AND prd.acprd_bsins = p_user_b
		AND prd.acprd_users = p_user_c
		AND prd.acprd_stats = 'Open'
		AND prd.acprd_iscur = TRUE
		AND prd.acprd_actve = TRUE;
		--LIMIT 1;
	EXCEPTION
		-- 0 Error: NO_DATA_FOUND
		WHEN NO_DATA_FOUND THEN
			RAISE EXCEPTION 'No current fiscal year found.';
		-- 2+ Error: TOO_MANY_ROWS
		WHEN TOO_MANY_ROWS THEN
			RAISE EXCEPTION 'Multiple current fiscal years found. Data configuration is invalid.';
	END;
	--BLOCK PROCESSING DATA
    --GET PENDING MRR, WILL CREATE JV FOR EACH MRR
    FOR rec_pen_mrr IN
		--FIND MASTER TRN WITH JV REF
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
		--1. CREATE Purchase Voucher JVM FOR EACH MRR
       INSERT INTO tmtb_jrnlm (id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
			jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
			jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_crusr, jrnlm_upusr )
       VALUES (v_jv_id, p_user_c, p_user_b, p_user_d, v_fsyar_id, v_acprd_id,
            rec_pen_mrr.mrrdm_crncy, 'Purchase Voucher',  v_jv_no, CURRENT_DATE, rec_pen_mrr.mrrdm_trnno, rec_pen_mrr.mrrdm_ttype,
            0,  0, 'Posted', p_user_s, p_user_s );
			
				FOR rec_pen_mrr_child IN		
					--1.2 GET INVENTORY COST = item amount - item discount - invoice discount + ivat + fix cost + include cost + exclude cost
					SELECT mrd.id, mrd.mrrdc_users, mrd.mrrdc_bsins, mrd.mrrdc_mrrdm, mrd.mrrdc_items,
						(mrd.mrrdc_itamt + mrd.mrrdc_ivamt + mrd.mrrdc_fcamt + mrd.mrrdc_icamt + mrd.mrrdc_ecamt)
						- (mrd.mrrdc_dsamt + mrd.mrrdc_edamt) as inv_cost,
						pty.party_chtac AS chtac_id, pty.id AS party_id
					FROM tmpb_mrrdc mrd
					JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
					WHERE mrd.mrrdc_mrrdm = rec_pen_mrr.id
				LOOP
					--1.2 INS INVENTORY COST
					INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
								jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
								jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
					VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_mrr_child.chtac_id,
								rec_pen_mrr_child.party_id, rec_pen_mrr_child.inv_cost, 0, 'To Products Inventory', rec_pen_mrr.mrrdm_ttype, rec_pen_mrr_child.id,
								v_line, p_user_s, p_user_s);
					v_line := v_line + 1;
				END LOOP;

			--2.1 GET PAYABLE SUPPLIER COST ACCOUNTS
			SELECT pty.id , pty.party_chtac
			INTO v_pay_party_id, v_pay_chtac_id
	          FROM tmtb_prtyn ptn
	          JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
	          WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
	          AND ptn.prtyn_ctype = 'PAYABLE'
			  AND pty.party_vndor = rec_pen_mrr.mrrdm_cntct
			  LIMIT 1;
			--2.2 GET PAYABLE SUPPLIER COST VALUES
			SELECT SUM((mrd.mrrdc_itrat * mrd.mrrdc_itqty) - (mrd.mrrdc_dsamt + mrd.mrrdc_edamt)),
				   SUM(mrd.mrrdc_ivamt)
			INTO v_payable_value, v_payble_ivat
			FROM tmpb_mrrdc mrd
			JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
			WHERE mrd.mrrdc_mrrdm = rec_pen_mrr.id;
			--2.3 INS PAYABLE SUPPLIER COST VALUES
			INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
				        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
				        jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
	      	VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
					v_pay_party_id, 0, v_payable_value, 'From Supplier Payable - MRR', rec_pen_mrr.mrrdm_ttype, rec_pen_mrr.id,
					v_line, p_user_s, p_user_s);

    END LOOP;	
   -- COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_jrnlm_mrr(text, text, text, text)
    OWNER TO sgdpg;