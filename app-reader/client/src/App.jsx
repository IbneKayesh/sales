import { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { api } from './lib/api.js'
import { AppContext } from './context/app-context.js'
import { Toasts } from './components/ui.jsx'
import AppShell from './components/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workspace from './pages/Workspace.jsx'
import ReadingMode from './pages/ReadingMode.jsx'
import SearchPage from './pages/SearchPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const [books, setBooks] = useState([])
  const [booksLoading, setBooksLoading] = useState(true)
  const [booksError, setBooksError] = useState(null)
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const showToast = useCallback(
    (message, tone = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      setToasts((current) => [...current.slice(-3), { id, message, tone }])
      const timer = setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
        timers.current.delete(id)
      }, tone === 'error' ? 7000 : 3500)
      timers.current.set(id, timer)
    },
    [],
  )

  const refreshBooks = useCallback(async () => {
    setBooksLoading(true)
    try {
      const data = await api.listBooks()
      setBooks(data.books)
      setBooksError(null)
      return data.books
    } catch (error) {
      setBooksError(error)
      return []
    } finally {
      setBooksLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshBooks()
  }, [refreshBooks])

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const timer of pending.values()) clearTimeout(timer)
    }
  }, [])

  return (
    <AppContext.Provider value={{ books, booksLoading, booksError, refreshBooks, showToast }}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="books/:bookId" element={<Workspace />} />
          <Route path="books/:bookId/read" element={<ReadingMode />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  )
}
