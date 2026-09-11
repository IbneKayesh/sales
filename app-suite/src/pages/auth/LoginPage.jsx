import { useCallback, useEffect, useRef, useState } from "react";
import useLogin from "@/hooks/useLogin";
import { healthCheck } from "@/utils/api";
import {
  IconAccounts,
  IconCalculator,
  IconChart,
  IconCogs,
  IconCRM,
  IconHR,
  IconInventory,
  IconLogo,
  IconManufacture,
  IconSales,
} from "@/icons";
import { APP_NAME, APP_VERSION, BRAND_PANEL_COLOR } from "@/hooks/useLogin";
import LoginCard from "./login/LoginCard";
import LoginStatus from "./login/LoginStatus";

// While the server is unreachable we keep probing it automatically, but only
// this many times before handing control back to the user.
const MAX_AUTO_RETRIES = 3;
const AUTO_RETRY_DELAY_MS = 5000;

const MODULES = [
  { label: "Inventory & Warehouse Stock", Icon: IconInventory },
  { label: "Sales & Purchase", Icon: IconSales },
  { label: "Manufacturing & Raw Materials", Icon: IconManufacture },
  { label: "HR and Payrolls", Icon: IconHR },
  { label: "CRM", Icon: IconCRM },
  { label: "Accounts & Ledger", Icon: IconAccounts },
  { label: "Reports & Analytics", Icon: IconChart },
  { label: "Expense & Budget Control", Icon: IconCalculator },
  { label: "Project & Task Management", Icon: IconCogs },
];

/**
 * The login layout — a themed brand panel on the left and the sign-in card on
 * the right. The brand panel is a rounded card carrying the module list, with
 * layered watermarks behind it.
 */
