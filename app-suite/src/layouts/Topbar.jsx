import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconLogo, IconBell } from '../icons'

export default function Topbar({ className = '', ...rest }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '◉' },
    { to: '/users', label: 'Users', icon: '◐' },
    { to: '/transactions', label: 'Transactions', icon: '◈' },
    { to: '/reports', label: 'Reports', icon: '▣' },
    { to: '/settings', label: 'Settings', icon: '⚙' },
  ]

  const linkClass = ({ isActive }) =>
    `topbar__link${isActive ? ' topbar__link--active' : ''}`

  const mobileLinkClass = ({ isActive }) =>
    `topbar__mobile-link${isActive ? ' topbar__mobile-link--active' : ''}`

  return (
    <header className={`topbar${className ? ' ' + className : ''}`} {...rest}>
      <div className="topbar__brand">
        <span className="topbar__logo">
          <IconLogo size={28} />
        </span>
        <span className="topbar__title">ERP Suite</span>
      </div>

      <nav className="topbar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            end={item.to === '/'}
          >
            <span className="topbar__link-icon">{item.icon}</span>
            <span className="topbar__link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="topbar__right">
        <button type="button" className="topbar__icon-btn" aria-label="Notifications">
          <IconBell size={20} />
        </button>
        <div className="topbar__avatar">K</div>
      </div>

      <button
        type="button"
        className={`topbar__hamburger${menuOpen ? ' topbar__hamburger--open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <div className="topbar__mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={mobileLinkClass}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
            >
              <span className="topbar__mobile-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
