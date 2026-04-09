import { Table } from '../../components/common/Table'
import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function BankReconciliationPage({ store }: { store: AccountingStore }) {
  return (
    <>
      <h3>Bank Reconciliation</h3>
      <Table headers={['Date', 'Bank', 'Description', 'Direction', 'Amount', 'Matched']}>
        {store.bankTransactions.map((b) => <tr key={b.id}><td>{b.date}</td><td>{b.bankAccount}</td><td>{b.description}</td><td>{b.direction}</td><td>{money(b.amount)}</td><td>{b.matched ? 'Yes' : 'No'}</td></tr>)}
      </Table>
    </>
  )
}
