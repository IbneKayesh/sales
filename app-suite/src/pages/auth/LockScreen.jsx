import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  IconEye1,
  IconEyeOff1,
  IconLock,
  IconLogout,
  IconSpinner,
  IconUnlock,
  IconWarning,
} from "@/icons";
import { getStorageLoginData } from "@/utils/storage";

export default function LockScreen({ onUnlock, onLogout }) {
  const { user, emply, login, logout, setIsLocked } = useApp();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [capsLock, setCapsLock] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef(null);

  // Live digital clock display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Autofocus password input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const detectCapsLock = (e) => {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  // Resolved user identity display
  const displayName =
    user?.users_cname ||
    user?.name ||
    emply?.emply_cname ||
    "User";

  const displayEmail =
    user?.users_email ||
    emply?.emply_email ||
    user?.email ||
    user?.username ||
    getStorageLoginData()?.saved_user ||
    "";

  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const hasAvatarUrl =
    user?.avatar &&
    (user.avatar.startsWith("http") || user.avatar.startsWith("data:"));

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleUnlockSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      setError("Please enter your password.");
      inputRef.current?.focus();
      return;
    }

    try {
      setIsBusy(true);
      setError("");

      const username =
        user?.users_email ||
        emply?.emply_email ||
        user?.email ||
        user?.username ||
        getStorageLoginData()?.saved_user ||
        "kayesh@sgd.com";

      const resp = await login({
        username,
        password: cleanPassword,
      });

      if (resp?.success) {
        setIsLocked(false);
        setPassword("");
        onUnlock?.();
      } else {
        setError(resp?.message || "Incorrect password. Please try again.");
        inputRef.current?.focus();
      }
    } catch (err) {
      setError(err?.message || "Failed to authenticate. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <div
      className="lock-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Screen locked"
    >
      <div className="lock-screen__backdrop" aria-hidden="true" />

      {/* Decorative ambient glowing orbs */}
      <div className="lock-screen__glow lock-screen__glow--1" aria-hidden="true" />
      <div className="lock-screen__glow lock-screen__glow--2" aria-hidden="true" />

      <div className="lock-screen__container">
        {/* Live clock header */}
        <div className="lock-screen__header">
          <div className="lock-screen__time">{timeString}</div>
          <div className="lock-screen__date">{dateString}</div>
        </div>

        {/* Unlock Card */}
        <div className="lock-screen__card">
          <div className="lock-screen__card-accent" />

          {/* User profile & Locked badge */}
          <div className="lock-screen__profile">
            <div className="lock-screen__avatar-wrap">
              {hasAvatarUrl ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="lock-screen__avatar-img"
                />
              ) : (
                <div className="lock-screen__avatar-fallback" aria-hidden="true">
                  {initials}
                </div>
              )}
              <div className="lock-screen__lock-badge" title="Session locked">
                <IconLock size={12} />
              </div>
            </div>

            <div className="lock-screen__user-details">
              <h2 className="lock-screen__user-name">{displayName}</h2>
              {displayEmail && (
                <p className="lock-screen__user-email">{displayEmail}</p>
              )}
              <span className="lock-screen__locked-tag">
                <IconLock size={11} />
                Session locked
              </span>
            </div>
          </div>

          {/* Password unlock form */}
          <form
            className="lock-screen__form"
            onSubmit={handleUnlockSubmit}
            noValidate
          >
            <div className="lock-screen__field">
              <div
                className={`lock-screen__input-wrap${
                  error ? " lock-screen__input-wrap--error" : ""
                }`}
              >
                <span className="lock-screen__input-icon" aria-hidden="true">
                  <IconLock size={16} />
                </span>
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  className="lock-screen__input"
                  placeholder="Enter password to unlock"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyUp={detectCapsLock}
                  onKeyDown={detectCapsLock}
                  disabled={isBusy}
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="lock-screen__toggle-pw"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isBusy}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOff1 size={16} /> : <IconEye1 size={16} />}
                </button>
              </div>

              {capsLock && (
                <p className="lock-screen__caps" role="status">
                  <IconWarning size={13} />
                  Caps Lock is on
                </p>
              )}
            </div>

            {error && (
              <div className="lock-screen__error" role="alert">
                <IconWarning size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons: Unlock and Logout only */}
            <div className="lock-screen__actions">
              <button
                type="submit"
                className="lock-screen__btn lock-screen__btn--unlock"
                disabled={isBusy}
              >
                {isBusy ? (
                  <>
                    <span className="lock-screen__spinner">
                      <IconSpinner size={16} />
                    </span>
                    Unlocking…
                  </>
                ) : (
                  <>
                    <IconUnlock size={16} />
                    Unlock
                  </>
                )}
              </button>

              <button
                type="button"
                className="lock-screen__btn lock-screen__btn--logout"
                onClick={handleLogoutClick}
                disabled={isBusy}
                title="Log out of this session"
              >
                <IconLogout size={16} />
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
