import { useRef, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import RequiredText from "@/components/RequiredText";
import useLogin from "@/hooks/auth/useLogin";
import { getStorageLoginData, setStorageLoginData } from "@/utils/storage";
import "./LoginPage.css";

const Login = () => {
  const { formData, errors, onChange, onLoginClick } = useLogin();
  const passwordRef = useRef(null);
  const [isUserSaved, setIsUserSaved] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const [savedUser, setSavedUser] = useState({});
  const [capsLock, setCapsLock] = useState(false);

  useEffect(() => {
    const storedUser = getStorageLoginData();
    if (storedUser) {
      const savedUser = storedUser?.saved_user;
      const isRemembered = storedUser?.is_saved || false;

      if (savedUser && isRemembered) {
        onChange("username", savedUser.username);
        setIsUserSaved(true);
        setRememberUser(true);
        setSavedUser(savedUser);

        // Use a small delay to ensure the Password component is rendered and ref is attached
        setTimeout(() => {
          if (passwordRef.current) {
            passwordRef.current.focus();
          }
        }, 100);
      }
    }
  }, []);

  const handleKeyPress = (e) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  const handleKeyDownUser = (e) => {
    if (e.key === "Enter") {
      if (formData.username.length > 3) {
        passwordRef.current.focus();
      }
    }
  };

  const handleDifferentUser = () => {
    onChange("username", "");
    setIsUserSaved(false);
    setRememberUser(false);
    setStorageLoginData({ saved_user: null });
    setStorageLoginData({ is_saved: false });
  };

  const handleLogin = () => {
    onLoginClick(rememberUser);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const savedUserAvater = () => {
    return (
      <div className="saved-user-container">
        <div className="saved-user-info">
          <div className="user-avatar">
            <i className="pi pi-user" />
          </div>
          <div className="user-details">
            <span className="welcome-text">Welcome back</span>
            <span className="saved-username">{savedUser.usertext}</span>
          </div>
        </div>
        <button
          type="button"
          className="different-user-btn"
          onClick={handleDifferentUser}
        >
          Not you? Try with different user.
        </button>
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="login-left-content">
          <h1>EAAC</h1>
          <p>Enterprise.Automation.Analytics.Control</p>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-content">
          <div className="login-form-card">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Please enter your credentials to sign in.</p>
            </div>

            {!isUserSaved ? (
              <div className="input-group">
                <label className="hidden">User</label>
                <InputText
                  value={formData.username}
                  onChange={(e) => onChange("username", e.target.value)}
                  placeholder="Your user"
                  onKeyDown={handleKeyDownUser}
                  className="w-full login-input"
                />
                <RequiredText text={errors.username} />
              </div>
            ) : (
              savedUserAvater()
            )}

            <div className="input-group">
              <label className="hidden">Password</label>
              <Password
                ref={passwordRef}
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
                placeholder="Your password"
                className="w-full login-input"
                feedback={false}
                inputStyle={{ width: "100%" }}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyPress}
              />
              <RequiredText text={errors.password} />
              {capsLock && (
                <small style={{ color: "red" }}>Caps Lock is ON</small>
              )}
            </div>

            {!isUserSaved && (
              <div className="remember-me">
                <Checkbox
                  inputId="rememberUser"
                  checked={rememberUser}
                  onChange={(e) => setRememberUser(e.checked)}
                />
                <label htmlFor="rememberUser">Remember Me</label>
              </div>
            )}
            <Button
              icon="pi pi-sign-in"
              label="Sign In"
              className="login-btn"
              onClick={handleLogin}
            />
            <p className="login-security-text">
              Secure login • Protected by SGD
            </p>
          </div>

          <div className="login-footer">
            <p>
              © {new Date().getFullYear()} BMS Solution. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
