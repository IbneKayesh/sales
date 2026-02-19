function PurchaseBookingDrCr(currentItem) {
  let acDrCr = [];
  const total_amount_dr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: currentItem.contact_name + " - Advance Booking",
    debit_amount: currentItem.total_amount,
    credit_amount: 0,
  };
  acDrCr.push(total_amount_dr);

  const total_amount_cr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "to A/C Default",
    debit_amount: 0,
    credit_amount: currentItem.total_amount,
  };
  acDrCr.push(total_amount_cr);

  const paid_amount_dr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: currentItem.contact_name + " - Purchase Payment",
    debit_amount: 0,
    credit_amount: currentItem.paid_amount,
  };
  acDrCr.push(paid_amount_dr);

  const paid_amount_cr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "to A/C Default",
    debit_amount: currentItem.paid_amount,
    credit_amount: 0,
  };
  acDrCr.push(paid_amount_cr);

  const cost_amount_dr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "Default Contact - Purchase Expenses",
    debit_amount: currentItem.cost_amount,
    credit_amount: 0,
  };
  acDrCr.push(cost_amount_dr);

  const cost_amount_cr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "to A/C Default",
    debit_amount: 0,
    credit_amount: currentItem.cost_amount,
  };
  acDrCr.push(cost_amount_cr);
  return acDrCr;
}

function PurchaseReceiveDrCr(currentItem) {
  let acDrCr = [];
  const total_amount_dr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: currentItem.contact_name + " - Advance Booking",
    debit_amount: currentItem.total_amount,
    credit_amount: 0,
  };
  acDrCr.push(total_amount_dr);

  const total_amount_cr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "to A/C Default",
    debit_amount: 0,
    credit_amount: currentItem.total_amount,
  };
  acDrCr.push(total_amount_cr);

  const paid_amount_dr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: currentItem.contact_name + " - Purchase Payment",
    debit_amount: 0,
    credit_amount: currentItem.paid_amount,
  };
  acDrCr.push(paid_amount_dr);

  const paid_amount_cr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "to A/C Default",
    debit_amount: currentItem.paid_amount,
    credit_amount: 0,
  };
  acDrCr.push(paid_amount_cr);

  const cost_amount_dr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "Default Contact - Purchase Expenses",
    debit_amount: currentItem.cost_amount,
    credit_amount: 0,
  };
  acDrCr.push(cost_amount_dr);

  const cost_amount_cr = {
    contact_id: currentItem.contact_id,
    trans_name: currentItem.order_type,
    ref_no: currentItem.order_no,
    trans_details: "to A/C Default",
    debit_amount: 0,
    credit_amount: currentItem.cost_amount,
  };
  acDrCr.push(cost_amount_cr);
  return acDrCr;
}

function generateDrCr(currentItem) {
  if (currentItem.order_type === "Purchase Booking") {
    return PurchaseBookingDrCr(currentItem);
  } else if (currentItem.order_type === "Purchase Receive") {
    return PurchaseReceiveDrCr(currentItem);
  }
}

export { generateDrCr };
