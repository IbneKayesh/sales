import { Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AppUIProvider } from './context/AppUIContext'
import Layout from './layouts/Layout'
import getRoutes from './routes'
import LoginPage from './pages/auth/LoginPage'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function AppContent() {
  const { user } = useApp()

  if (!user) {
    return <LoginPage />
  }

  return (
    <Layout>
      <ErrorBoundary title="Page crashed" message="Something went wrong while rendering this page. Try refreshing.">
        <Routes>
          {getRoutes()}
        </Routes>
      </ErrorBoundary>
    </Layout>
  )
}

function App() {
  return (
    <AppProvider>
      <AppUIProvider>
        <AppContent />
      </AppUIProvider>
    </AppProvider>
  )
}

export default App
