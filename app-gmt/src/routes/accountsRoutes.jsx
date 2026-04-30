import React from "react";
import { Route } from "react-router-dom";
import BankPage from "../pages/accounts/bank/BankPage";
import BankAccountPage from "../pages/accounts/bankaccount/BankAccountPage";
import ColllectionViewPage from "../pages/accounts/colllectionview/ColllectionViewPage";
import TsViewPage from "../pages/accounts/tsview/TsViewPage";

const accountsRoutes = (
  <>
    <Route path="/master/bank" element={<BankPage />} />
    <Route path="/master/bank_account" element={<BankAccountPage />} />
    <Route path="/report/collection_list" element={<ColllectionViewPage />} />
    <Route path="/dealer/view-voucher-list" element={<TsViewPage />} />
  </>
);

export default accountsRoutes;
