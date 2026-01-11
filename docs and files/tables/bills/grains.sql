

SELECT 'tmtb_trhed' as name, trhed_users as users, COUNT(*) as count
FROM `tmtb_trhed`
WHERE `trhed_updat` >= CURDATE() - INTERVAL 1 DAY AND `trhed_updat` < CURDATE()
GROUP BY trhed_users;