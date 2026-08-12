-- PROCEDURE: public.prc_jrnlm_inv(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm_inv(text, text, text, text);

CALL prc_jrnlm_inv(
    '6a45d609-f616-4cf8-97a9-8577ff39f753',
    '7d0a6d8b-efae-48a0-a595-15706cf41d2f',
    '4dee378c-acc5-49eb-ab9e-a4e85e1e1903',
    '7d0a6d8b-efae-48a1-a595-15706cf41d2f'
);


CREATE OR REPLACE PROCEDURE public.prc_jrnlm_inv(
	IN p_user_s text,
	IN p_user_c text,
	IN p_user_b text,
	IN p_user_d text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    rec_pen_inv RECORD;
	rec_pen_inv_child RECORD;
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
    --GET PENDING SALES INVOICE, WILL CREATE JV FOR EACH SALES INVOICE
    FOR rec_pen_inv IN
		--FIND MASTER TRN WITH JV REF
        SELECT ivm.id, ivm.invcm_users, ivm.invcm_bsins, ivm.invcm_dpart, ivm.invcm_crncy,
               ivm.invcm_cntct, ivm.invcm_trnno, ivm.invcm_ttype, ivm.invcm_pyamt
        FROM tmob_invcm ivm
        LEFT JOIN tmtb_jrnlm jrm ON ivm.invcm_trnno = jrm.jrnlm_refno
        WHERE jrm.jrnlm_refno IS NULL
		AND ivm.invcm_users = p_user_c
		AND ivm.invcm_bsins = p_user_b
		AND ivm.invcm_dpart = p_user_d
    LOOP
        v_jv_id := gen_random_uuid()::text;
		
        v_jv_no := func_gen_new_trn(
            p_user_c,
            p_user_b,
            p_user_d,
            'tmtb_jrnlm',
            'Sales Voucher'
        );
		--1. CREATE Sales Voucher JVM FOR EACH SALES INVOICE
       INSERT INTO tmtb_jrnlm (id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
			jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
			jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_crusr, jrnlm_upusr )
       VALUES (v_jv_id, p_user_c, p_user_b, p_user_d, v_fsyar_id, v_acprd_id,
            rec_pen_inv.invcm_crncy, 'Sales Voucher',  v_jv_no, CURRENT_DATE, rec_pen_inv.invcm_trnno, rec_pen_inv.invcm_ttype,
            0,  0, 'Posted', p_user_s, p_user_s );
				
		--1.2 GET Customer Receivable / DR
		SELECT pty.id, pty.party_chtac
		INTO v_pay_party_id, v_pay_chtac_id
		FROM tmtb_prtyn ptn
		JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
		WHERE ptn.prtyn_cname = 'SYS_SALES_INVOICE'
		AND ptn.prtyn_ctype = 'RECEIVABLE'
		AND pty.party_vndor = rec_pen_inv.invcm_cntct
		LIMIT 1;
		--1.2 INS CUSTOMER RECEIVABLE ASSETS / DR
		INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
					jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
					jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
		VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
					v_pay_party_id, rec_pen_inv.invcm_pyamt, 0, 'To Customer Sales', rec_pen_inv.invcm_ttype, rec_pen_inv.id,
					v_line, p_user_s, p_user_s);
		v_line := v_line + 1;

		--2.1 GET INCOME PRODUCT SALES / CR
		SELECT pty.id, pty.party_chtac
		INTO v_pay_party_id, v_pay_chtac_id
		FROM tmtb_prtyn ptn
		JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
		WHERE ptn.prtyn_cname = 'SYS_SALES_INVOICE'
		AND ptn.prtyn_ctype = 'INCOME'
		LIMIT 1;
		--2.2 INS INCOME PRODUCT SALES / CR
		INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
					jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
					jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
		VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
					v_pay_party_id, 0, rec_pen_inv.invcm_pyamt, 'From Customer Sales', rec_pen_inv.invcm_ttype, rec_pen_inv.id,
					v_line, p_user_s, p_user_s);
		v_line := v_line + 1;

		--3. LOOP ITEM OF SALES INVOICE ASSETS / CR
		FOR rec_pen_inv_child IN
			SELECT ivc.id invcc_id, ivc.invcc_csrat, pty.id party_id, pty.party_chtac chtac_id
			FROM tmob_invcc ivc
			JOIN tmtb_party pty ON ivc.invcc_items = pty.party_vndor
			WHERE ivc.invcc_invcm = rec_pen_inv.id
		LOOP
		INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
					jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
					jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
		VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, rec_pen_inv_child.chtac_id,
					rec_pen_inv_child.party_id, 0, rec_pen_inv_child.invcc_csrat, 'To Customer Sales Product Stock Reduce', rec_pen_inv.invcm_ttype, rec_pen_inv_child.invcc_id,
					v_line, p_user_s, p_user_s);
		v_line := v_line + 1;
		END LOOP;
		--3.1 GET PRODUCT EXPENSES / DR
		SELECT pty.id, pty.party_chtac
		INTO v_pay_party_id, v_pay_chtac_id
		FROM tmtb_prtyn ptn
		JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
		WHERE ptn.prtyn_cname = 'SYS_SALES_INVOICE'
		AND ptn.prtyn_ctype = 'COGS'
		LIMIT 1;
		SELECT SUM(ivc.invcc_csrat)
		INTO v_payable_value
			FROM tmob_invcc ivc
			JOIN tmtb_party pty ON ivc.invcc_items = pty.party_vndor
			WHERE ivc.invcc_invcm = rec_pen_inv.id;
		--3.2 INS PRODUCT EXPENSES / DR
		INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
					jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
					jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
		VALUES (gen_random_uuid()::text, p_user_c, p_user_b, p_user_d, v_jv_id, v_pay_chtac_id,
					v_pay_party_id, v_payable_value, 0 , 'From Customer Sales Product Stock Expenses', rec_pen_inv.invcm_ttype, rec_pen_inv.id,
					v_line, p_user_s, p_user_s);
		v_line := v_line + 1;

    END LOOP;	
    COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_jrnlm_inv(text, text, text, text)
    OWNER TO sgdpg;