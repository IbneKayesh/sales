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

const unitGroupOptions = [
  { label: "Countable", value: "Countable" },
  { label: "Mass", value: "Mass" },
  { label: "Volume", value: "Volume" },
  { label: "Length", value: "Length" },
  { label: "Weight", value: "Weight" },
  { label: "Time", value: "Time" },
];

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const maritalOptions = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
  { label: "Other", value: "Other" },
];
const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];
const religionOptions = [
  { label: "Islam", value: "Islam" },
  { label: "Hindu", value: "Hindu" },
  { label: "Christian", value: "Christian" },
  { label: "Other", value: "Other" },
];
const educationGradeOptions = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
  { label: "Higher Secondary", value: "Higher Secondary" },
  { label: "Bachelor", value: "Bachelor" },
  { label: "Master", value: "Master" },
  { label: "PhD", value: "PhD" },
];
const designationOptions = [
  { label: "Trainee Executive", value: "Trainee Executive" },
  { label: "Junior Executive", value: "Junior Executive" },
  { label: "Senior Executive", value: "Senior Executive" },
  { label: "Assistant Manager", value: "Assistant Manager" },
  { label: "Manager", value: "Manager" },
  { label: "Senior Manager", value: "Senior Manager" },
  { label: "Assistant General Manager", value: "Assistant General Manager" },
  { label: "General Manager", value: "General Manager" },
  { label: "Senior General Manager", value: "Senior General Manager" },
  { label: "Assistant Director", value: "Assistant Director" },
  { label: "Director", value: "Director" },
  { label: "Senior Director", value: "Senior Director" },
  { label: "CEO", value: "CEO" },
];
const employeeTypeOptions = [
  { label: "Outsourcing", value: "Outsourcing" },
  { label: "Contract", value: "Contract" },
  { label: "Regular", value: "Regular" },
];
const employeeStatusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Terminated", value: "Terminated" },
  { label: "Resigned", value: "Resigned" },  
];

export {
  getListByTransHead,
  getTransHeadList,
  defaultList,
  paymentModeOptions,
  productTypeOptions,
  purchaseTypeOptions,
  unitGroupOptions,
  genderOptions,
  maritalOptions,
  bloodGroupOptions,
  religionOptions,
  educationGradeOptions,
  designationOptions,
  employeeTypeOptions,
  employeeStatusOptions,
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
