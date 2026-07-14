import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/Avatar/Avatar';
import styles from './LoginPage.module.css';

// ── Eye icons ─────────────────────────────────────────────────────────────
const EyeOpenIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const PasswordInput = ({ value, onChange, placeholder, disabled, autoFocus }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      const timer = setTimeout(() => ref.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <div className={styles.pwInputWrapper}>
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.pwInput}
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="button"
        className={styles.eyeBtn}
        onClick={() => setShow((p) => !p)}
        disabled={disabled}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeClosedIcon className={styles.eyeIcon} /> : <EyeOpenIcon className={styles.eyeIcon} />}
      </button>
    </div>
  );
};

// ── Color helpers for user avatar gradients ──────────────────────────────
const AVATAR_COLORS = [
  ['#6366f1', '#4338ca'], // indigo
  ['#ec4899', '#be185d'], // pink
  ['#f59e0b', '#d97706'], // amber
  ['#10b981', '#059669'], // emerald
  ['#3b82f6', '#2563eb'], // blue
  ['#8b5cf6', '#7c3aed'], // violet
];

const getUserColor = (id) => {
  let hash = 0;
  for (let i = 0; i < (id || '').length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── User Avatar Circle with gradient ──────────────────────────────────────
const UserAvatarCircle = ({ user, size = 72 }) => {
  const [grad1, grad2] = getUserColor(user.id);
  const initials = (user.displayName || user.username || '?')
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (user.avatar) {
    return (
      <div
        className={styles.userAvatarImg}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${user.avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  }

  return (
    <div
      className={styles.userAvatarCircle}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${grad1}, ${grad2})`,
      }}
    >
      <span className={styles.userAvatarInitials}>{initials}</span>
    </div>
  );
};

// ── Step 1: User List ─────────────────────────────────────────────────────
const UserListView = ({ users, onSelectUser, onSwitchMode }) => {
  return (
    <div className={styles.userListContainer}>
      <div className={styles.userListHeader}>
        <svg className={styles.osLogo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
        </svg>
        <h1 className={styles.osTitle}>App Suite OS</h1>
        <p className={styles.osSubtitle}>Select a user to sign in</p>
      </div>

      <div className={styles.userListScroller}>
        <div className={styles.userListGrid}>
          {users.map((user) => (
            <button
              key={user.id}
              className={styles.userCard}
              onClick={() => onSelectUser(user)}
            >
              <div className={styles.userCardAvatar}>
                <UserAvatarCircle user={user} size={76} />
              </div>
              <span className={styles.userCardName}>
                {user.displayName || user.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.userListFooter}>
        <button className={styles.footerLink} onClick={() => onSwitchMode('login')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.footerIcon}>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Other User…
        </button>
        <button className={styles.footerLink} onClick={() => onSwitchMode('register')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.footerIcon}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Create Account
        </button>
        <button className={styles.footerLink} onClick={() => onSwitchMode('newUser')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.footerIcon}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
          </svg>
          Quick Start
        </button>
      </div>
    </div>
  );
};

// ── Step 2: User Password ────────────────────────────────────────────────
const UserPasswordView = ({ user, onBack, onSuccess }) => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const u = await login(user.username, password.trim());
      onSuccess(u);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.passwordContainer}>
      <div className={styles.passwordCard}>
        <div className={styles.passwordAvatarWrap}>
          <UserAvatarCircle user={user} size={88} />
        </div>

        <h2 className={styles.passwordUserName}>
          {user.displayName || user.username}
        </h2>
        <p className={styles.passwordHint}>Enter your password to unlock</p>

        <form onSubmit={handleSubmit} className={styles.passwordForm}>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isSubmitting}
            autoFocus
          />

          {error && <div className={styles.errorArea} role="alert">{error}</div>}

          <button type="submit" className={styles.unlockBtn} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className={styles.loader} />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.unlockIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Unlock
              </>
            )}
          </button>
        </form>

        <button className={styles.notYouBtn} onClick={onBack} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.notYouIcon}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Not you? Try another user
        </button>

        <div className={styles.passwordHintRow}>
          <span className={styles.passwordHintLabel}>Demo: password is "demo123"</span>
        </div>
      </div>
    </div>
  );
};

// ── Login Form (manual) ───────────────────────────────────────────────────
const LoginForm = ({ onSuccess, onSwitchMode }) => {
  const { login, defaultAvatarImg } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(identifier.trim(), password.trim());
      onSuccess(user);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <button className={styles.backArrow} onClick={() => onSwitchMode('userlist')} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className={styles.formCard}>
        <div className={styles.avatarWrapper}>
          <Avatar src={defaultAvatarImg} alt="Login" size="large" />
        </div>
        <h1 className={styles.formTitle}>Sign In</h1>
        <p className={styles.formSub}>Enter your account credentials</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={styles.inputField}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isSubmitting}
          />

          {error && <div className={styles.errorArea} role="alert">{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <span className={styles.loader} /> : <span>Sign In</span>}
          </button>
        </form>

        <div className={styles.switchArea}>
          <span className={styles.switchLabel}>New here?</span>
          <button className={styles.switchBtn} onClick={() => onSwitchMode('register')} type="button">
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Register Form ─────────────────────────────────────────────────────────
const RegisterForm = ({ onSuccess, onSwitchMode }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((prev) => ({ ...prev, [name]: e.target.value })),
  });

  const validate = () => {
    const errs = {};
    if (!form.displayName.trim()) errs.displayName = 'Display name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setGlobalError('');
    setIsSubmitting(true);
    try {
      const user = await register({
        displayName: form.displayName.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      onSuccess(user);
    } catch (err) {
      setGlobalError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <button className={styles.backArrow} onClick={() => onSwitchMode('userlist')} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className={`${styles.formCard} ${styles.formCardTall}`}>
        <h1 className={styles.formTitle}>Create Account</h1>
        <p className={styles.formSub}>Join the desktop environment</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Display Name" {...field('displayName')} className={styles.inputField} disabled={isSubmitting} autoFocus />
          </div>
          {errors.displayName && <span className={styles.fieldError}>{errors.displayName}</span>}

          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Username" {...field('username')} className={styles.inputField} disabled={isSubmitting} autoComplete="off" />
          </div>
          {errors.username && <span className={styles.fieldError}>{errors.username}</span>}

          <div className={styles.inputWrapper}>
            <input type="email" placeholder="Email Address" {...field('email')} className={styles.inputField} disabled={isSubmitting} />
          </div>
          {errors.email && <span className={styles.fieldError}>{errors.email}</span>}

          <PasswordInput value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password (min 6 chars)" disabled={isSubmitting} />
          {errors.password && <span className={styles.fieldError}>{errors.password}</span>}

          <PasswordInput value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm Password" disabled={isSubmitting} />
          {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}

          {globalError && <div className={styles.errorArea} role="alert">{globalError}</div>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <span className={styles.loader} /> : <span>Create Account</span>}
          </button>
        </form>

        <div className={styles.switchArea}>
          <span className={styles.switchLabel}>Already registered?</span>
          <button className={styles.switchBtn} onClick={() => onSwitchMode('login')} type="button">
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// ── New User Form ─────────────────────────────────────────────────────────
const NewUserForm = ({ onSuccess, onSwitchMode }) => {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setGlobalError('');
    setIsSubmitting(true);
    try {
      const user = await register({
        displayName: form.username.trim(),
        username: form.username.trim().toLowerCase(),
        email: `${form.username.trim().toLowerCase()}@local.os`,
        password: form.password,
      });
      onSuccess(user);
    } catch (err) {
      if (err.message === 'Username is already taken') {
        try {
          const user = await login(form.username.trim(), form.password);
          onSuccess(user);
        } catch (loginErr) {
          setGlobalError('Username taken. Try a different username or check your password.');
          setIsSubmitting(false);
        }
      } else {
        setGlobalError(err.message);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <button className={styles.backArrow} onClick={() => onSwitchMode('userlist')} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Quick Start</h1>
        <p className={styles.formSub}>Pick a username and password to get started</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Choose a Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className={styles.inputField} disabled={isSubmitting} autoFocus autoComplete="off" />
          </div>
          {errors.username && <span className={styles.fieldError}>{errors.username}</span>}

          <PasswordInput value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password (min 6 chars)" disabled={isSubmitting} />
          {errors.password && <span className={styles.fieldError}>{errors.password}</span>}

          <PasswordInput value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm Password" disabled={isSubmitting} />
          {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}

          {globalError && <div className={styles.errorArea} role="alert">{globalError}</div>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <span className={styles.loader} /> : <span>Get Started</span>}
          </button>
        </form>

        <div className={styles.switchArea}>
          <span className={styles.switchLabel}>Already have an account?</span>
          <button className={styles.switchBtn} onClick={() => onSwitchMode('login')} type="button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// ── LoginPage Root ────────────────────────────────────────────────────────
const LoginPage = () => {
  const { isAuthenticated, users } = useAuth();
  const navigate = useNavigate();
  // Determine initial mode synchronously to avoid flash
  const [mode, setMode] = useState(() => {
    const savedUsers = users.filter((u) => u.id !== 'demo-user-id');
    return savedUsers.length > 0 ? 'userlist' : 'login';
  });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/', { replace: true });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMode('password');
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setMode('userlist');
  };

  return (
    <div className={styles.page}>
      {mode === 'userlist' && (
        <UserListView
          users={users}
          onSelectUser={handleSelectUser}
          onSwitchMode={setMode}
        />
      )}
      {mode === 'password' && selectedUser && (
        <UserPasswordView
          user={selectedUser}
          onBack={handleBackToUsers}
          onSuccess={handleSuccess}
        />
      )}
      {mode === 'login' && (
        <LoginForm onSuccess={handleSuccess} onSwitchMode={setMode} />
      )}
      {mode === 'register' && (
        <RegisterForm onSuccess={handleSuccess} onSwitchMode={setMode} />
      )}
      {mode === 'newUser' && (
        <NewUserForm onSuccess={handleSuccess} onSwitchMode={setMode} />
      )}
    </div>
  );
};

export default LoginPage;
