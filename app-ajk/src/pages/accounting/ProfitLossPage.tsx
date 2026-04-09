import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function ProfitLossPage({ store }: { store: AccountingStore }) {
  return (
    <div className="stack">
      <h3>Profit & Loss</h3>
      <p>Income: {money(store.totals.income)}</p>
      <p>Expense: {money(store.totals.expense)}</p>
      <p>Net Profit: {money(store.totals.netProfit)}</p>
    </div>
  )
}
