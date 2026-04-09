import type { FormEvent } from 'react'
import { today } from '../data/mockData'
import type { AccountingTab } from '../types/accounting'
import type { AccountingStore } from '../hooks/useAccountingData'
import { AuthPage } from './accounting/AuthPage'
import { BalanceSheetPage } from './accounting/BalanceSheetPage'
import { BankReconciliationPage } from './accounting/BankReconciliationPage'
import { ChartOfAccountsPage } from './accounting/ChartOfAccountsPage'
import { CollectionsPaymentsPage } from './accounting/CollectionsPaymentsPage'
import { CustomersSuppliersPage } from './accounting/CustomersSuppliersPage'
import { DailyTransactionsPage } from './accounting/DailyTransactionsPage'
import { DashboardPage } from './accounting/DashboardPage'
import { DueSummaryPage } from './accounting/DueSummaryPage'
import { GeneralLedgerPage } from './accounting/GeneralLedgerPage'
import { InvoicesPage } from './accounting/InvoicesPage'
import { JournalEntriesPage } from './accounting/JournalEntriesPage'
import { ProfitLossPage } from './accounting/ProfitLossPage'
import { ReportsPage } from './accounting/ReportsPage'
import { SettingsPage } from './accounting/SettingsPage'
import { TrialBalancePage } from './accounting/TrialBalancePage'

export function AccountingPage({ store, tab }: { store: AccountingStore; tab: AccountingTab }) {

  const onAddEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const debitAccount = String(data.get('debitAccount'))
    const creditAccount = String(data.get('creditAccount'))
    const amount = Number(data.get('amount'))
    if (!debitAccount || !creditAccount || debitAccount === creditAccount || amount <= 0) {
      store.setMessage('Invalid entry.')
      return
    }
    store.addEntry({
      id: `j${store.entries.length + 1}`,
      date: String(data.get('date') || today),
      memo: String(data.get('memo') || 'Manual entry'),
      reference: `MAN-${store.entries.length + 1}`,
      lines: [{ accountId: debitAccount, debit: amount, credit: 0 }, { accountId: creditAccount, debit: 0, credit: amount }],
    })
    store.setMessage('Journal posted.')
    event.currentTarget.reset()
  }

  return (
    <section className="card">
      <h2>Professional Dashboard & Operations</h2>
      {store.message ? <p className="notice">{store.message}</p> : null}

      {tab === 'dashboard' && <DashboardPage store={store} />}
      {tab === 'coa' && <ChartOfAccountsPage store={store} />}
      {tab === 'journal' && <JournalEntriesPage store={store} onAddEntry={onAddEntry} />}
      {tab === 'ledger' && <GeneralLedgerPage store={store} />}
      {tab === 'trial' && <TrialBalancePage store={store} />}
      {tab === 'pl' && <ProfitLossPage store={store} />}
      {tab === 'bs' && <BalanceSheetPage store={store} />}
      {tab === 'daily' && <DailyTransactionsPage store={store} />}
      {tab === 'parties' && <CustomersSuppliersPage store={store} />}
      {tab === 'dues' && <DueSummaryPage store={store} />}
      {tab === 'invoice' && <InvoicesPage store={store} />}
      {tab === 'payment' && <CollectionsPaymentsPage store={store} />}
      {tab === 'reports' && <ReportsPage store={store} />}
      {tab === 'bank' && <BankReconciliationPage store={store} />}
      {tab === 'settings' && <SettingsPage />}
      {tab === 'auth' && <AuthPage store={store} />}
    </section>
  )
}
