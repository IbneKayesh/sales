import type { FormEvent } from 'react'
import { Table } from '../../components/common/Table'
import { money, today } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function CollectionsPaymentsPage({ store }: { store: AccountingStore }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const ok = store.addPayment({
      date: String(data.get('date') || today),
      partyId: String(data.get('partyId')),
      amount: Number(data.get('amount') || 0),
      mode: String(data.get('mode')) as 'cash' | 'bank',
      direction: String(data.get('direction')) as 'collection' | 'payment',
    })
    if (ok) event.currentTarget.reset()
  }

  return (
    <>
      <h3>Collections / Payments</h3>
      <form className="row" onSubmit={onSubmit}>
        <input className="input-sm" name="date" type="date" defaultValue={today} />
        <select className="input-sm" name="partyId">
          {store.parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="input-sm" name="direction" defaultValue="collection">
          <option value="collection">collection</option>
          <option value="payment">payment</option>
        </select>
        <select className="input-sm" name="mode" defaultValue="cash">
          <option value="cash">cash</option>
          <option value="bank">bank</option>
        </select>
        <input className="input-sm" name="amount" type="number" step="0.01" placeholder="Amount" required />
        <button className="btn-sm" type="submit">Post</button>
      </form>
      <Table headers={['ID', 'Date', 'Party', 'Direction', 'Mode', 'Amount']}>
        {store.payments.map((p) => <tr key={p.id}><td>{p.id}</td><td>{p.date}</td><td>{store.parties.find((x) => x.id === p.partyId)?.name ?? p.partyId}</td><td>{p.direction}</td><td>{p.mode}</td><td>{money(p.amount)}</td></tr>)}
      </Table>
    </>
  )
}
