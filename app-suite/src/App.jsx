import { Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AppUIProvider } from './context/AppUIContext'
import Layout from './layouts/Layout'
import getRoutes from './routes'
import LoginPage from './pages/auth/LoginPage'
import ErrorBoundary from './components/ErrorBoundary'
import Windows from './layouts/Window'
import Taskbar from './layouts/Taskbar'
import './App.css'

function AppContent() {
  const { user, logout } = useApp()

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
      {/* Menu windows render their routes outside the main <Routes> so each
          window can use <Routes location={link}> for any path. */}
      <Windows />
      {/* Taskbar strip for minimized windows, pinned to the bottom of the screen */}
      <Taskbar />
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
