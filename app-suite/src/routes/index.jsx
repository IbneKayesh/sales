import { Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import UsersPage from '../pages/UsersPage'
import TransactionsPage from '../pages/TransactionsPage'
import ReportsPage from '../pages/ReportsPage'
import SettingsPage from '../pages/SettingsPage'
import ExamplesPage from '../pages/ExamplesPage'
import LoginPage from '../pages/auth/LoginPage'
import NotificationPage from '../pages/NotificationPage'
import NotFoundPage from '../pages/NotFoundPage'
import ChartOfAccountsPage from '@/pages/M08/setup/coa/ChartOfAccountsPage'
import ModulePage from '@/pages/M01/ModulePage'

const routes = [
  { path: '/',          element: <HomePage /> },
  { path: '/login',     element: <LoginPage /> },
  { path: '/users',     element: <UsersPage /> },
  { path: '/transactions', element: <TransactionsPage /> },
  { path: '/reports',   element: <ReportsPage /> },
  { path: '/settings',  element: <SettingsPage /> },
  { path: '/examples',  element: <ExamplesPage /> },
  { path: '/notifications', element: <NotificationPage /> },
  { path: '/M08/chart-of-accounts', element: <ChartOfAccountsPage /> },
  { path: '/M01/modules', element: <ModulePage /> },
  { path: '*',          element: <NotFoundPage /> },
]

export default function getRoutes() {
  return routes.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ))
}
