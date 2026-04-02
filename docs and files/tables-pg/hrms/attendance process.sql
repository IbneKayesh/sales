-- 1. create empty attendance list
INSERT INTO tmhb_attnd (id, attnd_users, attnd_bsins, attnd_emply, attnd_wksft,
attnd_atdat, attnd_dname, attnd_sname, attnd_crusr, attnd_upusr)
SELECT gen_random_uuid(), emp.emply_users, emp.emply_bsins, emp.id, emp.emply_wksft,
DATE '2026-04-02',TO_CHAR(DATE '2026-04-02', 'Day'),'Pending','userid','userid'
FROM tmhb_emply emp
WHERE emp.emply_actve = TRUE
AND emp.emply_wksft IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM tmhb_attnd tnd
    WHERE tnd.attnd_emply = emp.id
      AND tnd.attnd_users = emp.emply_users
      AND tnd.attnd_bsins = emp.emply_bsins
      AND tnd.attnd_atdat >= DATE '2026-04-01'
      AND tnd.attnd_atdat <  DATE '2026-04-30'
      AND tnd.attnd_users = $1
      AND tnd.attnd_bsins = $2
);
-- 2. holiday process
UPDATE tmhb_attnd t
SET 
    attnd_sname = 'Present',
    attnd_notes = hdy.hlday_hldnm
FROM tmhb_hlday hdy
WHERE hdy.hlday_yerid = 2026
  AND hdy.hlday_hldat::DATE = t.attnd_atdat::DATE
  AND hdy.hlday_users = t.attnd_users
  AND hdy.hlday_bsins = t.attnd_bsins
  AND t.attnd_sname = 'Pending';

-- 3. Leave and IOM Process
UPDATE tmhb_attnd t
SET 
    attnd_sname = qry.atnst_sname,
    attnd_notes = qry.lvapp_notes
FROM (
SELECT tnd.id, nst.atnst_sname, ap.lvapp_notes
FROM tmhb_lvapp ap
JOIN tmhb_attnd tnd ON ap.lvapp_frdat::date = tnd.attnd_atdat::date
AND ap.lvapp_todat::date = tnd.attnd_atdat::date
AND ap.lvapp_emply = tnd.attnd_emply
AND ap.lvapp_users = tnd.attnd_users
AND ap.lvapp_bsins = tnd.attnd_bsins
JOIN tmhb_atnst nst ON ap.lvapp_atnst = nst.id
AND nst.atnst_users = tnd.attnd_users
AND nst.atnst_bsins = tnd.attnd_bsins
WHERE ap.lvapp_yerid = 2026
AND tnd.attnd_sname = 'Pending'
)qry
WHERE t.id = qry.id



-- 4. find min or in time
UPDATE tmhb_attnd tnd
SET 
    attnd_intim = qry.atnlg_lgtim,
    attnd_trmni = qry.atnlg_trmnl
FROM (
    SELECT DISTINCT ON (tnd.id)
        tnd.id,
        nlg.atnlg_lgtim::time AS atnlg_lgtim,
        nlg.atnlg_trmnl
    FROM tmhb_atnlg nlg
    JOIN tmhb_emply emp 
        ON nlg.atnlg_ecode = emp.emply_ecode
    JOIN tmhb_attnd tnd 
        ON emp.id = tnd.attnd_emply
       AND tnd.attnd_users = emp.emply_users
       AND tnd.attnd_bsins = emp.emply_bsins
    WHERE tnd.attnd_atdat >= DATE '2026-04-01'
      AND tnd.attnd_atdat <  DATE '2026-04-30'      
      AND emp.attnd_users = $1
      AND emp.attnd_bsins = $2
    ORDER BY tnd.id, nlg.atnlg_lgtim ASC   -- MIN time from any terminal for each employee, instead of group by
) qry
WHERE tnd.id = qry.id
AND tnd.attnd_sname = 'Pending'
AND tnd.attnd_users = $1
AND tnd.attnd_bsins = $2;

-- 5. find max or out time
UPDATE tmhb_attnd tnd
SET 
    attnd_outim = qry.atnlg_lgtim,
    attnd_trmno = qry.atnlg_trmnl
