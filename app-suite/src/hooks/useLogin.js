import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  getStorageLoginData,
  setStorageLoginData,
} from "@/utils/storage";

// ── Shared login-page constants (formerly loginConfig.js) ──────────────────
// Overridable per deployment via VITE_APP_NAME / VITE_APP_VERSION /
// VITE_APP_CREATOR / VITE_BRAND_PANEL_COLOR.
export const APP_NAME = import.meta.env.VITE_APP_NAME || "bSuite";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0";
export const APP_CREATOR = import.meta.env.VITE_APP_CREATOR || "Crafting Digital Excellence";
export const BRAND_PANEL_COLOR = import.meta.env.VITE_BRAND_PANEL_COLOR || "#7c3aed";

// Keep the "Signing in…" state on screen for at least this long so a fast
// round-trip doesn't flash the spinner for a single frame.
const MIN_BUSY_MS = 1000;

const useLogin = ({ onNetworkError } = {}) => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  // Hydrate the saved user straight from storage on first render, so no
  // post-mount effect is needed to pre-fill the form.
  const [formData, setFormData] = useState(() => {
    const stored = getStorageLoginData();
    const savedUser = stored?.is_saved ? stored.saved_user : null;
    return {
      username: savedUser || "kayesh@sgd.com",
      password: "01722688266",
    };
  });
  const [formErrors, setFormErrors] = useState("");
  // Separate from formErrors: this one survives into the offline notice, which
  // renders outside the dimmed form.
  const [networkError, setNetworkError] = useState("");
  const [savedLogin, setSavedLogin] = useState(() => {
    const stored = getStorageLoginData();
    return Boolean(stored?.is_saved && stored?.saved_user);
  });

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
  };

  const handleTryDifferentUser = () => {
    // Clear saved user data from storage
    setStorageLoginData({ is_saved: false, saved_user: null });
    // Reset form state — clear everything for a fresh login
    setSavedLogin(false);
    setFormData({ username: "", password: "" });
    setFormErrors("");
  };

  const handleSavedLoginChange = (checked) => {
    setSavedLogin(checked);
    if (!checked) {
      // User unchecked saved login — clear saved data
      setStorageLoginData({ is_saved: false, saved_user: null });
    }
  };

  const clearNetworkError = useCallback(() => setNetworkError(""), []);

  const handleSubmitClick = async () => {
    setFormErrors("");
    setNetworkError("");
    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username) {
      setFormErrors("Please enter your username.");
      return;
    }
    if (!password) {
      setFormErrors("Please enter your password.");
      return;
    }
    try {
      setIsBusy(true);
      const startedAt = Date.now();
      const resp = await login(formData);
      if (!resp?.success) {
        // No HTTP response at all — the login server itself is unreachable, so
        // hand off to the page's offline state rather than showing a raw
        // network error text.
        if (resp?.offline) {
          setFormErrors("");
          setNetworkError(
            "Your sign-in could not be completed — the server stopped responding.",
          );
          onNetworkError?.();
        } else {
          setFormErrors(resp?.message || "Sign in failed. Please try again.");
        }
        return;
      }
      // On successful login, save credentials if checkbox is checked
      if (savedLogin) {
        setStorageLoginData({
          is_saved: true,
          saved_user: username,
        });
      }
      // Hold the busy state briefly before navigating.
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_BUSY_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_BUSY_MS - elapsed));
      }
      navigate("/bsuite/modules");
    } catch {
      // The failure has already been surfaced through formErrors.
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    formData,
    formErrors,
    networkError,
    savedLogin,
    //functions
    handleChange,
    handleSubmitClick,
    handleSavedLoginChange,
    handleTryDifferentUser,
    clearNetworkError,
  };
};
export default useLogin;
