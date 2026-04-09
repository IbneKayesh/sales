import type { ReactNode } from 'react'
import { SideMenu } from './SideMenu'
import { TopBar } from './TopBar'
import type { AccountingTab } from '../../types/accounting'

type Props = {
  userName: string
  activeTab: AccountingTab
  onSelectTab: (tab: AccountingTab) => void
  onLogout: () => void
  children: ReactNode
}

export function AppLayout({ userName, activeTab, onSelectTab, onLogout, children }: Props) {
  return (
    <main className="layout">
      <TopBar title="Accounting System" userName={userName} onLogout={onLogout} />
      <div className="layout-body">
        <SideMenu activeTab={activeTab} onSelectTab={onSelectTab} />
        <section className="content">{children}</section>
      </div>
    </main>
  )
}
