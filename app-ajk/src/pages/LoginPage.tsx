import type { FormEvent } from 'react'
import type { AccountingStore } from '../hooks/useAccountingData'
import type { Role } from '../types/accounting'

export function LoginPage({ store }: { store: AccountingStore }) {
  const onLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    store.login(String(data.get('email')), String(data.get('password')))
  }

  const onRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    store.register(
      String(data.get('name')),
      String(data.get('email')),
      String(data.get('role')) as Role,
      String(data.get('password')),
    )
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <h2>Login</h2>
        <p className="text-muted">Sign in to access Dashboard, Transactions, Reports and Settings.</p>
        <form className="stack" onSubmit={onLogin}>
          <input className="input-sm" name="email" type="email" placeholder="Email" required />
          <input className="input-sm" name="password" type="password" placeholder="Password" required />
          <button className="btn-sm active" type="submit">Sign In</button>
        </form>
      </section>

      <section className="auth-card">
        <h2>New User Registration</h2>
        <form className="stack" onSubmit={onRegister}>
          <input className="input-sm" name="name" placeholder="Full name" required />
          <input className="input-sm" name="email" type="email" placeholder="Email" required />
          <select className="input-sm" name="role" defaultValue="viewer">
            <option value="viewer">viewer</option>
            <option value="accountant">accountant</option>
            <option value="admin">admin</option>
          </select>
          <input className="input-sm" name="password" type="password" placeholder="Password" required />
          <button className="btn-sm" type="submit">Create Account</button>
        </form>
      </section>

      {store.message ? <p className="notice">{store.message}</p> : null}
    </main>
  )
}
