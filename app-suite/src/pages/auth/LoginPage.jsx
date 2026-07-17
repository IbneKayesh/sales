import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconEyeOpen, IconEyeOff, IconOSLogo, IconArrowRight, IconUserPlus, IconUser, IconChevronLeft, IconUnlock } from '@/assets/icons';
import Avatar from '../../components/Avatar/Avatar';
import './LoginPage.css';
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
    <div className="pwInputWrapper">
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pwInput"
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="button"
        className="eyeBtn"
        onClick={() => setShow((p) => !p)}
        disabled={disabled}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <IconEyeOff className="eyeIcon" /> : <IconEyeOpen className="eyeIcon" />}
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
        className="userAvatarImg"
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
      className="userAvatarCircle"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${grad1}, ${grad2})`,
      }}
    >
      <span className="userAvatarInitials">{initials}</span>
    </div>
  );
};

// ── Step 1: User List ─────────────────────────────────────────────────────
const UserListView = ({ users, onSelectUser, onSwitchMode }) => {
  return (
    <div className="userListContainer">
      <div className="userListHeader">
        <IconOSLogo className="osLogo" />
        <h1 className="osTitle">App Suite OS</h1>
        <p className="osSubtitle">Select a user to sign in</p>
      </div>

      <div className="userListScroller">
        <div className="userListGrid">
          {users.map((user) => (
            <button
              key={user.id}
              className="userCard"
              onClick={() => onSelectUser(user)}
            >
              <div className="userCardAvatar">
                <UserAvatarCircle user={user} size={76} />
              </div>
              <span className="userCardName">
                {user.displayName || user.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="userListFooter">
        <button className="footerLink" onClick={() => onSwitchMode('login')}>
          <IconArrowRight className="footerIcon" />
          Other User…
        </button>
        <button className="footerLink" onClick={() => onSwitchMode('register')}>
          <IconUserPlus className="footerIcon" />
          Create Account
        </button>
        <button className="footerLink" onClick={() => onSwitchMode('newUser')}>
          <IconUser className="footerIcon" />
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
    <div className="passwordContainer">
      <div className="passwordCard">
        <div className="passwordAvatarWrap">
          <UserAvatarCircle user={user} size={88} />
        </div>

        <h2 className="passwordUserName">
          {user.displayName || user.username}
        </h2>
        <p className="passwordHint">Enter your password to unlock</p>

        <form onSubmit={handleSubmit} className="passwordForm">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isSubmitting}
            autoFocus
          />

          {error && <div className="errorArea" role="alert">{error}</div>}

          <button type="submit" className="unlockBtn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="loader" />
            ) : (
              <>
                <IconUnlock className="unlockIcon" />
                Unlock
              </>
            )}
          </button>
        </form>

        <button className="notYouBtn" onClick={onBack} type="button">
          <IconChevronLeft className="notYouIcon" />
          Not you? Try another user
        </button>

        <div className="passwordHintRow">
          <span className="passwordHintLabel">Demo: password is "demo123"</span>
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
    <div className="formContainer">
      <button className="backArrow" onClick={() => onSwitchMode('userlist')} type="button">
        <IconChevronLeft />
        Back
      </button>

      <div className="formCard">
        <div className="avatarWrapper">
          <Avatar src={defaultAvatarImg} alt="Login" size="large" />
        </div>
        <h1 className="formTitle">Sign In</h1>
        <p className="formSub">Enter your account credentials</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="inputWrapper">
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="inputField"
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

          {error && <div className="errorArea" role="alert">{error}</div>}

          <button type="submit" className="submitBtn" disabled={isSubmitting}>
            {isSubmitting ? <span className="loader" /> : <span>Sign In</span>}
          </button>
        </form>

        <div className="switchArea">
          <span className="switchLabel">New here?</span>
          <button className="switchBtn" onClick={() => onSwitchMode('register')} type="button">
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
    <div className="formContainer">
      <button className="backArrow" onClick={() => onSwitchMode('userlist')} type="button">
        <IconChevronLeft />
        Back
      </button>

      <div className={`formCard formCardTall`}>
        <h1 className="formTitle">Create Account</h1>
        <p className="formSub">Join the desktop environment</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="inputWrapper">
            <input type="text" placeholder="Display Name" {...field('displayName')} className="inputField" disabled={isSubmitting} autoFocus />
          </div>
          {errors.displayName && <span className="fieldError">{errors.displayName}</span>}

          <div className="inputWrapper">
            <input type="text" placeholder="Username" {...field('username')} className="inputField" disabled={isSubmitting} autoComplete="off" />
          </div>
          {errors.username && <span className="fieldError">{errors.username}</span>}

          <div className="inputWrapper">
            <input type="email" placeholder="Email Address" {...field('email')} className="inputField" disabled={isSubmitting} />
          </div>
          {errors.email && <span className="fieldError">{errors.email}</span>}

          <PasswordInput value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password (min 6 chars)" disabled={isSubmitting} />
          {errors.password && <span className="fieldError">{errors.password}</span>}

          <PasswordInput value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm Password" disabled={isSubmitting} />
          {errors.confirmPassword && <span className="fieldError">{errors.confirmPassword}</span>}

          {globalError && <div className="errorArea" role="alert">{globalError}</div>}

          <button type="submit" className="submitBtn" disabled={isSubmitting}>
            {isSubmitting ? <span className="loader" /> : <span>Create Account</span>}
          </button>
        </form>

        <div className="switchArea">
          <span className="switchLabel">Already registered?</span>
          <button className="switchBtn" onClick={() => onSwitchMode('login')} type="button">
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
    <div className="formContainer">
      <button className="backArrow" onClick={() => onSwitchMode('userlist')} type="button">
        <IconChevronLeft />
        Back
      </button>

      <div className="formCard">
        <h1 className="formTitle">Quick Start</h1>
        <p className="formSub">Pick a username and password to get started</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="inputWrapper">
            <input type="text" placeholder="Choose a Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className="inputField" disabled={isSubmitting} autoFocus autoComplete="off" />
          </div>
          {errors.username && <span className="fieldError">{errors.username}</span>}

          <PasswordInput value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password (min 6 chars)" disabled={isSubmitting} />
          {errors.password && <span className="fieldError">{errors.password}</span>}

          <PasswordInput value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm Password" disabled={isSubmitting} />
          {errors.confirmPassword && <span className="fieldError">{errors.confirmPassword}</span>}

          {globalError && <div className="errorArea" role="alert">{globalError}</div>}

          <button type="submit" className="submitBtn" disabled={isSubmitting}>
            {isSubmitting ? <span className="loader" /> : <span>Get Started</span>}
          </button>
        </form>

        <div className="switchArea">
          <span className="switchLabel">Already have an account?</span>
          <button className="switchBtn" onClick={() => onSwitchMode('login')} type="button">
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
    <div className="page">
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