FROM (
    SELECT DISTINCT ON (tnd.id)
        tnd.id,
        nlg.atnlg_lgtim::time AS atnlg_lgtim,
        nlg.atnlg_trmnl
    FROM tmhb_atnlg nlg
    JOIN tmhb_emply emp 
        ON nlg.atnlg_ecode = emp.emply_ecode
    JOIN tmhb_attnd tnd 
        ON emp.id = tnd.attnd_emply
       AND tnd.attnd_users = emp.emply_users
       AND tnd.attnd_bsins = emp.emply_bsins
    WHERE tnd.attnd_atdat >= DATE '2026-04-01'
      AND tnd.attnd_atdat <  DATE '2026-04-30'  
      AND emp.attnd_users = $1
      AND emp.attnd_bsins = $2
    ORDER BY tnd.id, nlg.atnlg_lgtim DESC   -- MIN time from any terminal for each employee, instead of group by
) qry
WHERE tnd.id = qry.id
AND tnd.attnd_sname = 'Pending'
AND tnd.attnd_users = $1
AND tnd.attnd_bsins = $2;

-- 6. find total working hours
UPDATE tmhb_attnd
SET attnd_totwh = EXTRACT(EPOCH FROM (attnd_outim - attnd_intim)) / 60::int
AND attnd_sname = 'Pending'
WHERE attnd_users = $1
AND attnd_bsins = $2;;

-- 7. find In Time status
UPDATE tmhb_attnd tnd
SET attnd_stsin = CASE
    WHEN tnd.attnd_intim BETWEEN 
         (wks.wksft_satim - (wks.wksft_btbst * INTERVAL '1 minute'))
         AND
         (wks.wksft_satim + (wks.wksft_gsmin * INTERVAL '1 minute'))
        THEN 'In Time'
    WHEN tnd.attnd_intim < (wks.wksft_satim - (wks.wksft_btbst * INTERVAL '1 minute'))
        THEN 'Early Entry'
    WHEN tnd.attnd_intim > (wks.wksft_satim + (wks.wksft_gsmin * INTERVAL '1 minute'))
        THEN 'Late Entry'
END
FROM tmhb_wksft wks
WHERE tnd.attnd_wksft = wks.id
AND tnd.attnd_sname = 'Pending'  
AND tnd.attnd_users = $1
AND tnd.attnd_bsins = $2;

-- 8. find Out Time status
UPDATE tmhb_attnd tnd
SET attnd_stsou = CASE
    WHEN tnd.attnd_outim BETWEEN 
         (wks.wksft_entim - (wks.wksft_gemin * INTERVAL '1 minute'))
         AND
         (wks.wksft_entim + (wks.wksft_btand * INTERVAL '1 minute'))
        THEN 'In Time'
    WHEN tnd.attnd_outim < (wks.wksft_entim - (wks.wksft_gemin * INTERVAL '1 minute'))
        THEN 'Early Out'
    WHEN tnd.attnd_outim > (wks.wksft_entim + (wks.wksft_btand * INTERVAL '1 minute'))
        THEN 'Late Out'
END
FROM tmhb_wksft wks
WHERE tnd.attnd_wksft = wks.id
AND tnd.attnd_sname = 'Pending'
AND tnd.attnd_users = $1
AND tnd.attnd_bsins = $2;

-- 9. find final status
UPDATE tmhb_attnd tnd
SET attnd_sname = CASE
    WHEN 
        (
            tnd.attnd_intim BETWEEN 
                (wks.wksft_satim - (wks.wksft_btbst * INTERVAL '1 minute'))
                AND
                (wks.wksft_satim + (wks.wksft_gsmin * INTERVAL '1 minute'))
        )
        AND
        (
            tnd.attnd_outim BETWEEN 
                (wks.wksft_entim - (wks.wksft_gemin * INTERVAL '1 minute'))
                AND
                (wks.wksft_entim + (wks.wksft_btand * INTERVAL '1 minute'))
        )
    THEN 'Present'
    ELSE 'Absent'
END
FROM tmhb_wksft wks
WHERE tnd.attnd_wksft = wks.id
AND wks.wksft_crday = FALSE
AND wks.wksft_sgpnc = FALSE
AND tnd.attnd_sname = 'Pending'
AND tnd.attnd_users = $1
AND tnd.attnd_bsins = $2;

-- 10. find overtime
UPDATE tmhb_attnd tnd
SET attnd_totoh = tnd.attnd_totwh - wks.wksft_wrhrs
FROM tmhb_wksft wks
WHERE tnd.attnd_wksft = wks.id
AND wks.wksft_ovrtm = TRUE
AND tnd.attnd_sname = 'Pending'
AND tnd.attnd_users = $1
AND tnd.attnd_bsins = $2;