import { useMemo, useState } from 'react'
import { Table } from '../../components/common/Table'
import { money } from '../../data/mockData'
import type { AccountingStore } from '../../hooks/useAccountingData'

export function ReportsPage({ store }: { store: AccountingStore }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [accountId, setAccountId] = useState('all')

  const rows = useMemo(() => {
    return store.entries
      .filter((entry) => (fromDate ? entry.date >= fromDate : true) && (toDate ? entry.date <= toDate : true))
      .flatMap((entry) =>
        entry.lines
          .filter((line) => accountId === 'all' || line.accountId === accountId)
          .map((line) => ({
            entryId: entry.id,
            date: entry.date,
            reference: entry.reference,
            memo: entry.memo,
            account: store.accounts.find((a) => a.id === line.accountId)?.name ?? line.accountId,
            debit: line.debit,
            credit: line.credit,
          })),
      )
  }, [accountId, fromDate, toDate, store.accounts, store.entries])

  const exportCsv = () => {
    const header = ['Date', 'Reference', 'Memo', 'Account', 'Debit', 'Credit']
    const body = rows.map((r) => [r.date, r.reference, r.memo, r.account, r.debit.toFixed(2), r.credit.toFixed(2)])
    const csv = [header, ...body].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ledger-report.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="stack">
      <h3>Reports</h3>
      <div className="row">
        <input className="input-sm" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input className="input-sm" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <select className="input-sm" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          <option value="all">All accounts</option>
          {store.accounts.map((a) => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
        </select>
        <button className="btn-sm" type="button" onClick={exportCsv}>Export CSV</button>
      </div>
      <Table headers={['Date', 'Ref', 'Memo', 'Account', 'Debit', 'Credit']}>
        {rows.map((row) => (
          <tr key={`${row.entryId}-${row.account}-${row.debit}-${row.credit}`}>
            <td>{row.date}</td>
            <td>{row.reference}</td>
            <td>{row.memo}</td>
            <td>{row.account}</td>
            <td>{money(row.debit)}</td>
            <td>{money(row.credit)}</td>
          </tr>
        ))}
      </Table>
    </div>
  )
}
