import { Table } from '../../components/common/Table'
import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function GeneralLedgerPage({ store }: { store: AccountingStore }) {
  return (
    <>
      <h3>General Ledger</h3>
      <Table headers={['Account', 'Debit', 'Credit', 'Closing']}>
        {store.accounts.map((a) => <tr key={a.id}><td>{a.name}</td><td>{money(store.balances.get(a.id)?.debit ?? 0)}</td><td>{money(store.balances.get(a.id)?.credit ?? 0)}</td><td>{money(store.balances.get(a.id)?.closing ?? 0)}</td></tr>)}
      </Table>
    </>
  )
}
