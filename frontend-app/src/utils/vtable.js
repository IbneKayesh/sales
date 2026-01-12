// Sample data from the user, grouped based on comments
const transOptions = [
  // Cash & Bank
  { label: "Cash In (+)", value: "Cash In", trans_head: "Cash and Bank" },
  { label: "Cash Out (-)", value: "Cash Out", trans_head: "Cash and Bank" },
  {
    label: "Deposit to Bank (-)",
    value: "Bank Deposit",
    trans_head: "Cash and Bank",
  },
  {
    label: "Withdraw from Bank (+)",
    value: "Bank Withdraw",
    trans_head: "Cash and Bank",
  },

  // Dues (Receivables/Payables)
  { label: "Customer Due (+)", value: "Customer Due", trans_head: "Dues" },
  {
    label: "Customer Due Received (+)",
    value: "Due Received",
    trans_head: "Dues",
  },
  { label: "Supplier Due (-)", value: "Supplier Due", trans_head: "Dues" },
  { label: "Supplier Due Paid (-)", value: "Due Paid", trans_head: "Dues" },


];

// Transform transOptions into a list of objects with id, name, and trans_head
const defaultList = transOptions.map((item, index) => ({
  id: index + 1,
  label: item.label,
  value: item.value,
  trans_head: item.trans_head,
}));

function getListByTransHead(transhead) {
  return defaultList.filter((item) => item.trans_head === transhead);
}

function getTransHeadList() {
  const heads = defaultList.map((item) => item.trans_head);
  return [...new Set(heads)];
}

const paymentModeOptions = [
  { label: "Cash", value: "Cash" },
  { label: "Bank", value: "Bank" },
  { label: "MFS", value: "MFS" },
  { label: "Refund", value: "Refund" },
];

const productTypeOptions = [
  { label: "Finished Goods", value: "Finished Goods" },
  { label: "Raw Material", value: "Raw Material" },
  { label: "Services", value: "Services" },
  { label: "Consumable", value: "Consumable" },
  { label: "Assets", value: "Assets" },
];

const purchaseTypeOptions = [
  { label: "Booking", value: "Booking" },
  { label: "Receipt", value: "Receipt" },
  { label: "Invoice", value: "Invoice" },
  { label: "Return", value: "Return" },
];

export {
  getListByTransHead,
  getTransHeadList,
  defaultList,
  paymentModeOptions,
  productTypeOptions,
  purchaseTypeOptions,
};

/*
Module :: Purchase
Head Name :: Purchases and Stock

Transaction :: Purchase Booking
paid_amount :: Supplier Debit
paid_amount :: Account Credit
cost_amount :: Account Credit

Transaction :: Purchase Receive
total_amount :: Supplier Credit
paid_amount :: Supplier Debit
paid_amount :: Account Credit
cost_amount :: Account Credit


*/
//Purchases and Stock
