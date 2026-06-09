import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [lockTime, setLockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedLockTime = lockTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedLockDate = lockTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple validation
    if (!username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    // For demo purposes, accept any non-empty credentials
    // In a real app, this would call an authentication API
    if (username && password) {
      // Redirect to home after successful login
      navigate("/");
    } else {
      setError("Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div
      className="lockscreen-container"
      style={{
        '--wallpaper-url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
        '--lockscreen-wallpaper-opacity': 0.25,
      }}
    >
      {/* Top Clock */}
      <div className="lockscreen-clock-container">
        <h1 className="lockscreen-time">{formattedLockTime}</h1>
        <h2 className="lockscreen-date">{formattedLockDate}</h2>
      </div>

      {/* Login Form Box */}
      <form className="lockscreen-login-box" onSubmit={handleSubmit}>
        <div className="lockscreen-form-avatar">JD</div>
        <h3 className="lockscreen-form-name">Welcome</h3>
        <p className="lockscreen-form-role">Sign in to continue</p>

        <input
          type="text"
          placeholder="Enter username"
          className="lockscreen-input"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError('');
          }}
          disabled={isLoading}
          autoFocus
        />

        <input
          type="password"
          placeholder="Enter password"
          className="lockscreen-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          disabled={isLoading}
        />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="lockscreen-btn" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="lockscreen-footer">
        ⚡ Connected to ERP Enterprise Cloud Services
      </div>
    </div>
  );
};

export default LoginPage;