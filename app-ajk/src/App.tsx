import { useState } from 'react'
import './App.css'
import { AppLayout } from './components/layout/AppLayout'
import { AccountingPage } from './pages/AccountingPage'
import { LoginPage } from './pages/LoginPage'
import { useAccountingData } from './hooks/useAccountingData'
import type { AccountingTab } from './types/accounting'

function App() {
  const store = useAccountingData()
  const [activeTab, setActiveTab] = useState<AccountingTab>('dashboard')

  if (!store.sessionUser) {
    return <LoginPage store={store} />
  }

  return (
    <AppLayout
      userName={store.sessionUser.name}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={store.logout}
    >
      <AccountingPage store={store} tab={activeTab} />
    </AppLayout>
  )
}

export default App
