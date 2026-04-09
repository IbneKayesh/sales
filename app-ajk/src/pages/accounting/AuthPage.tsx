import type { FormEvent } from 'react'
import type { AccountingStore } from '../../hooks/useAccountingData'
import type { Role } from '../../types/accounting'

export function AuthPage({ store }: { store: AccountingStore }) {
  const onLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    store.login(String(data.get('email')), String(data.get('password')))
  }
  const onRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    store.register(String(data.get('name')), String(data.get('email')), String(data.get('role')) as Role, String(data.get('password')))
  }
  const onChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    store.changePassword(String(data.get('current')), String(data.get('next')))
  }

  return (
    <div className="grid">
      <article className="mini-card">
        <h3>Login</h3>
        <form className="stack" onSubmit={onLogin}>
          <input className="input-sm" name="email" type="email" placeholder="Email" required />
          <input className="input-sm" name="password" type="password" placeholder="Password" required />
          <button className="btn-sm" type="submit">Login</button>
        </form>
      </article>
      <article className="mini-card">
        <h3>Registration</h3>
        <form className="stack" onSubmit={onRegister}>
          <input className="input-sm" name="name" placeholder="Name" required />
          <input className="input-sm" name="email" type="email" placeholder="Email" required />
          <select className="input-sm" name="role" defaultValue="viewer"><option value="viewer">viewer</option><option value="accountant">accountant</option><option value="admin">admin</option></select>
          <input className="input-sm" name="password" type="password" placeholder="Password" required />
          <button className="btn-sm" type="submit">Register</button>
        </form>
      </article>
      <article className="mini-card">
        <h3>User Profile / Change Password</h3>
        <p>{store.sessionUser ? `${store.sessionUser.name} (${store.sessionUser.role})` : 'Guest session'}</p>
        <form className="stack" onSubmit={onChange}>
          <input className="input-sm" name="current" type="password" placeholder="Current password" required />
          <input className="input-sm" name="next" type="password" placeholder="New password" required />
          <button className="btn-sm" type="submit">Update password</button>
        </form>
      </article>
    </div>
  )
}
