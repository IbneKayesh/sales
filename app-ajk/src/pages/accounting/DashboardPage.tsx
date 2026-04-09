import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function DashboardPage({ store }: { store: AccountingStore }) {
  const cash = store.balances.get('a1')?.closing ?? 0
  const bank = store.balances.get('a2')?.closing ?? 0
  return (
    <div className="grid">
      {[['Cash', cash], ['Bank', bank], ['Net Profit', store.totals.netProfit], ['Receivable', store.receivable], ['Payable', store.payable]].map(([label, value]) => (
        <article className="mini-card" key={String(label)}><h3>{label}</h3><p>{money(Number(value))}</p></article>
      ))}
    </div>
  )
}
