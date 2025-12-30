house (id, name, address, contact , image, map_link, general_rules)
flat (id, house_id, name, contact, image, price, general_rules)
rules [no_smoking, no_pets, no_party, no_guest, no_early_check_out, no_late_check_in, only_females, only_males]

features (id, flat_id, name, feature_type, include_price, price, quantity)
feature_type [bedroom, bathroom, kitchen, living_room, balcony, terrace, garden, parking, security, swimming_pool, gym, club, lift, elevator, air_conditioning, heating, wifi, cable]

tenant (id, flat_id, name, contact, image, contract_start_date, contract_end_date, rent, deposit, security)
payment (id, tenant_id, amount, date, payment_type)
payment_type [cash, card, upi]

house_notice_board (id, house_id, title, description, image, date)
flat_notice_board (id, flat_id, title, description, image, date)

