import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './pages/components/ToastProvider.jsx'
import { UIProvider } from './pages/UIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </ToastProvider>
  </StrictMode>,
)


