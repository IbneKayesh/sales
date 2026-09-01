-- PROCEDURE: public.prc_jrnlm_drcr(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm_drcr(text, text, text, text);

CALL prc_jrnlm_drcr(
);


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
	UPDATE tmtb_jrnlm jrm
	SET
		jrnlm_drval = jrc.drval,
		jrnlm_crval = jrc.crval
	FROM (
		SELECT jrc.jrnlc_jrnlm, SUM(jrc.jrnlc_drval) AS drval, SUM(jrc.jrnlc_crval) AS crval
		FROM tmtb_jrnlc jrc
		JOIN tmtb_jrnlm jrm ON jrm.id = jrc.jrnlc_jrnlm
		WHERE jrm.jrnlm_drval = 0
		GROUP BY jrc.jrnlc_jrnlm
	) jrc
	WHERE jrm.id = jrc.jrnlc_jrnlm
		AND jrm.jrnlm_users = p_user_c
		AND jrm.jrnlm_bsins = p_user_b
		AND jrm.jrnlm_dpart = p_user_d;
  --  COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_jrnlm_drcr(text, text, text, text)
    OWNER TO sgdpg;