-- PROCEDURE: public.prc_jrnlm_drcr(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm_drcr(text, text, text, text);

CREATE OR REPLACE PROCEDURE public.prc_jrnlm_drcr(
	IN p_user_s text,
	IN p_user_c text,
	IN p_user_b text,
	IN p_user_d text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
	v_line INTEGER := 1;
BEGIN
--update journal master dr cr value
	UPDATE tmtb_jrnlm jrm
	SET
		jrnlm_drval = jrc.drval,
		jrnlm_crval = jrc.crval
	FROM (
		SELECT jrc.jrnlc_jrnlm, SUM(jrc.jrnlc_drval) AS drval, SUM(jrc.jrnlc_crval) AS crval
		FROM tmtb_jrnlc jrc
		JOIN tmtb_jrnlm jrm ON jrm.id = jrc.jrnlc_jrnlm
		WHERE jrm.jrnlm_drval = 0
		AND jrm.jrnlm_users = p_user_c
		AND jrm.jrnlm_bsins = p_user_b
		AND jrm.jrnlm_dpart = p_user_d
		GROUP BY jrc.jrnlc_jrnlm
	) jrc
	WHERE jrm.id = jrc.jrnlc_jrnlm
		AND jrm.jrnlm_users = p_user_c
		AND jrm.jrnlm_bsins = p_user_b
		AND jrm.jrnlm_dpart = p_user_d;
	--update party current value
	UPDATE tmtb_party AS pty
	SET party_crbal = jrc.crval
	FROM (
		SELECT
			jrnlc_party,
			SUM(jrnlc_drval) - SUM(jrnlc_crval) AS crval
		FROM tmtb_jrnlc jrc
		WHERE jrc.jrnlc_users = p_user_c
		AND jrc.jrnlc_bsins = p_user_b
		GROUP BY jrnlc_party
	) AS jrc
	WHERE jrc.jrnlc_party = pty.id
	AND pty.party_users = p_user_c
	AND pty.party_bsins = p_user_b;
	--update contact current balance
	UPDATE tmcb_cntct AS cnt
	SET cntct_crbal = pty.party_crbal
	FROM (
		SELECT pty.party_vndor, SUM(pty.party_crbal) as party_crbal
		FROM tmcb_cntct cnt
		JOIN tmtb_party pty ON cnt.id = pty.party_vndor
		WHERE cnt.cntct_actve = TRUE
		AND pty.party_users = p_user_c
		AND pty.party_bsins = p_user_b
		GROUP BY pty.party_vndor
	) AS pty	
	WHERE pty.party_vndor = cnt.id
	AND cnt.cntct_users = p_user_c
	AND cnt.cntct_bsins = p_user_b;
  --  COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_jrnlm_drcr(text, text, text, text)
    OWNER TO sgdpg;

