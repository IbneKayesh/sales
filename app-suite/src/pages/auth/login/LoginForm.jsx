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
 * One labelled input capsule — leading icon, optional trailing control and the
 * Caps Lock hint underneath. Both sign-in fields are built from this, so the
 * field markup exists only once.
 */
function LoginField({
  id,
  label,
  icon,
  trailing,
  capsLock,
  invalid = false,
  inputRef,
  onValueChange,
  onCapsKey,
  ...inputProps
}) {
  return (
    <div className="login-page__field">
      <label className="login-page__label" htmlFor={id}>
        {label}
      </label>
      <div
        className={`login-page__input-wrap login-page__input-wrap--icon${
          invalid ? " login-page__input-wrap--error" : ""
        }`}
      >
        <span className="login-page__input-icon" aria-hidden="true">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          name={id}
          className="login-page__input"
          onChange={(e) => onValueChange(e.target.value)}
          onKeyUp={onCapsKey}
          onKeyDown={onCapsKey}
          {...inputProps}
        />
        {trailing}
      </div>
      {capsLock && (
        <p className="login-page__caps" role="status">
          <IconWarning size={13} />
          Caps Lock is on
        </p>
      )}
    </div>
  );
}

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

  // Caps Lock state + handlers for one field, ready to spread onto LoginField.
  const capsProps = (field) => ({
    capsLock: capsField === field,
    onCapsKey: (e) => {
      if (typeof e.getModifierState === "function") {
        setCapsField(e.getModifierState("CapsLock") ? field : null);
      }
    },
    onBlur: () => setCapsField(null),
  });

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
        <LoginField
          id="username"
          label="User name"
          placeholder="user@sgd.com"
          icon={<IconUser size={16} />}
          inputRef={usernameRef}
          value={formData.username}
          onValueChange={(value) => onFieldChange("username", value)}
          autoComplete="username"
          disabled={blocked}
          invalid={Boolean(formErrors) && !formData.username}
          {...capsProps("username")}
        />
      )}

      {/* Password */}
      <LoginField
        id="password"
        label="Password"
        placeholder="Enter your password"
        type={showPassword ? "text" : "password"}
        icon={<IconLock size={16} />}
        inputRef={passwordRef}
        value={formData.password}
        onValueChange={(value) => onFieldChange("password", value)}
        autoComplete="current-password"
        disabled={blocked}
        invalid={Boolean(formErrors) && !formData?.password}
        {...capsProps("password")}
        trailing={
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
        }
      />

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
