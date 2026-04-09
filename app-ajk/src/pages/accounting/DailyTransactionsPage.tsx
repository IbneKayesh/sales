import type { FormEvent } from 'react'
import { Table } from '../../components/common/Table'
import { money, today } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function DailyTransactionsPage({ store }: { store: AccountingStore }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const ok = store.addDailyTransaction({
      date: String(data.get('date') || today),
      category: String(data.get('category')) as 'income' | 'expense' | 'collection' | 'payment' | 'transfer',
      channel: String(data.get('channel')) as 'cash' | 'bank',
      amount: Number(data.get('amount') || 0),
      reference: String(data.get('reference') || 'MANUAL'),
    })
    if (ok) event.currentTarget.reset()
  }

  return (
    <>
      <h3>Daily Transactions</h3>
      <form className="row" onSubmit={onSubmit}>
        <input className="input-sm" name="date" type="date" defaultValue={today} />
        <select className="input-sm" name="category" defaultValue="income">
          <option value="income">income</option>
          <option value="expense">expense</option>
          <option value="transfer">transfer</option>
        </select>
        <select className="input-sm" name="channel" defaultValue="cash">
          <option value="cash">cash</option>
          <option value="bank">bank</option>
        </select>
        <input className="input-sm" name="reference" placeholder="Reference" required />
        <input className="input-sm" name="amount" type="number" step="0.01" placeholder="Amount" required />
        <button className="btn-sm" type="submit">Record</button>
      </form>
      <Table headers={['Date', 'Category', 'Channel', 'Reference', 'Amount']}>
        {store.dailyTransactions.map((d) => <tr key={d.id}><td>{d.date}</td><td>{d.category}</td><td>{d.channel}</td><td>{d.reference}</td><td>{money(d.amount)}</td></tr>)}
      </Table>
    </>
  )
}
