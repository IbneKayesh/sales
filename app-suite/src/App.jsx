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
import AnalogClock from './components/AnalogClock'
import DigitalClock from './components/DigitalClock'
import './App.css'

function AppContent() {
  const { user, logout, bgAnim, bgAnimSettings, bgAnimMode, isIdle, showBgAnim } = useApp()

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
      {/* Idle-mode blur backdrop — a frosted glass veil that appears beneath
          the rain when the user is idle and mode is "idle". Does not render in
          "always" mode so the user can work through the rain unobstructed. */}
      {bgAnimMode === 'idle' && isIdle && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backdropFilter: 'blur(0.7px) brightness(0.90)',
            WebkitBackdropFilter: 'blur(0.7px) brightness(0.90)',
            background: 'rgba(0,0,0,0.08)',
            zIndex: 9998,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Background animation overlay. In "idle" mode it acts as a
          screen-saver (zIndex above the blur). In "always" mode it falls in
          front of the UI but pointer events pass through so the app stays
          usable. Rain = full-screen rain-on-glass; fire = a campfire scene
          centered on screen. */}
      {showBgAnim && bgAnim === 'rain' && (
        <RainGlass
          density={(bgAnimSettings?.density ?? 85) / 100}
          color={bgAnimSettings?.color || '#dbeafe'}
          opacity={(bgAnimSettings?.opacity ?? 80) / 100}
          size={(bgAnimSettings?.size ?? 90) / 100}
          speed={(bgAnimSettings?.speed ?? 90) / 100}
          wind={(bgAnimSettings?.wind ?? 60) / 100}
          gustSpeed={(bgAnimSettings?.gustSpeed ?? 100) / 100}
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
      {showBgAnim && bgAnim === 'analog' && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <AnalogClock noBackdrop={bgAnimMode === 'always'} />
        </div>
      )}
      {showBgAnim && bgAnim === 'digital' && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <DigitalClock noBackdrop={bgAnimMode === 'always'} />
        </div>
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
