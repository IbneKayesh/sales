import { useBanking } from "./useBanking";
import {
  portfolioSummary,
  recentTransactions,
  upcomingInstallments,
} from "../lib/domain/aggregates";

export function useDashboard() {
  const { banks, accounts, savings, dps, fd, transactions, loading } = useBanking();

  return {
    banks,
    accounts,
    savings,
    dps,
    fd,
    transactions,
    loading,
    summary: portfolioSummary({ banks, accounts, savings, dps, fd, transactions }),
    upcoming: upcomingInstallments(dps),
    recent: recentTransactions(transactions),
  };
}