function SplitLayout({ formProps, statusProps }) {
  return (
    <div className="login-page login-page--split">
      {/* Brand panel — the background fades out while the server is offline */}
      <aside
        className={`login-split__brand${
          formProps.isOffline ? " login-split__brand--offline" : ""
        }`}
      >
        {/* Decorative watermark layers */}
        <div className="login-split__watermarks" aria-hidden="true">
          <span className="login-split__wm login-split__wm--1" />
          <span className="login-split__wm login-split__wm--2" />
          <span className="login-split__wm login-split__wm--3" />
          <span className="login-split__wm login-split__wm--4" />
          <span className="login-split__wm login-split__wm--5" />
          <span className="login-split__wm login-split__wm--6" />
        </div>

        <div className="login-split__brand-head">
          <span className="login-split__logo">
            <IconLogo size={26} />
          </span>
          <div className="login-split__wordmark-group">
            <span className="login-split__wordmark">{APP_NAME}</span>
            <span className="login-split__wordmark-sub">
              Crafting Digital Excellence
            </span>
          </div>

          {/* Server status — pushed to the top-right of the brand panel */}
          <LoginStatus
            {...statusProps}
            variant="dot"
            className="login-split__status"
          />
        </div>

        <div className="login-split__brand-body">
          <p className="login-split__headline">
            Run your entire business from one system
          </p>
          <p className="login-split__tagline">
            Everything your team needs, unified in a single ERP workspace.
          </p>
          <ul className="login-split__features">
            {MODULES.map(({ label, Icon }) => (
              <li className="login-split__feature" key={label}>
                <span className="login-split__feature-icon">
                  <Icon size={13} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="login-split__brand-foot">
          <span>Version {APP_VERSION}</span>
          <span>{APP_NAME} © {new Date().getFullYear()}</span>
        </div>
      </aside>

      {/* Form panel — the login card with a text-only header, since the brand
          is already shown on the panel to the left. */}
      <main className="login-split__panel">
        <LoginCard formProps={formProps} statusProps={statusProps} />
      </main>
    </div>
  );
}

/**
 * Login controller. Owns focus, password visibility, the backend health check
 * and the offline/retry flow; SplitLayout is purely presentational.
 */
export default function LoginPage() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null); // null | true | false
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [autoRetries, setAutoRetries] = useState(0);
  const [checking, setChecking] = useState(false);

  // A sign-in attempt that never reached the server is proof enough that it's
  // down, even though the mount-time health check said otherwise. Drop the
  // status to offline so the form dims, and let the auto-retry effect below
  // start probing again.
  const handleServerDown = useCallback(() => {
    setAutoRetries(0);
    setBackendStatus(false);
    setLastCheckedAt(new Date());
  }, []);

  const login = useLogin({ onNetworkError: handleServerDown });
  const { formData, isBusy, clearNetworkError } = login;

  // Saved-login mode shows a read-only profile badge instead of the username field
  const isSavedMode = login.savedLogin && !!formData.username;

  const checkBackend = useCallback(async () => {
    setChecking(true);
    const result = await healthCheck();
    setBackendStatus(result.online);
    setLastCheckedAt(new Date());
    if (result.online) {
      // Back online — refill the retry budget and drop any stale sign-in
      // failure reason from the previous outage.
      setAutoRetries(0);
      clearNetworkError();
    }
    setChecking(false);
  }, [clearNetworkError]);

  // Apply the deployable brand-panel color as a CSS variable on :root so the
  // single-color background in App.css picks it up. Re-run when the value
  // changes so hot-reloads and env switches are reflected without a full reload.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.getPropertyValue("--brand-panel-color");
    if (prev !== BRAND_PANEL_COLOR) {
      root.style.setProperty("--brand-panel-color", BRAND_PANEL_COLOR);
    }
    return () => {
      if (root.style.getPropertyValue("--brand-panel-color") === BRAND_PANEL_COLOR) {
        root.style.removeProperty("--brand-panel-color");
      }
    };
  }, [BRAND_PANEL_COLOR]);

  // Focus the first field the user actually has to fill in.
  useEffect(() => {
    if (isSavedMode) {
      passwordRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [isSavedMode]);

  // Probe the backend once on mount. Deferred a tick so the check doesn't
  // trigger a synchronous cascading render.
  useEffect(() => {
    const timer = setTimeout(() => checkBackend(), 0);
    return () => clearTimeout(timer);
  }, [checkBackend]);

  // Auto-retry while the server is down, up to MAX_AUTO_RETRIES. Skipped while
  // a check is already in flight so requests can never overlap, and it stops
  // for good once the budget is spent — the user retries manually from there.
  useEffect(() => {
    if (checking) return undefined;
    if (backendStatus !== false) return undefined;
    if (autoRetries >= MAX_AUTO_RETRIES) return undefined;

    const timer = setTimeout(() => {
      setAutoRetries((n) => n + 1);
      checkBackend();
    }, AUTO_RETRY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [checking, backendStatus, autoRetries, checkBackend]);

  // A manual re-check also restarts the automatic retry budget.
  const handleManualCheck = useCallback(() => {
    setAutoRetries(0);
    checkBackend();
  }, [checkBackend]);

  const autoRetryStopped =
    backendStatus === false && autoRetries >= MAX_AUTO_RETRIES;

  // 1-based number of the attempt that is running (or next in line).
  const retryAttempt = Math.min(
    MAX_AUTO_RETRIES,
    Math.max(1, checking ? autoRetries : autoRetries + 1),
  );

  const formProps = {
    formData,
    formErrors: login.formErrors,
    isBusy,
    // No point letting anyone sign in while the login server is unreachable
    isOffline: backendStatus === false,
    networkError: login.networkError,
    isSavedMode,
    savedLogin: login.savedLogin,
    onFieldChange: login.handleChange,
    onSubmit: login.handleSubmitClick,
    onSavedLoginChange: login.handleSavedLoginChange,
    onTryDifferentUser: login.handleTryDifferentUser,
    usernameRef,
    passwordRef,
    showPassword,
    onToggleShowPassword: () => setShowPassword((v) => !v),
  };

  const statusProps = {
    status: backendStatus,
    checking,
    lastCheckedAt,
    onRecheck: handleManualCheck,
    retryAttempt,
    maxRetryAttempts: MAX_AUTO_RETRIES,
    autoRetryStopped,
  };

  return <SplitLayout formProps={formProps} statusProps={statusProps} />;
}
