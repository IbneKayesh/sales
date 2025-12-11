// Sample data from the user, grouped based on comments
const transOptions = [
  // Income
  { label: "Sales (+)", value: "Sales", trans_head: "Income" },
  { label: "Other Income (+)", value: "Other Income", trans_head: "Income" },
  {
    label: "Commission Received (+)",
    value: "Commission Received",
    trans_head: "Income",
  },
  {
    label: "Discount Received (+)",
    value: "Discount Received",
    trans_head: "Income",
  },

  // Purchases & Stock
  {
    label: "Purchase Booking (-)",
    value: "Purchase Booking",
    trans_head: "Purchases and Stock",
  },
  {
    label: "Purchase Receive (+)",
    value: "Purchase Receive",
    trans_head: "Purchases and Stock",
  },
  {
    label: "Purchase Order (-)",
    value: "Purchase Order",
    trans_head: "Purchases and Stock",
  },
  {
    label: "Purchase Return (+)",
    value: "Purchase Return",
    trans_head: "Purchases and Stock",
  },
  {
    label: "Stock Adjustment (+/-)",
    value: "Stock Adjustment",
    trans_head: "Purchases and Stock",
  },

  // Expenses
  { label: "Expenses (-)", value: "Expenses", trans_head: "Expenses" },
  { label: "Purchase Expenses (-)", value: "Purchase Expenses", trans_head: "Expenses" },
  { label: "Salary (-)", value: "Salary", trans_head: "Expenses" },
  { label: "Rent (-)", value: "Rent", trans_head: "Expenses" },
  {
    label: "Electricity Bill (-)",
    value: "Electricity Bill",
    trans_head: "Expenses",
  },
  {
    label: "Internet Bill (-)",
    value: "Internet Bill",
    trans_head: "Expenses",
  },
  {
    label: "Transport / Delivery (-)",
    value: "Transport",
    trans_head: "Expenses",
  },
  { label: "Bank Charges (-)", value: "Bank Charges", trans_head: "Expenses" },
  {
    label: "GST / Tax Payment (-)",
    value: "Tax Payment",
    trans_head: "Expenses",
  },
  { label: "Maintenance (-)", value: "Maintenance", trans_head: "Expenses" },

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

  // Assets & Liabilities
  {
    label: "Asset Purchase (-)",
    value: "Asset Purchase",
    trans_head: "Assets and Liabilities",
  },
  {
    label: "Asset Sale (+)",
    value: "Asset Sale",
    trans_head: "Assets and Liabilities",
  },
  {
    label: "Loan Taken (+)",
    value: "Loan Taken",
    trans_head: "Assets and Liabilities",
  },
  {
    label: "Loan Repayment (-)",
    value: "Loan Repayment",
    trans_head: "Assets and Liabilities",
  },
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
];


export { getListByTransHead, getTransHeadList, defaultList, paymentModeOptions };



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

