import type { FormEvent } from 'react'
import { Table } from '../../components/common/Table'
import { money, today } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function InvoicesPage({ store }: { store: AccountingStore }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const ok = store.addInvoice({
      date: String(data.get('date') || today),
      partyId: String(data.get('partyId')),
      kind: String(data.get('kind')) as 'sale' | 'purchase',
      amount: Number(data.get('amount') || 0),
      tax: Number(data.get('tax') || 0),
    })
    if (ok) event.currentTarget.reset()
  }

  return (
    <>
      <h3>Sales / Purchase Invoices</h3>
      <form className="row" onSubmit={onSubmit}>
        <input className="input-sm" name="date" type="date" defaultValue={today} />
        <select className="input-sm" name="partyId">
          {store.parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="input-sm" name="kind" defaultValue="sale">
          <option value="sale">sale</option>
          <option value="purchase">purchase</option>
        </select>
        <input className="input-sm" name="amount" type="number" step="0.01" placeholder="Amount" required />
        <input className="input-sm" name="tax" type="number" step="0.01" placeholder="Tax" />
        <button className="btn-sm" type="submit">Create Invoice</button>
      </form>
      <Table headers={['Invoice', 'Date', 'Party', 'Type', 'Amount', 'Tax', 'Status']}>
        {store.invoices.map((i) => <tr key={i.id}><td>{i.id}</td><td>{i.date}</td><td>{store.parties.find((p) => p.id === i.partyId)?.name ?? i.partyId}</td><td>{i.kind}</td><td>{money(i.amount)}</td><td>{money(i.tax)}</td><td>{i.status}</td></tr>)}
      </Table>
    </>
  )
}
