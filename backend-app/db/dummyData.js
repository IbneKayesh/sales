// backend-app/db/dummyData.js
const dummyData = () => {
  //In :: credit
  //Out :: debit

  //Z101-Z109
  const sales_data = [
    {
      id: "Z101",
      trhed_hednm: "Sales Booking (+)",
      trhed_grpnm: "Sales",
      trhed_grtyp: "In",
      trhed_cntyp: "Customer",
    },
    {
      id: "Z102",
      trhed_hednm: "Sales Invoice (+)",
      trhed_grpnm: "Sales",
      trhed_grtyp: "In",
      trhed_cntyp: "Customer",
    },
    {
      id: "Z103",
      trhed_hednm: "Sales Order (+)",
      trhed_grpnm: "Sales",
      trhed_grtyp: "In",
      trhed_cntyp: "Customer",
    },
    {
      id: "Z104",
      trhed_hednm: "Sales Return (-)",
      trhed_grpnm: "Sales",
      trhed_grtyp: "Out",
      trhed_cntyp: "Customer",
    },
    {
      id: "Z105",
      trhed_hednm: "Sales Expense (-)",
      trhed_grpnm: "Sales",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
  ];

  //Z201-Z209
  const purchase_data = [
    {
      id: "Z201",
      trhed_hednm: "Purchase Booking (-)",
      trhed_grpnm: "Purchase",
      trhed_grtyp: "Out",
      trhed_cntyp: "Supplier",
    },
    {
      id: "Z202",
      trhed_hednm: "Purchase Invoice (-)",
      trhed_grpnm: "Purchase",
      trhed_grtyp: "Out",
      trhed_cntyp: "Supplier",
    },
    {
      id: "Z203",
      trhed_hednm: "Purchase Order (-)",
      trhed_grpnm: "Purchase",
      trhed_grtyp: "Out",
      trhed_cntyp: "Supplier",
    },
    {
      id: "Z204",
      trhed_hednm: "Purchase Return (+)",
      trhed_grpnm: "Purchase",
      trhed_grtyp: "In",
      trhed_cntyp: "Supplier",
    },
    {
      id: "Z205",
      trhed_hednm: "Purchase Expense (-)",
      trhed_grpnm: "Purchase",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
  ];

  //Z501-Z599
  const inventory_data = [
    {
      id: "Z501",
      trhed_hednm: "Stock Out (-)",
      trhed_grpnm: "Inventory",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z502",
      trhed_hednm: "Stock In (+)",
      trhed_grpnm: "Inventory",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  //Z601-Z699
  const transfer_data = [
    {
      id: "Z601",
      trhed_hednm: "Transfer Out (-)",
      trhed_grpnm: "Transfer",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z602",
      trhed_hednm: "Transfer In (+)",
      trhed_grpnm: "Transfer",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  //Z701-Z799
  const income_data = [
    {
      id: "Z701",
      trhed_hednm: "Gain (+)",
      trhed_grpnm: "Income",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z702",
      trhed_hednm: "Investment (+)",
      trhed_grpnm: "Income",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z703",
      trhed_hednm: "Bank Profit (+)",
      trhed_grpnm: "Income",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z704",
      trhed_hednm: "Bank Loan Received (+)",
      trhed_grpnm: "Income",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z705",
      trhed_hednm: "Other Income (+)",
      trhed_grpnm: "Income",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  //Z801-Z899
  const expenditure_data = [
    {
      id: "Z801",
      trhed_hednm: "Loss (-)",
      trhed_grpnm: "Expenditure",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z802",
      trhed_hednm: "Withdrawal (-)",
      trhed_grpnm: "Expenditure",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z803",
      trhed_hednm: "Bank Charges (-)",
      trhed_grpnm: "Expenditure",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z804",
      trhed_hednm: "Bank Loan Payment (-)",
      trhed_grpnm: "Expenditure",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z805",
      trhed_hednm: "Other Cost (-)",
      trhed_grpnm: "Expenditure",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
  ];

  //Z901-Z999
  const expense_data = [
    {
      id: "Z901",
      trhed_hednm: "Rent (-)",
      trhed_grpnm: "Expense",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z902",
      trhed_hednm: "Rent Advance (-)",
      trhed_grpnm: "Expense",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z903",
      trhed_hednm: "Electricity Bill (-)",
      trhed_grpnm: "Expense",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z904",
      trhed_hednm: "Internet Bill (-)",
      trhed_grpnm: "Expense",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z905",
      trhed_hednm: "Transport Bill (-)",
      trhed_grpnm: "Expense",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
  ];

  //Z1001-Z1099
  const asset_data = [
    {
      id: "Z1001",
      trhed_hednm: "Asset Purchase (-)",
      trhed_grpnm: "Asset",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z1002",
      trhed_hednm: "Asset Sale (+)",
      trhed_grpnm: "Asset",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  //Z1101-Z1199
  const vat_data = [
    {
      id: "Z1101",
      trhed_hednm: "VAT Payment (-)",
      trhed_grpnm: "VAT",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z1102",
      trhed_hednm: "VAT Collection (+)",
      trhed_grpnm: "VAT",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  //Z1201-Z1299
  const tax_data = [
    {
      id: "Z1201",
      trhed_hednm: "Tax Payment (-)",
      trhed_grpnm: "Tax",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z1202",
      trhed_hednm: "Tax Receipt (+)",
      trhed_grpnm: "Tax",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  //Z1301-Z1399
  const hr_data = [
    {
      id: "Z1301",
      trhed_hednm: "Salary Payment (-)",
      trhed_grpnm: "HR",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z1302",
      trhed_hednm: "Salary Advance Payment (-)",
      trhed_grpnm: "HR",
      trhed_grtyp: "Out",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z1303",
      trhed_hednm: "Salary Deduction (+)",
      trhed_grpnm: "HR",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
    {
      id: "Z1304",
      trhed_hednm: "Salary Advance Deduction (+)",
      trhed_grpnm: "HR",
      trhed_grtyp: "In",
      trhed_cntyp: "Internal",
    },
  ];

  return {
    sales_data,
    purchase_data,
    inventory_data,
    transfer_data,
    income_data,
    expenditure_data,
    expense_data,
    asset_data,
    vat_data,
    tax_data,
    hr_data,
  };
};

module.exports = dummyData;
