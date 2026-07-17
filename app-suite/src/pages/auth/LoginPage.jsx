import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { IconLogo, IconSpinner } from '../../icons'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const emailRef = useRef(null)

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const email = form.email.trim()
    const password = form.password.trim()

    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 800))

    // Demo login — accept any credentials and log in as a default admin user
    const userData = {
      id: 1,
      name: email.includes('admin') ? 'Admin User' : email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'User',
      email,
      role: email.includes('admin') ? 'admin' : 'editor',
      avatar: email.charAt(0).toUpperCase(),
    }

    login(userData)
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="login-page">
      {/* Decorative background shapes */}
      <div className="login-page__bg-shape login-page__bg-shape--1" />
      <div className="login-page__bg-shape login-page__bg-shape--2" />
      <div className="login-page__bg-shape login-page__bg-shape--3" />

      <div className="login-page__card">
        {/* Brand */}
        <div className="login-page__brand">
          <span className="login-page__logo">
            <IconLogo size={40} />
          </span>
          <h1 className="login-page__title">ERP Suite</h1>
          <p className="login-page__subtitle">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="login-page__form" onSubmit={handleSubmit} noValidate>
          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-email">
              Email address
            </label>
            <div className={`login-page__input-wrap${error && !form.email.trim() ? ' login-page__input-wrap--error' : ''}`}>
              <input
                ref={emailRef}
                id="login-email"
                name="email"
                type="email"
                className="login-page__input"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-password">
              Password
            </label>
            <div className={`login-page__input-wrap${error && !form.password.trim() ? ' login-page__input-wrap--error' : ''}`}>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="login-page__input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-page__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-page__error">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-page__submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-page__spinner">
                  <IconSpinner size={18} />
                </span>
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className="login-page__hint">
          Demo: enter any email &amp; password, or use{' '}
          <strong>admin@example.com</strong>
        </p>
      </div>
    </div>
  )
}
