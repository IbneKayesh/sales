import { Table } from '../../components/common/Table'
import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function TrialBalancePage({ store }: { store: AccountingStore }) {
  return (
    <>
      <h3>Trial Balance</h3>
      <Table headers={['Account', 'Debit', 'Credit']}>
        {store.accounts.map((a) => {
          const amount = store.balances.get(a.id)?.closing ?? 0
          const isDr = ['asset', 'expense'].includes(a.type) ? amount >= 0 : amount < 0
          return <tr key={a.id}><td>{a.name}</td><td>{isDr ? money(Math.abs(amount)) : '-'}</td><td>{isDr ? '-' : money(Math.abs(amount))}</td></tr>
        })}
      </Table>
    </>
  )
}
