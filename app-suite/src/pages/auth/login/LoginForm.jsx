import { useState } from "react";
import {
  IconArrowRight,
  IconEye1,
  IconEyeOff1,
  IconLock,
  IconSpinner,
  IconUser,
  IconWarning,
} from "@/icons";
import InputSwitch from "@/components/InputSwitch";

/**
 * The sign-in form shared by every login layout. Only presentation lives here —
 * all state and handlers come in as props from `useLogin` (via LoginPage).
 */
export default function LoginForm({
  formData,
  formErrors,
  isBusy,
  isOffline = false,
  isSavedMode,
  savedLogin,
  onFieldChange,
  onSubmit,
  onSavedLoginChange,
  onTryDifferentUser,
  usernameRef,
  passwordRef,
  showPassword,
  onToggleShowPassword,
}) {
  // Caps Lock makes typos very likely, so warn while typing either field.
  // Holds the field the warning belongs to: null | "username" | "password".
  const [capsField, setCapsField] = useState(null);

  const detectCapsLock = (field, e) => {
    if (typeof e.getModifierState === "function") {
      setCapsField(e.getModifierState("CapsLock") ? field : null);
    }
  };

  const clearCapsLock = () => setCapsField(null);

  // Nothing in the form is usable while a request is in flight or the backend
  // is unreachable — the login endpoint lives on that same server.
  const blocked = isBusy || isOffline;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!blocked) onSubmit();
  };

  return (
    <form
      className={`login-page__form${isOffline ? " login-page__form--offline" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Username — a read-only profile badge when the login is saved */}
      {isSavedMode ? (
        <div className="login-page__saved-profile">
          <div className="login-page__saved-avatar">
            <IconUser size={20} />
          </div>
          <div className="login-page__saved-info">
            <span className="login-page__saved-name">{formData.username}</span>
            <span className="login-page__saved-hint">Saved user — enter password</span>
          </div>
          <button
            type="button"
            className="login-page__different-user"
            onClick={onTryDifferentUser}
            disabled={blocked}
            title="Try with a different user"
            aria-label="Use a different user"
          >
            <span className="login-page__different-user-icon">⟳</span>
          </button>
        </div>
      ) : (
        <div className="login-page__field">
          <label className="login-page__label" htmlFor="username">
            User name
          </label>
          <div
            className={`login-page__input-wrap login-page__input-wrap--icon${
              formErrors && !formData.username ? " login-page__input-wrap--error" : ""
            }`}
          >
            <span className="login-page__input-icon" aria-hidden="true">
              <IconUser size={16} />
            </span>
            <input
              ref={usernameRef}
              id="username"
              name="username"
              type="text"
              className="login-page__input"
              placeholder="user@sgd.com"
              value={formData.username}
              onChange={(e) => onFieldChange("username", e.target.value)}
              autoComplete="username"
              disabled={blocked}
              onKeyUp={(e) => detectCapsLock("username", e)}
              onKeyDown={(e) => detectCapsLock("username", e)}
              onBlur={clearCapsLock}
            />
          </div>
          {capsField === "username" && (
            <p className="login-page__caps" role="status">
              <IconWarning size={13} />
              Caps Lock is on
            </p>
          )}
        </div>
      )}

      {/* Password */}
      <div className="login-page__field">
        <label className="login-page__label" htmlFor="password">
          Password
        </label>
        <div
          className={`login-page__input-wrap login-page__input-wrap--icon${
            formErrors && !formData?.password ? " login-page__input-wrap--error" : ""
          }`}
        >
          <span className="login-page__input-icon" aria-hidden="true">
            <IconLock size={16} />
          </span>
          <input
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="login-page__input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => onFieldChange("password", e.target.value)}
            autoComplete="current-password"
            disabled={blocked}
            onKeyUp={(e) => detectCapsLock("password", e)}
            onKeyDown={(e) => detectCapsLock("password", e)}
            onBlur={clearCapsLock}
          />
          <button
            type="button"
            className="login-page__toggle-pw"
            onClick={onToggleShowPassword}
            disabled={blocked}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <IconEyeOff1 size={16} /> : <IconEye1 size={16} />}
          </button>
        </div>
        {capsField === "password" && (
          <p className="login-page__caps" role="status">
            <IconWarning size={13} />
            Caps Lock is on
          </p>
        )}
      </div>

      {/* Remember user — only once both fields have something in them */}
      {!isSavedMode && formData.username && formData.password && (
        <div className="login-page__saved-check">
          <InputSwitch
            label="Remember user"
            checked={savedLogin}
            onChange={(e) => onSavedLoginChange(e.target.checked)}
            disabled={blocked}
          />
        </div>
      )}

      {/* Error */}
      {formErrors && (
        <div className="login-page__error" role="alert">
          <IconWarning size={15} />
          <span>{formErrors}</span>
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="login-page__submit" disabled={blocked}>
        {isBusy ? (
          <>
            <span className="login-page__spinner">
              <IconSpinner size={18} />
            </span>
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <IconArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
