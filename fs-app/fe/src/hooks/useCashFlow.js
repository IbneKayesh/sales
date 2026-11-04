import { useMemo, useState } from "react";
import { useBanking } from "./useBanking";
import { availableMonths, buildCashFlow } from "../lib/domain/aggregates";

export function useCashFlow() {
  const { banks, accounts, transactions, loading } = useBanking();

  const months = useMemo(() => availableMonths(transactions), [transactions]);
  const [month, setMonth] = useState("");
  const selectedMonth = month || months[0] || "";

  const { rows, totals } = useMemo(
    () => buildCashFlow(banks, transactions, selectedMonth),
    [banks, transactions, selectedMonth]
  );

  return {
    banks,
    accounts,
    transactions,
    loading,
    months,
    selectedMonth,
    setMonth,
    rows,
    totals,
  };
}
