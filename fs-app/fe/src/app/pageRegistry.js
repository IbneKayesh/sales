import { AccountsPage } from "../pages/accounts/AccountsPage";
import { BankPage } from "../pages/banks/BankPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { DocumentsPage } from "../pages/documents/DocumentsPage";
import { CashFlowPage } from "../pages/reports/CashFlowPage";
import { SubAccountsPage } from "../pages/subaccounts/SubAccountsPage";
import { TransactionsPage } from "../pages/transactions/TransactionsPage";

export const PAGE_REGISTRY = {
  "/dashboard": DashboardPage,
  "/bank": BankPage,
  "/accounts": AccountsPage,
  "/sub-accounts": SubAccountsPage,
  "/transactions": TransactionsPage,
  "/cash-flow": CashFlowPage,
  "/documents": DocumentsPage,
};
