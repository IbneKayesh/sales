import type { AccountingTab } from '../../types/accounting'

type Props = { activeTab: AccountingTab; onSelectTab: (tab: AccountingTab) => void }

const groups: Array<{ title: string; items: Array<{ id: AccountingTab; label: string }> }> = [
  { title: 'Dashboard', items: [{ id: 'dashboard', label: 'Overview' }] },
  {
    title: 'Transactions',
    items: [
      { id: 'journal', label: 'Journal Entries' },
      { id: 'daily', label: 'Daily Transactions' },
      { id: 'invoice', label: 'Invoices' },
      { id: 'payment', label: 'Collections / Payments' },
      { id: 'coa', label: 'Chart of Accounts' },
      { id: 'parties', label: 'Customers & Suppliers' },
      { id: 'dues', label: 'Dues' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { id: 'ledger', label: 'General Ledger' },
      { id: 'trial', label: 'Trial Balance' },
      { id: 'pl', label: 'Profit & Loss' },
      { id: 'bs', label: 'Balance Sheet' },
      { id: 'bank', label: 'Bank Reconciliation' },
      { id: 'reports', label: 'Report Center' },
    ],
  },
  { title: 'Settings', items: [{ id: 'settings', label: 'System Settings' }, { id: 'auth', label: 'User Profile' }] },
]

export function SideMenu({ activeTab, onSelectTab }: Props) {
  return (
    <aside className="sidebar">
      {groups.map((group) => (
        <section key={group.title} className="menu-group">
          <h3 className="menu-group-title">{group.title}</h3>
          {group.items.map((item) => (
            <button
              type="button"
              key={item.id}
              className={activeTab === item.id ? 'menu-item active' : 'menu-item'}
              onClick={() => onSelectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </section>
      ))}
    </aside>
  )
}
