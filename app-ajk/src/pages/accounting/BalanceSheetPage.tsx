import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function BalanceSheetPage({ store }: { store: AccountingStore }) {
  const assets = store.accounts.filter((a) => a.type === 'asset').reduce((sum, a) => sum + (store.balances.get(a.id)?.closing ?? 0), 0)
  const liabilities = store.accounts.filter((a) => a.type === 'liability').reduce((sum, a) => sum + (store.balances.get(a.id)?.closing ?? 0), 0)
  const equity = store.accounts.filter((a) => a.type === 'equity').reduce((sum, a) => sum + (store.balances.get(a.id)?.closing ?? 0), 0)
  return (
    <div className="stack">
      <h3>Balance Sheet</h3>
      <p>Assets: {money(assets)}</p>
      <p>Liabilities: {money(liabilities)}</p>
      <p>Equity + P/L: {money(equity + store.totals.netProfit)}</p>
    </div>
  )
}
