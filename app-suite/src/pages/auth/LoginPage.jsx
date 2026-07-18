import { useState, useRef, useEffect } from "react";
import { IconLogo, IconSpinner } from "@/icons";
import useLogin from "@/hooks/useLogin";

export default function LoginPage() {
  const {
    isBusy,
    formData,
    formErrors,
    //functions
    handleChange,
    handleSubmitClick,
  } = useLogin();

  const usernameRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);


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
        <div className="login-page__form">
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

          <div className="login-page__field">
            <label className="login-page__label" htmlFor="password">
              Password
            </label>
            <div
              className={`login-page__input-wrap${formErrors && !formData?.password ? " login-page__input-wrap--error" : ""}`}
            >
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="login-page__input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                autoComplete="current-password"
                disabled={isBusy}
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
          Demo: enter any email &amp; password, or use{" "}
          <strong>admin@example.com</strong>
        </p>
      </div>
    </div>
  );
}
