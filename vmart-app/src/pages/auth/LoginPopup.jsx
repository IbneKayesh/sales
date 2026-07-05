import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppUI } from "@/hooks/useAppUI";
import { getStorageLoginData } from "@/utils/storage";
import RequiredText from "@/components/RequiredText";
import "./LoginPopup.css";

const LoginPopup = ({ visible, onHide }) => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { showToast, setIsBusy } = useAppUI();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [savedUser, setSavedUser] = useState(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (visible) {
      const stored = getStorageLoginData();
      if (stored && stored.is_saved && stored.saved_user) {
        setSavedUser(stored.saved_user);
        setTimeout(() => {
          passwordRef.current?.focus();
        }, 300);
      } else {
        handleFullLogin();
      }
    }
  }, [visible]);

  const handleFullLogin = () => {
    onHide();
    logout(false); // Pass false to prevent the popup from showing again
    navigate("/login");
  };

  const handleQuickLogin = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setIsBusy(true);
      setError("");

      const resp = await login({
        username: savedUser.username,
        password: password,
      });

      if (resp.success) {
        setPassword("");
        onHide();
        showToast("success", "Success", "Session restored");
      } else {
        showToast("error", "Login Failed", resp.message || "Invalid password");
        handleFullLogin();
      }
    } catch (err) {
      showToast("error", "Error", "Something went wrong");
      handleFullLogin();
    } finally {
      setIsBusy(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleQuickLogin();
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      closable={false}
      showHeader={false}
      style={{
        width: "90vw",
        maxWidth: "380px",
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
      contentStyle={{
        padding: "1px",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div className="login-popup-card">
        <div className="login-popup-header">
          <h3>EAAC</h3>
          <p>Session is Locked</p>
        </div>

        <div className="login-popup-body">
          {savedUser && (
            <div className="saved-user-container">
              <div className="saved-user-info">
                <div className="user-avatar">
                  <i className="pi pi-user" />
                </div>
                <div className="user-details">
                  <span className="welcome-text">Unlock Session</span>
                  <span className="saved-username">{savedUser.usertext}</span>
                </div>
              </div>
              <button
                type="button"
                className="different-user-btn"
                onClick={handleFullLogin}
              >
                Not you? Try with different user.
              </button>
            </div>
          )}

          <div className="input-group my-4">
            <Password
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Your password"
              feedback={false}
              className="w-full"
              inputStyle={{ width: "100%", borderRadius: "12px" }}
              inputClassName="w-full login-input"
            />
            <RequiredText text={error} />
          </div>

          <Button
            icon="pi pi-lock-open"
            label="Unlock Session"
            className="login-btn"
            style={{ marginTop: 0, height: "48px" }}
            onClick={handleQuickLogin}
          />

          <p className="login-security-text" style={{ margin: 0 }}>
            Secure Connection • EAAC Protected
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default LoginPopup;
