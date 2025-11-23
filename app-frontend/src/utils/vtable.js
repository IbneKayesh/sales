// Sample data from the user, grouped based on comments
const transOptions = [
    // Income
    { label: "Sales (+)", value: "Sales", group: "Income" },
    { label: "Other Income (+)", value: "Other Income", group: "Income" },
    { label: "Commission Received (+)", value: "Commission Received", group: "Income" },
    { label: "Discount Received (+)", value: "Discount Received", group: "Income" },

    // Purchases & Stock
    { label: "Purchase Booking (-)", value: "Purchase Booking", group: "Purchases & Stock" },
    { label: "Purchase Receive (+)", value: "Purchase Receive", group: "Purchases & Stock" },
    { label: "Purchase Order (-)", value: "Purchase Order", group: "Purchases & Stock" },
    { label: "Purchase Return (+)", value: "Purchase Return", group: "Purchases & Stock" },
    { label: "Stock Adjustment (+/-)", value: "Stock Adjustment", group: "Purchases & Stock" },

    // Expenses
    { label: "Expenses (-)", value: "Expenses", group: "Expenses" },
    { label: "Salary (-)", value: "Salary", group: "Expenses" },
    { label: "Rent (-)", value: "Rent", group: "Expenses" },
    { label: "Electricity Bill (-)", value: "Electricity Bill", group: "Expenses" },
    { label: "Internet Bill (-)", value: "Internet Bill", group: "Expenses" },
    { label: "Transport / Delivery (-)", value: "Transport", group: "Expenses" },
    { label: "Bank Charges (-)", value: "Bank Charges", group: "Expenses" },
    { label: "GST / Tax Payment (-)", value: "Tax Payment", group: "Expenses" },
    { label: "Maintenance (-)", value: "Maintenance", group: "Expenses" },

    // Cash & Bank
    { label: "Cash In (+)", value: "Cash In", group: "Cash & Bank" },
    { label: "Cash Out (-)", value: "Cash Out", group: "Cash & Bank" },
    { label: "Deposit to Bank (-)", value: "Bank Deposit", group: "Cash & Bank" },
    { label: "Withdraw from Bank (+)", value: "Bank Withdraw", group: "Cash & Bank" },

    // Dues (Receivables/Payables)
    { label: "Customer Due (+)", value: "Customer Due", group: "Dues" },
    { label: "Customer Due Received (+)", value: "Due Received", group: "Dues" },
    { label: "Supplier Due (-)", value: "Supplier Due", group: "Dues" },
    { label: "Supplier Due Paid (-)", value: "Due Paid", group: "Dues" },

    // Assets & Liabilities
    { label: "Asset Purchase (-)", value: "Asset Purchase", group: "Assets & Liabilities" },
    { label: "Asset Sale (+)", value: "Asset Sale", group: "Assets & Liabilities" },
    { label: "Loan Taken (+)", value: "Loan Taken", group: "Assets & Liabilities" },
    { label: "Loan Repayment (-)", value: "Loan Repayment", group: "Assets & Liabilities" },
];

// Transform transOptions into a list of objects with id, name, and group
const defaultList = transOptions.map((item, index) => ({
  id: index + 1,
  label: item.label,
  value: item.value,
  group: item.group,
}));


function getListByGroup(groupname) {
  return defaultList.filter(item => item.group === groupname);
}

function getGroupList() {
  const groups = defaultList.map(item => item.group);
  return [...new Set(groups)];
}

export {
  getListByGroup,
  getGroupList,
  defaultList,
};
