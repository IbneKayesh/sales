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
 */
export default function LoginCard({
  formProps,
  statusProps,
  title = "Welcome back",
  subtitle = "Sign in to continue to your workspace",
  showHint = true,
  className = "",
}) {
  // Reveals the reset instructions inline instead of sending the user to a
  // route that doesn't exist yet.
  const [showResetHint, setShowResetHint] = useState(false);

  return (
    <div className={`login-page__card${className ? " " + className : ""}`}>
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
      {formProps.isOffline && (
        <div
          className={`login-page__offline${
            statusProps.autoRetryStopped ? " login-page__offline--stopped" : ""
          }`}
          role="alert"
        >
          <IconWarning size={16} />
          <div className="login-page__offline-text">
            <strong>Server unreachable</strong>
            {formProps.networkError && (
              <span className="login-page__offline-reason">
                {formProps.networkError}
              </span>
            )}
            <span>
              {statusProps.autoRetryStopped
                ? `Automatic retries stopped after ${statusProps.maxRetryAttempts} attempts. Sign-in stays disabled until the server responds.`
                : `Sign-in is disabled. Retrying automatically — attempt ${statusProps.retryAttempt} of ${statusProps.maxRetryAttempts}…`}
            </span>
          </div>
          <button
            type="button"
            className="login-page__offline-retry"
            onClick={statusProps.onRecheck}
            disabled={statusProps.checking}
          >
            {statusProps.checking
              ? "Retrying…"
              : statusProps.autoRetryStopped
                ? "Retry"
                : "Retry now"}
          </button>
        </div>
      )}

      <LoginForm {...formProps} />

      {showHint && (
        <p className="login-page__hint">
          {APP_NAME} © {new Date().getFullYear()} · Crafting Digital Excellence
        </p>
      )}

      <LoginStatus
        {...statusProps}
        className="login-page__backend--card login-page__backend--mobile-only"
      />
    </div>
  );
}
