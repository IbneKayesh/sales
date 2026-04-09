import { Table } from '../../components/common/Table'
import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function CustomersSuppliersPage({ store }: { store: AccountingStore }) {
  return (
    <>
      <h3>Customers & Suppliers</h3>
      <Table headers={['Name', 'Type', 'Due']}>
        {store.parties.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>{money(p.due)}</td></tr>)}
      </Table>
    </>
  )
}
