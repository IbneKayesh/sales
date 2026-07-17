import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', phone: '+1-555-0101', department: 'engineering', createdAt: '2025-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'editor', status: 'active', phone: '+1-555-0102', department: 'design', createdAt: '2025-02-03' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'viewer', status: 'pending', phone: '+1-555-0103', department: 'marketing', createdAt: '2025-02-20' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'contributor', status: 'inactive', phone: '+1-555-0104', department: 'sales', createdAt: '2025-03-10' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'editor', status: 'active', phone: '+1-555-0105', department: 'engineering', createdAt: '2025-03-22' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'viewer', status: 'archived', phone: '+1-555-0106', department: 'support', createdAt: '2025-04-05' },
  { id: 7, name: 'Grace Wilson', email: 'grace@example.com', role: 'admin', status: 'active', phone: '+1-555-0107', department: 'hr', createdAt: '2025-04-18' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'contributor', status: 'pending', phone: '+1-555-0108', department: 'finance', createdAt: '2025-05-01' },
  { id: 9, name: 'Ivy Anderson', email: 'ivy@example.com', role: 'editor', status: 'active', phone: '+1-555-0109', department: 'engineering', createdAt: '2025-05-14' },
  { id: 10, name: 'Jack Thomas', email: 'jack@example.com', role: 'viewer', status: 'active', phone: '+1-555-0110', department: 'operations', createdAt: '2025-06-02' },
  { id: 11, name: 'Kate Garcia', email: 'kate@example.com', role: 'admin', status: 'inactive', phone: '+1-555-0111', department: 'marketing', createdAt: '2025-06-19' },
  { id: 12, name: 'Leo Martinez', email: 'leo@example.com', role: 'contributor', status: 'active', phone: '+1-555-0112', department: 'design', createdAt: '2025-07-08' },
]

const roleDefinitions = [
  { value: 'admin', label: 'Admin', color: '#ef4444', permissions: ['create', 'read', 'update', 'delete', 'manage'] },
  { value: 'editor', label: 'Editor', color: '#f59e0b', permissions: ['create', 'read', 'update'] },
  { value: 'contributor', label: 'Contributor', color: '#6366f1', permissions: ['create', 'read'] },
  { value: 'viewer', label: 'Viewer', color: '#6b7280', permissions: ['read'] },
]

const initialTransactions = [
  { id: 1, date: '2025-07-01', description: 'Software License - Adobe Creative Cloud', category: 'software', amount: 599.99, type: 'expense', status: 'completed', userId: 1 },
  { id: 2, date: '2025-07-02', description: 'Client Payment - Web Design Project', category: 'revenue', amount: 3500.00, type: 'income', status: 'completed', userId: 2 },
  { id: 3, date: '2025-07-03', description: 'Office Supplies - Staples', category: 'office', amount: 234.50, type: 'expense', status: 'completed', userId: 3 },
  { id: 4, date: '2025-07-05', description: 'Electricity Bill - July', category: 'utilities', amount: 890.00, type: 'expense', status: 'pending', userId: 1 },
  { id: 5, date: '2025-07-07', description: 'Consulting Income - Q3 Strategy', category: 'revenue', amount: 5000.00, type: 'income', status: 'completed', userId: 4 },
  { id: 6, date: '2025-07-08', description: 'Employee Salaries - July', category: 'payroll', amount: 12500.00, type: 'expense', status: 'completed', userId: 1 },
  { id: 7, date: '2025-07-10', description: 'Google Ads Campaign', category: 'marketing', amount: 1500.00, type: 'expense', status: 'failed', userId: 5 },
  { id: 8, date: '2025-07-12', description: 'AWS Hosting - Monthly', category: 'software', amount: 847.32, type: 'expense', status: 'completed', userId: 2 },
  { id: 9, date: '2025-07-14', description: 'Invoice #1024 - ABC Corp', category: 'revenue', amount: 7200.00, type: 'income', status: 'pending', userId: 3 },
  { id: 10, date: '2025-07-15', description: 'Team Lunch - Client Meeting', category: 'travel', amount: 185.60, type: 'expense', status: 'completed', userId: 6 },
  { id: 11, date: '2025-07-17', description: 'Server Equipment Lease', category: 'software', amount: 2200.00, type: 'expense', status: 'refunded', userId: 1 },
  { id: 12, date: '2025-07-18', description: 'Freelance Payment - UI Design', category: 'revenue', amount: 1800.00, type: 'income', status: 'completed', userId: 7 },
  { id: 13, date: '2025-07-20', description: 'Water Bill - Office', category: 'utilities', amount: 320.00, type: 'expense', status: 'pending', userId: 4 },
  { id: 14, date: '2025-07-21', description: 'LinkedIn Premium Recruiting', category: 'marketing', amount: 79.99, type: 'expense', status: 'completed', userId: 8 },
  { id: 15, date: '2025-07-22', description: 'Retainer - Digital Ocean', category: 'software', amount: 120.00, type: 'expense', status: 'completed', userId: 2 },
]

const categoryOptions = [
  { value: 'revenue', label: 'Revenue', type: 'income' },
  { value: 'software', label: 'Software & SaaS', type: 'expense' },
  { value: 'office', label: 'Office Supplies', type: 'expense' },
  { value: 'utilities', label: 'Utilities', type: 'expense' },
  { value: 'payroll', label: 'Payroll', type: 'expense' },
  { value: 'marketing', label: 'Marketing', type: 'expense' },
  { value: 'travel', label: 'Travel', type: 'expense' },
  { value: 'misc', label: 'Miscellaneous', type: 'expense' },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState('light')
  const [users, setUsers] = useState(initialUsers)
  const [transactions, setTransactions] = useState(initialTransactions)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const addUser = useCallback((userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setUsers((prev) => [...prev, newUser])
    return newUser
  }, [])

  const updateUser = useCallback((id, data) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const addTransaction = useCallback((txnData) => {
    const newTxn = {
      ...txnData,
      id: Date.now(),
    }
    setTransactions((prev) => [...prev, newTxn])
    return newTxn
  }, [])

  const updateTransaction = useCallback((id, data) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        sidebarOpen,
        toggleSidebar,
        theme,
        setTheme,
        users,
        addUser,
        updateUser,
        deleteUser,
        roles: roleDefinitions,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        categoryOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
