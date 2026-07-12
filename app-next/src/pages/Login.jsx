import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

const MOCK_CREDENTIALS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'System Manager', desc: 'Full system access' },
  { username: 'manager', password: 'manager123', name: 'Sarah Manager', role: 'Operations Manager', desc: 'Operations & inventory' },
  { username: 'staff', password: 'staff123', name: 'John Staff', role: 'Inventory Staff', desc: 'Inventory only' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showQuickLogin, setShowQuickLogin] = useState(true);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning('Please enter username and password');
      return;
    }
    const result = await login(username, password);
    if (result.success) {
      toast.success(`Welcome back! Redirecting to dashboard...`);
      navigate(from, { replace: true });
    }
  };

  const handleQuickLogin = async (creds) => {
    setUsername(creds.username);
    setPassword(creds.password);
    const result = await login(creds.username, creds.password);
    if (result.success) {
      toast.success(`Logged in as ${creds.name}`);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <path d="M6 6h.01M6 18h.01" />
            </svg>
          </div>
          <h1 className="login-title">Enterprise Management</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); clearError(); }}
              autoFocus
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
            />
          </div>
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>Quick Login (Demo)</span>
        </div>

        <div className="quick-login-grid">
          {MOCK_CREDENTIALS.map(creds => (
            <button
              key={creds.username}
              className="quick-login-btn"
              onClick={() => handleQuickLogin(creds)}
              disabled={loading}
              type="button"
            >
              <div className="quick-login-avatar" style={{
                background: creds.role === 'System Manager' ? '#6366f1'
                  : creds.role === 'Operations Manager' ? '#8b5cf6'
                  : '#a855f7'
              }}>
                {creds.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="quick-login-info">
                <span className="quick-login-name">{creds.name}</span>
                <span className="quick-login-role">{creds.role}</span>
                <span className="quick-login-desc">{creds.desc}</span>
              </div>
              <div className="quick-login-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
