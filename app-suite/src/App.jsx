import { Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AppUIProvider } from './context/AppUIContext'
import Layout from './layouts/Layout'
import getRoutes from './routes'
import LoginPage from './pages/auth/LoginPage'
import ErrorBoundary from './components/ErrorBoundary'
import Windows from './layouts/Window'
import Taskbar from './layouts/Taskbar'
import RainGlass from './components/RainGlass'
import './App.css'

function AppContent() {
  const { user, logout, bgAnim, bgAnimScope, bgAnimSettings } = useApp()

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
      {/* Rain on glass — application-wide overlay (Theme page > Background
          animation > Whole app). Fixed to the viewport so it covers the whole
          app shell including open windows; purely decorative, never blocks
          interaction. */}
      {bgAnim === 'rain' && bgAnimScope === 'app' && (
        <RainGlass
          density={(bgAnimSettings?.density ?? 100) / 100}
          color={bgAnimSettings?.color || '#dbeafe'}
          opacity={(bgAnimSettings?.opacity ?? 100) / 100}
          size={(bgAnimSettings?.size ?? 100) / 100}
          speed={(bgAnimSettings?.speed ?? 100) / 100}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}
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
