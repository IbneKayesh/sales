SELECT mcs.id, mcs.mrrcs_users, mcs.mrrcs_bsins, mcs.mrrcs_mrrdm, mcs.mrrcs_party, mcs.mrrcs_csmod, mcs.mrrcs_value, mcs.mrrcs_notes,
mrm.mrrdm_ttype, mrm.mrrdm_trnno, mrm.mrrdm_trdat, pty.party_cname
FROM tmpb_mrrcs mcs
JOIN tmpb_mrrdm mrm ON mcs.mrrcs_mrrdm = mrm.id
JOIN tmtb_party pty ON mcs.mrrcs_party = pty.id
WHERE mcs.mrrcs_csmod = 'Exclude'
AND (mcs.mrrcs_jrnlm IS NULL OR TRIM(mcs.mrrcs_jrnlm) = '')
UNION ALL
SELECT ics.id, ics.invcs_users, ics.invcs_bsins, ics.invcs_invcm, ics.invcs_party, ics.invcs_csmod, ics.invcs_value, ics.invcs_notes,
ivm.invcm_ttype, ivm.invcm_trnno, ivm.invcm_trdat, pty.party_cname
FROM tmob_invcs ics
JOIN tmob_invcm ivm ON ics.invcs_invcm = ivm.id
JOIN tmtb_party pty ON ics.invcs_party = pty.id
WHERE ics.invcs_csmod = 'Exclude'
AND (ics.invcs_jrnlm IS NULL OR TRIM(ics.invcs_jrnlm) = '')