import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar/Avatar';
import styles from './LoginPage.module.css';

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

const PasswordInput = ({ value, onChange, placeholder, disabled }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.inputWrapper}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.inputField}
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="button"
        className={styles.showHideBtn}
        onClick={() => setShow((p) => !p)}
        disabled={disabled}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeClosedIcon className={styles.eyeIcon} /> : <EyeOpenIcon className={styles.eyeIcon} />}
      </button>
    </div>
  );
};

// ── Login Form ────────────────────────────────────────────────────────────────
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
    <>
      <div className={styles.avatarWrapper}>
        <Avatar src={defaultAvatarImg} alt="Login" size="large" />
      </div>
      <h1 className={styles.welcomeText}>Welcome Back</h1>
      <p className={styles.statusSub}>Sign in to your desktop</p>

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
          {isSubmitting ? <span className={styles.loader} /> : <span>Unlock Session</span>}
        </button>
      </form>

      <div className={styles.switchArea}>
        <span className={styles.switchLabel}>New here?</span>
        <button className={styles.switchBtn} onClick={onSwitchMode} type="button">
          Create an Account
        </button>
      </div>
      <div className={styles.hintSection}>
        <span className={styles.hintLabel}>Demo credentials: demo / demo123</span>
      </div>
    </>
  );
};

// ── Register Form ─────────────────────────────────────────────────────────────
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
    <>
      <h1 className={styles.welcomeText}>Create Account</h1>
      <p className={styles.statusSub}>Join the desktop environment</p>

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
        <button className={styles.switchBtn} onClick={onSwitchMode} type="button">
          Back to Login
        </button>
      </div>
    </>
  );
};

// ── LoginPage root ────────────────────────────────────────────────────────────
const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={`${styles.glassCard} ${mode === 'register' ? styles.glassCardRegister : ''}`}>
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} onSwitchMode={() => setMode('register')} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onSwitchMode={() => setMode('login')} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
