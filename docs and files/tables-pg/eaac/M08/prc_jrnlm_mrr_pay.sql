-- PROCEDURE: public.prc_jrnlm_mrr_pay(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm_mrr_pay(text, text, text, text);

CALL prc_jrnlm_mrr_pay(
    '6a45d609-f616-4cf8-97a9-8577ff39f753',
    '7d0a6d8b-efae-48a0-a595-15706cf41d2f',
    '4dee378c-acc5-49eb-ab9e-a4e85e1e1903',
    '7d0a6d8b-efae-48a1-a595-15706cf41d2f'
);


CREATE OR REPLACE PROCEDURE public.prc_jrnlm_mrr_pay(
	IN p_user_s text,
	IN p_user_c text,
	IN p_user_b text,
	IN p_user_d text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    rec_pen_mrr_pay RECORD;
	rec_pen_mrr_pay_child RECORD;
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
    --GET PENDING MRR PAYMENT, WILL CREATE JV FOR EACH MRR PAYMENT
    FOR rec_pen_mrr_pay IN
		--FIND MASTER TRN WITH JV REF
		SELECT mrm.mrrdm_crncy, mrm.mrrdm_ttype, pty.id dr_party, pty.party_chtac chtac_id, SUM(mpy.mrrpy_pdamt) dr_value
			FROM tmpb_mrrpy mpy
			JOIN tmpb_mrrdm mrm ON mpy.mrrpy_mrrdm = mrm.id
			JOIN tmtb_party pty ON mrm.mrrdm_cntct = pty.party_vndor
			JOIN tmtb_prtyn ptn ON pty.party_chtac = ptn.prtyn_chtac
			LEFT JOIN tmtb_jrnlc jnc ON mpy.id = jnc.jrnlc_refid
			WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
			AND ptn.prtyn_ctype = 'PAYABLE'
			AND jnc.jrnlc_refid IS NULL
			AND mrm.mrrdm_users = p_user_c
			AND mrm.mrrdm_bsins = p_user_b
			AND mrm.mrrdm_dpart = p_user_d
			GROUP BY mrm.mrrdm_crncy, mrm.mrrdm_ttype, pty.id, pty.party_chtac
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
            rec_pen_mrr_pay.mrrdm_crncy, 'Payment Voucher',  v_jv_no, CURRENT_DATE, 'MRR Payment Voucher', rec_pen_mrr_pay.mrrdm_ttype,
            0,  0, 'Posted', p_user_s, p_user_s );
		--2. INS Supplier Party DR
		INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
								jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
								jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
					VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_mrr_pay.chtac_id,
								rec_pen_mrr_pay.dr_party, rec_pen_mrr_pay.dr_value, 0, 'Clear Liabilites', rec_pen_mrr_pay.mrrdm_ttype, 'SYS_',
								v_line, p_user_s, p_user_s);
		v_line := v_line + 1;

			
				FOR rec_pen_mrr_pay_child IN		
					--2.1 GET PAYMENT
					SELECT mpy.id, mpy.mrrpy_party cr_party, ptc.party_chtac chtac_id, mpy.mrrpy_pdamt cr_value
					FROM tmpb_mrrpy mpy
					JOIN tmpb_mrrdm mrm ON mpy.mrrpy_mrrdm = mrm.id
					JOIN tmtb_party pty ON mrm.mrrdm_cntct = pty.party_vndor
					JOIN tmtb_prtyn ptn ON pty.party_chtac = ptn.prtyn_chtac
					JOIN tmtb_party ptc ON mpy.mrrpy_party = ptc.id
					LEFT JOIN tmtb_jrnlc jnc ON mpy.id = jnc.jrnlc_refid
					WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
					AND ptn.prtyn_ctype = 'PAYABLE'
					AND jnc.jrnlc_refid IS NULL
					AND pty.id = rec_pen_mrr_pay.dr_party
				LOOP
					--2.2 INS Cash Party CR
					INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
								jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
								jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
					VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_mrr_pay_child.chtac_id,
								rec_pen_mrr_pay_child.cr_party, 0, rec_pen_mrr_pay_child.cr_value, 'Supplier Liabilites Payment', 'SYS_', rec_pen_mrr_pay_child.id,
								v_line, p_user_s, p_user_s);
					v_line := v_line + 1;
				END LOOP;

    END LOOP;	
    COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_jrnlm_mrr_pay(text, text, text, text)
    OWNER TO sgdpg;