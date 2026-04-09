import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function DueSummaryPage({ store }: { store: AccountingStore }) {
  return (
    <div className="stack">
      <h3>Due / Receivables / Payables</h3>
      <p>Total Receivable: {money(store.receivable)}</p>
      <p>Total Payable: {money(store.payable)}</p>
    </div>
  )
}
