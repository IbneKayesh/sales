-- PROCEDURE: public.prc_price_avrat(text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.prc_price_avrat(text, text, text, text);

CALL prc_price_avrat(
);


CREATE OR REPLACE PROCEDURE public.prc_price_avrat(
	IN p_user_s text,
	IN p_user_c text,
	IN p_user_b text,
	IN p_user_d text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
	v_line INTEGER := 1;
BEGIN
	UPDATE tmib_price AS prc
	SET price_avrat = stk.stock_avrat
	FROM (
		SELECT stock_price AS item_id, SUM(stock_trqty * stock_cprat)/ NULLIF(SUM(stock_trqty), 0) AS stock_avrat
		FROM tmib_stock
		WHERE stock_ohqty > 0
		AND stock_users = p_user_c
		AND stock_bsins = p_user_b
		AND stock_dpart = p_user_d
		GROUP BY stock_price
	) AS stk
	WHERE prc.id = stk.item_id;
  --  COMMIT;
END;
$BODY$;
ALTER PROCEDURE public.prc_price_avrat(text, text, text, text)
    OWNER TO sgdpg;