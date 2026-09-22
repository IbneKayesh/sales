import { useState } from "react";
import { IconLogo, IconWarning } from "@/icons";
import { APP_NAME, APP_CREATOR } from "@/hooks/useLogin";
import LoginForm from "./LoginForm";
import LoginStatus from "./LoginStatus";

/**
 * The login card — accent strip, text-only header, form, fine print and the
 * server status pill.
 *
 * The header is deliberately text-only: the product brand and module list live
 * on the brand panel to the left, so repeating the logo here would double up.
 *
 * Props are the sign-in form's plus the backend status pill's, both handed over
 * flat by LoginPage.
 */
export default function LoginCard({
  // Sign-in form
  formData,
  formErrors,
  isBusy,
  isOffline,
  networkError,
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
  // Backend status
  status,
  checking,
  lastCheckedAt,
  onRecheck,
  retryAttempt,
  maxRetryAttempts,
  autoRetryStopped,
  title = "E.A.A.C",
  subtitle = "Sign in to continue to your workspace",
}) {
  // Reveals the reset instructions inline instead of sending the user to a
  // route that doesn't exist yet.
  const [showResetHint, setShowResetHint] = useState(false);

  return (
    <div className="login-page__card">
      <div className="login-page__accent" />

      <header className="login-page__card-head">
        {/* Compact brand mark in the card so the right-hand panel also carries
            the product identity, without repeating the full logo from the brand
            panel on the left. */}
        <div className="login-page__brand">
          <span className="login-page__logo login-page__logo--card">
            <IconLogo size={20} />
          </span>
          <span className="login-page__brand-name">{APP_NAME}</span>
          <span className="login-page__brand-creator">{APP_CREATOR}</span>
        </div>

        {/* Short gradient rule sitting at the bottom of the brand block and
            capping the top of the card title. */}
        <span className="login-page__card-deco" aria-hidden="true" />

        <h1 className="login-page__title">{title}</h1>
        <div className="login-page__card-head-row">
          {subtitle && <p className="login-page__subtitle">{subtitle}</p>}
          <button
            type="button"
            className="login-page__forgot"
            onClick={() => setShowResetHint((v) => !v)}
            aria-expanded={showResetHint}
          >
            Forgot password?
          </button>
        </div>
        {showResetHint && (
          <p className="login-page__forgot-hint" role="note">
            Password resets are handled by your administrator — contact IT
            support with your user name to get a new one.
          </p>
        )}
      </header>

      {/* The login endpoint lives on the same server, so an unreachable
          backend means sign-in is impossible until it comes back. */}
      {isOffline && (
        <div
          className={`login-page__offline${autoRetryStopped ? " login-page__offline--stopped" : ""}`}
          role="alert"
        >
          <IconWarning size={16} />
          <div className="login-page__offline-text">
            <strong>Server unreachable</strong>
            {networkError && (
              <span className="login-page__offline-reason">{networkError}</span>
            )}
            <span>
              {autoRetryStopped
                ? `Automatic retries stopped after ${maxRetryAttempts} attempts. Sign-in stays disabled until the server responds.`
                : `Sign-in is disabled. Retrying automatically — attempt ${retryAttempt} of ${maxRetryAttempts}…`}
            </span>
          </div>
          <button
            type="button"
            className="login-page__offline-retry"
            onClick={onRecheck}
            disabled={checking}
          >
            {checking ? "Retrying…" : autoRetryStopped ? "Retry" : "Retry now"}
          </button>
        </div>
      )}

      <LoginForm
        formData={formData}
        formErrors={formErrors}
        isBusy={isBusy}
        isOffline={isOffline}
        isSavedMode={isSavedMode}
        savedLogin={savedLogin}
        onFieldChange={onFieldChange}
        onSubmit={onSubmit}
        onSavedLoginChange={onSavedLoginChange}
        onTryDifferentUser={onTryDifferentUser}
        usernameRef={usernameRef}
        passwordRef={passwordRef}
        showPassword={showPassword}
        onToggleShowPassword={onToggleShowPassword}
      />

      <p className="login-page__hint">
        {APP_NAME} © {new Date().getFullYear()} · {APP_CREATOR}
      </p>

      <LoginStatus
        status={status}
        checking={checking}
        lastCheckedAt={lastCheckedAt}
        onRecheck={onRecheck}
        retryAttempt={retryAttempt}
        maxRetryAttempts={maxRetryAttempts}
        autoRetryStopped={autoRetryStopped}
        className="login-page__backend--card login-page__backend--mobile-only"
      />
    </div>
  );
}
