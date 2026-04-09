import type { FormEvent } from 'react'
import { money, today } from '../../data/mockData'
import { Table } from '../../components/common/Table'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function JournalEntriesPage({ store, onAddEntry }: { store: AccountingStore; onAddEntry: (event: FormEvent<HTMLFormElement>) => void }) {
  const onTransfer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const ok = store.transferBalance({
      date: String(data.get('date') || today),
      fromAccountId: String(data.get('fromAccountId')),
      toAccountId: String(data.get('toAccountId')),
      amount: Number(data.get('amount') || 0),
      memo: String(data.get('memo') || ''),
    })
    if (ok) event.currentTarget.reset()
  }

  return (
    <>
      <h3>Journal Entries (Dr/Cr)</h3>
      <form className="row" onSubmit={onAddEntry}>
        <input className="input-sm" name="date" type="date" defaultValue={today} />
        <input className="input-sm" name="memo" placeholder="Memo" required />
        <select className="input-sm" name="debitAccount">{store.accounts.map((a) => <option key={`d-${a.id}`} value={a.id}>{a.code}</option>)}</select>
        <select className="input-sm" name="creditAccount">{store.accounts.map((a) => <option key={`c-${a.id}`} value={a.id}>{a.code}</option>)}</select>
        <input className="input-sm" name="amount" type="number" step="0.01" placeholder="Amount" required />
        <button className="btn-sm" type="submit">Post</button>
      </form>

      <h4>Transfer Balance (Account to Account)</h4>
      <form className="row" onSubmit={onTransfer}>
        <input className="input-sm" name="date" type="date" defaultValue={today} />
        <select className="input-sm" name="fromAccountId">
          {store.accounts.map((a) => <option key={`from-${a.id}`} value={a.id}>{a.code} - {a.name}</option>)}
        </select>
        <select className="input-sm" name="toAccountId">
          {store.accounts.map((a) => <option key={`to-${a.id}`} value={a.id}>{a.code} - {a.name}</option>)}
        </select>
        <input className="input-sm" name="amount" type="number" step="0.01" placeholder="Amount" required />
        <input className="input-sm transfer-memo" name="memo" placeholder="Memo (optional)" />
        <button className="btn-sm" type="submit">Transfer</button>
      </form>

      <Table headers={['Date', 'Ref', 'Memo', 'Debit', 'Credit']}>
        {store.entries.map((e) => <tr key={e.id}><td>{e.date}</td><td>{e.reference}</td><td>{e.memo}</td><td>{money(e.lines.reduce((s, l) => s + l.debit, 0))}</td><td>{money(e.lines.reduce((s, l) => s + l.credit, 0))}</td></tr>)}
      </Table>
    </>
  )
}
