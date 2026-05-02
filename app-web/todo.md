inquiry:
id [auto]
inquiry_no [auto generate after save]
inquiry_date [auto select current date]
required_date [auto select current date]
buyer_id [from buyer dropdown list]
inquiry_status [pending, wip]
inquiry_note
inquiry_value
reference_no
currency_id
order_group_id

inquiry_details:
id [auto]
inquiry_id
product_id [product list]
unit_id [unit list]
inquiry_qty
inquiry_price
required_date [auto select current date]
delivery_address_id [buyer_address_id]


inquiry_details_attributes:
id [auto]
inquiry_details_id [auto]
attributes_id [attribute list]
attributes_value