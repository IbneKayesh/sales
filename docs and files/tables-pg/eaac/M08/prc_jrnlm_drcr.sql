-- PROCEDURE: public.prc_jrnlm_drcr(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_jrnlm_drcr(text, text, text, text);

CALL prc_jrnlm_drcr(
    '6a45d609-f616-4cf8-97a9-8577ff39f753',
    '7d0a6d8b-efae-48a0-a595-15706cf41d2f',
    '4dee378c-acc5-49eb-ab9e-a4e85e1e1903',
    '7d0a6d8b-efae-48a1-a595-15706cf41d2f'
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