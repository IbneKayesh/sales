import type { FormEvent } from 'react'
import { money } from '../../data/mockData'
import { Table } from '../../components/common/Table'
import type { AccountingStore } from '../../hooks/useAccountingData'
import type { AccountType } from '../../types/accounting'

export function ChartOfAccountsPage({ store }: { store: AccountingStore }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    store.addAccount({
      id: `a${store.accounts.length + 1}`,
      code: String(data.get('code')),
      name: String(data.get('name')),
      type: String(data.get('type')) as AccountType,
      openingBalance: Number(data.get('openingBalance') || 0),
    })
  }
  return (
    <>
      <h3>Chart of Accounts</h3>
      <form className="row" onSubmit={onSubmit}>
        <input className="input-sm" name="code" placeholder="Code" required />
        <input className="input-sm" name="name" placeholder="Name" required />
        <select className="input-sm" name="type" defaultValue="asset"><option value="asset">Asset</option><option value="liability">Liability</option><option value="equity">Equity</option><option value="income">Income</option><option value="expense">Expense</option></select>
        <input className="input-sm" name="openingBalance" type="number" step="0.01" placeholder="Opening" />
        <button className="btn-sm" type="submit">Add</button>
      </form>
      <Table headers={['Code', 'Name', 'Type', 'Opening', 'Closing']}>
        {store.accounts.map((a) => <tr key={a.id}><td>{a.code}</td><td>{a.name}</td><td>{a.type}</td><td>{money(a.openingBalance)}</td><td>{money(store.balances.get(a.id)?.closing ?? 0)}</td></tr>)}
      </Table>
    </>
  )
}
