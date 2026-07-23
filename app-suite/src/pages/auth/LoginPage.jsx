import { useState, useRef, useEffect } from "react";
import { IconLogo, IconUser, IconSpinner, IconCheck, IconClose } from "@/icons";
import InputSwitch from "@/components/InputSwitch";
import useLogin from "@/hooks/useLogin";
import { healthCheck } from "@/utils/api";

export default function LoginPage() {
  const {
    isBusy,
    formData,
    formErrors,
    savedLogin,
    //functions
    handleChange,
    handleSubmitClick,
    handleSavedLoginChange,
    handleTryDifferentUser,
  } = useLogin();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null); // null | true | false
  const [checking, setChecking] = useState(false);

  // Determine if we're in "saved login" mode (show username readonly, only password field)
  const isSavedMode = savedLogin && !!formData.username;

  useEffect(() => {
    if (isSavedMode) {
      passwordRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
    checkBackend();
  }, [isSavedMode]);

  const checkBackend = async () => {
    setChecking(true);
    const result = await healthCheck();
    setBackendStatus(result.online);
    setChecking(false);
  };


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
          <h1 className="login-page__title">bSuite</h1>
          <p className="login-page__subtitle">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="login-page__form">
          {/* Username field — shown as readonly badge in saved mode, editable otherwise */}
          {isSavedMode ? (
            <div className="login-page__saved-profile">
              <div className="login-page__saved-avatar">
                <IconUser size={20} />
              </div>
              <div className="login-page__saved-info">
                <span className="login-page__saved-name">
                  {formData.username}
                </span>
                <span className="login-page__saved-hint">
                  Saved user — enter password
                </span>
              </div>
              <button
                type="button"
                className="login-page__different-user"
                onClick={handleTryDifferentUser}
                disabled={isBusy}
                title="Try with a different user"
              >
                <span className="login-page__different-user-icon">⟳</span>
              </button>
            </div>
          ) : (
            <div className="login-page__field">
              <label className="login-page__label" htmlFor="username">
                User Name
              </label>
              <div
                className={`login-page__input-wrap${formErrors && !formData.username ? " login-page__input-wrap--error" : ""}`}
              >
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  className="login-page__input"
                  placeholder="user@sgd.com"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  autoComplete="email"
                  disabled={isBusy}
                />
              </div>
            </div>
          )}

          <div className="login-page__field">
            <label className="login-page__label" htmlFor="password">
              Password
            </label>
            <div
              className={`login-page__input-wrap${formErrors && !formData?.password ? " login-page__input-wrap--error" : ""}`}
            >
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="login-page__input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                autoComplete="current-password"
                disabled={isBusy}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isBusy) {
                    handleSubmitClick();
                  }
                }}
              />
              <button
                type="button"
                className="login-page__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember me switch — shown only when both username and password are entered */}
          {formData.username && formData.password && (
            <div className="login-page__saved-check">
              <InputSwitch
                label="Remember user"
                checked={savedLogin}
                onChange={(e) => handleSavedLoginChange(e.target.checked)}
                disabled={isBusy}
              />
            </div>
          )}

          {/* Error */}
          {formErrors && <div className="login-page__error">{formErrors}</div>}

          {/* Submit */}
          <button
            type="button"
            className="login-page__submit"
            onClick={handleSubmitClick}
            disabled={isBusy}
          >
            {isBusy ? (
              <>
                <span className="login-page__spinner">
                  <IconSpinner size={18} />
                </span>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        {/* Demo hint */}
        <p className="login-page__hint">
          bSuite©{new Date().getFullYear()}
        </p>

        {/* Backend status */}
        <div className="login-page__backend">
          <button
            type="button"
            className={`login-page__backend-btn login-page__backend-btn--${backendStatus === null ? "checking" : backendStatus ? "online" : "offline"}`}
            onClick={checkBackend}
            disabled={checking}
            title={backendStatus === null ? "Checking backend…" : backendStatus ? "Backend connected" : "Backend unreachable — click to retry"}
          >
            {checking ? (
              <IconSpinner size={12} />
            ) : backendStatus ? (
              <IconCheck size={12} />
            ) : (
              <IconClose size={12} />
            )}
            <span>
              {checking
                ? "Checking…"
                : backendStatus === null
                  ? "Connecting…"
                  : backendStatus
                    ? "Server connected"
                    : "Server offline"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
