4 bank accounts, each accounts have multiple sub accounts, transaction between sub accounts, profit, withdrawal as example below-

here is 1 Bank information, have more 3 bank info like this
Name: Brac Bank Ltd
Branch: Gulshan 2
Account Name: Travel trading
Account No: 15001000001
Type: Savings

This Accounts have 3 DPS-
Account No: 15001000005 (1st DPS)
Type: DPS
Amount of Installment: 5000
No of Installments: 60
Installment Day: 5th day of each month
Total Payments: 300000
Rate: 9.5%
Total Interest: 28500
Total with Interests: 300000 + 28500
No of Installments Paid: 2
Total Paid: 10000
Total Interest earned: 950
Open Date: dd-mm-yy
Close Date: dd-mm-yy
Last Installment Date: dd-mm-yy
Next Installment Date: dd-mm-yy


then 2nd and 3rd DPS

This Accounts have 5 FD-
Account No: 15001000008 (1st FD)
Type: FD
Total Amount: 100000
Rate: 10.0%
Total Interest: 10000
Total with Interest: 110000
Open Date: dd-mm-yy
Close Date: dd-mm-yy
Int. Payment Type: Yearly / Half Yearly
Int. Payment Date: dd-mm-yy
Int. Next Payment Date: dd-mm-yy

then different type transaction on Savings Accounts-
Deposit, Withdrawn transfer between DPS/FD, profit on savings, bank charges etc


want to manage it  using web app, which are easy to manage,
also keep an example JSON document CRUD

v2:
1. app should be professional look UI
2. component based reusable codes
3. no inline css
4. enterprise architecture
5. use updated icons

v3:
1. use differnt folder for accounts and sub accounts with types, sub accounts might be DPS and fD both different folder
2. json file instead of complex guid use short name like for accounts 1.json, 2.json etc use max file name for next new file
3. all css unifed into index.css for root and app.css for all css, remove any CDN, it will 100% offline
4. CRUD for Bank list,Bank Account List,Bank Account Child Account Lists and Transaction Pages, ensure consistancy for all the p, use same style for same type of inputs and buttons, use same style for same type of information display
5. for example bank, url /bank, BankPage.jsx is holder and inject useBank.js unified hook, BankList.jsx is a list of Bank, Bankform.jsx is entry/edit page, Toast is for Yes No and popup, use seperate hook for individual pages, don't show count in sidebar
6. pages/banks, pages/accounts, pages/transactions etc, and components/layout/*.jsx and ui/*.jsx for all common components
7. app theme colors is dark-white and blue instead of full dark
8. left is sidebar will be collapse and expand, right panel will be full width of rest screen

v4:
1. double entry transaction system, must be debit and credit
2. use model/bank.json, id, name, etc for schema table model validations
3. use dark-gray and blue theme, not full white theme

v5:
1.// Before running the application, make sure the collection directory is created before any operation.

// In collection.js, add this helper:



// function async ensureDirectory() {
//   await fs.mkdir(this.directory, { recursive: true });
// }

2. make sure parent child, Banks > Accounts > Sub Accounts (Savings, DPS, FD), all the transactions are goes under the Sub Accounts with double entry Debit Credit accounting system