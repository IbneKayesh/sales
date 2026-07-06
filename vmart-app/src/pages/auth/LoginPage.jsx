import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

import "./LoginPage.css";

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite book?",
  "What was the name of your first school?",
  "What is your favorite food?",
  "What is your dream job?",
  "What is your favorite movie?",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsCustomer, loginAsShop, isAuthenticated, user, hasPassword, changePassword, lookupUser, verifyPassword, verifySecurityAnswer } = useAuth();
  const { showToast } = useUI();

  /* ── Multi-step state ── */
  const [step, setStep] = useState("name"); // "name" | "verify" | "register" | "forgot" | "loggedIn"
  const [role, setRole] = useState("CUSTOMER");
  const [name, setName] = useState("");

  /* ── Verify step ── */
  const [loginPassword, setLoginPassword] = useState("");
  const [existingUser, setExistingUser] = useState(null);

  /* ── Register step ── */
  const [shopName, setShopName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");

  /* ── Forgot password step ── */
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [forgotNewPw, setForgotNewPw] = useState("");
  const [forgotConfirmPw, setForgotConfirmPw] = useState("");
  const [forgotVerified, setForgotVerified] = useState(false);

  /* ── Change password (logged in view) ── */
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmNewPw, setConfirmNewPw] = useState("");

  /* If already logged in, show profile */
  if (isAuthenticated && user) {
    return (
      <div className="app-shell app-shell--auth">
        <section className="page-section auth-page">
          <div className="auth-brand">
            <div className="auth-logo">
              {user.role === ROLES.SHOP ? "🏪" : "👤"}
            </div>
            <h1 className="auth-brand-title">Virtual Mart</h1>
            <p className="auth-brand-text">
              {user.role === ROLES.SHOP ? `Shop - ${user.shopName || user.name}` : "Customer"}
            </p>
          </div>
          <div className="auth-content">
            <h3>Welcome, {user.name}!</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 500 }}>
              {user.role === ROLES.SHOP ? "Vendor / Shop Owner" : "Customer Account"}
            </p>
            {user.contact && <p>📞 {user.contact}</p>}
            {user.address && <p>📍 {user.address}</p>}

            {/* Change Password */}
            <div style={{ marginTop: "var(--space-3)" }}>
              <button className="ui-btn ui-btn-secondary" onClick={() => { setShowChangePassword(!showChangePassword); setOldPw(""); setNewPw(""); setConfirmNewPw(""); }}
                style={{ fontSize: "0.8rem", width: "100%" }}>
                🔑 {showChangePassword ? "Cancel" : "Change Password"}
              </button>

              {showChangePassword && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--bg-disabled)" }}>
                  {user.password && (
                    <div className="ui-form-field" style={{ margin: 0 }}>
                      <label className="ui-form-label" htmlFor="login-current-pw">Current Password</label>
                      <input type="password" id="login-current-pw" name="login-current-pw" className="ui-input" placeholder="Enter current password"
                        value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
                    </div>
                  )}
                  <div className="ui-form-field" style={{ margin: 0 }}>
                    <label className="ui-form-label" htmlFor="login-new-pw">New Password</label>
                    <input type="password" id="login-new-pw" name="login-new-pw" className="ui-input" placeholder="Enter new password"
                      value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                  </div>
                  <div className="ui-form-field" style={{ margin: 0 }}>
                    <label className="ui-form-label" htmlFor="login-confirm-pw">Confirm New Password</label>
                    <input type="password" id="login-confirm-pw" name="login-confirm-pw" className="ui-input" placeholder="Confirm new password"
                      value={confirmNewPw} onChange={(e) => setConfirmNewPw(e.target.value)} />
                  </div>
                  <button className="ui-btn ui-btn-primary" onClick={async () => {
                    if (!newPw.trim()) return;
                    if (newPw !== confirmNewPw) { showToast("Passwords do not match", "error"); return; }
                    if (newPw.length < 4) { showToast("Password must be at least 4 characters", "error"); return; }
                    try {
                      await changePassword(oldPw, newPw);
                      showToast("Password changed successfully");
                      setShowChangePassword(false);
                      setOldPw(""); setNewPw(""); setConfirmNewPw("");
                    } catch (err) { showToast(err.message, "error"); }
                  }} disabled={!newPw.trim() || newPw !== confirmNewPw} style={{ fontSize: "0.8rem", padding: "var(--space-2)" }}>
                    Update Password
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
              <button className="ui-btn ui-btn-primary"
                onClick={() => navigate(user.role === ROLES.SHOP ? "/shop" : "/shopping")}
                style={{ flex: 1 }}>
                {user.role === ROLES.SHOP ? "Go to Dashboard" : "Start Shopping"}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const isShopOwner = role === ROLES.SHOP;

  /* ── Handle name submission ── */
  const handleNameSubmit = () => {
    if (!name.trim()) return;
    const found = lookupUser(name.trim(), role);
    if (found && found.password) {
      setExistingUser(found);
      setLoginPassword("");
      setStep("verify");
    } else {
      if (found) {
        setShopName(found.shopName || "");
        setContact(found.contact || "");
        setAddress(found.address || "");
        setSecurityQuestion(found.securityQuestion || "");
        setSecurityAnswer(found.securityAnswer || "");
      } else {
        setShopName(""); setContact(""); setAddress("");
        setSecurityQuestion(""); setSecurityAnswer("");
      }
      setPassword(""); setConfirmPassword("");
      setStep("register");
    }
  };

  /* ── Handle password verification ── */
  const handleVerify = () => {
    if (!loginPassword.trim()) return;
    const result = verifyPassword(name.trim(), role, loginPassword);
    if (result.valid) {
      const data = result.data;
      if (role === ROLES.SHOP) {
        loginAsShop({ name: data.name, shopName: data.shopName || data.name, contact: data.contact || "", address: data.address || "", password: data.password || "" });
      } else {
        loginAsCustomer({ name: data.name, contact: data.contact || "", address: data.address || "", password: data.password || "" });
      }
      navigate("/");
    } else {
      showToast(result.reason === "Incorrect password" ? "Wrong password. Try again." : "Account not found", "error");
    }
  };

  /* ── Handle registration ── */
  const handleRegister = () => {
    if (!name.trim()) return;
    if (password && password !== confirmPassword) { showToast("Passwords do not match", "error"); return; }
    if (password && password.length < 4) { showToast("Password must be at least 4 characters", "error"); return; }
    if (securityQuestion === "custom" && !customQuestion.trim()) { showToast("Please enter your custom security question", "error"); return; }

    const effectiveQuestion = securityQuestion === "custom" ? customQuestion : securityQuestion;

    if (role === ROLES.SHOP) {
      loginAsShop({ name: name.trim(), shopName: shopName.trim() || name.trim(), contact, address, password, securityQuestion: effectiveQuestion, securityAnswer });
      const shops = load(KEYS.SHOPS);
      if (!shops.find((s) => s.name === (shopName.trim() || name.trim()))) {
        shops.push({ name: shopName.trim() || name.trim(), description: "", contact, address });
        save(KEYS.SHOPS, shops);
      }
    } else {
      loginAsCustomer({ name: name.trim(), contact, address, password, securityQuestion: effectiveQuestion, securityAnswer });
    }
    navigate("/");
  };

  /* ── Forgot password flow ── */
  const handleForgotSubmit = () => {
    if (!forgotAnswer.trim()) return;
    const result = verifySecurityAnswer(name.trim(), role, forgotAnswer);
    if (result.valid) {
      setForgotVerified(true);
      setForgotNewPw("");
      setForgotConfirmPw("");
      showToast("Answer correct! Set your new password.", "success");
    } else {
      showToast(result.reason === "Incorrect answer" ? "Wrong answer. Try again." : result.reason, "error");
    }
  };

  const handleForgotReset = () => {
    if (!forgotNewPw.trim()) return;
    if (forgotNewPw !== forgotConfirmPw) { showToast("Passwords do not match", "error"); return; }
    if (forgotNewPw.length < 4) { showToast("Password must be at least 4 characters", "error"); return; }

    /* Update password in registry via login (which calls registerUser) */
    if (role === ROLES.SHOP) {
      loginAsShop({ name: name.trim(), shopName: existingUser?.shopName || name.trim(), contact: existingUser?.contact || "", address: existingUser?.address || "", password: forgotNewPw, securityQuestion: existingUser?.securityQuestion || "", securityAnswer: existingUser?.securityAnswer || "" });
    } else {
      loginAsCustomer({ name: name.trim(), contact: existingUser?.contact || "", address: existingUser?.address || "", password: forgotNewPw, securityQuestion: existingUser?.securityQuestion || "", securityAnswer: existingUser?.securityAnswer || "" });
    }
    showToast("Password reset successfully!");
    navigate("/");
  };

  /* ── Go back to name step ── */
  const backToName = () => {
    setStep("name");
    setLoginPassword("");
    setExistingUser(null);
    setForgotVerified(false);
    setForgotAnswer("");
  };

  const resolvedQuestion = existingUser?.securityQuestion || "";

  return (
    <div className="app-shell app-shell--auth">
      <section className="page-section auth-page">
        <div className="auth-brand">
          <div className="auth-logo">🚀</div>
          <h1 className="auth-brand-title">Virtual Mart</h1>
          <p className="auth-brand-text">Multi-Vendor Marketplace</p>
        </div>

        <div className="auth-content">
          {/* ── Step 1: Enter Name ── */}
          {step === "name" && (
            <>
              <h3>Sign In</h3>
              <p>Enter your name to get started</p>
              <div style={{ display: "flex", gap: "var(--space-2)", background: "var(--bg-disabled)", borderRadius: "var(--radius-md)", padding: "var(--space-1)" }}>
                <button onClick={() => setRole("CUSTOMER")}
                  style={{ flex: 1, padding: "var(--space-3)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: role === "CUSTOMER" ? 600 : 400, background: role === "CUSTOMER" ? "var(--bg-surface)" : "transparent", color: role === "CUSTOMER" ? "var(--accent)" : "var(--text)", boxShadow: role === "CUSTOMER" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", fontSize: "0.9rem", transition: "all 0.15s ease" }}>
                  👤 Customer
                </button>
                <button onClick={() => setRole("SHOP")}
                  style={{ flex: 1, padding: "var(--space-3)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: role === "SHOP" ? 600 : 400, background: role === "SHOP" ? "var(--bg-surface)" : "transparent", color: role === "SHOP" ? "var(--accent)" : "var(--text)", boxShadow: role === "SHOP" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", fontSize: "0.9rem", transition: "all 0.15s ease" }}>
                  🏪 Shop Owner
                </button>
              </div>
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="login-name">Your Name</label>
                <input type="text" id="login-name" name="login-name" className="ui-input" placeholder="Full name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleNameSubmit(); }} />
              </div>
              <button type="button" className="ui-btn ui-btn-primary" onClick={handleNameSubmit}
                disabled={!name.trim()} style={{ width: "100%" }}>
                Continue
              </button>
            </>
          )}

          {/* ── Step 2: Password Verification ── */}
          {step === "verify" && (
            <>
              <h3>Welcome Back!</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
                {isShopOwner ? "🏪 " : "👤 "}{name}
                <button onClick={backToName} style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginLeft: "var(--space-2)", textDecoration: "underline" }}>
                  (Not you?)
                </button>
              </p>
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="verify-password">Password</label>
                <input type="password" id="verify-password" name="verify-password" className="ui-input" placeholder="Enter your password"
                  value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
                  autoFocus />
              </div>
              <button type="button" className="ui-btn ui-btn-primary" onClick={handleVerify}
                disabled={!loginPassword.trim()} style={{ width: "100%" }}>
                Sign In
              </button>
              {resolvedQuestion && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", textAlign: "center" }}>
                  Forgot your password?
                  <button onClick={() => { setForgotAnswer(""); setForgotVerified(false); setStep("forgot"); }}
                    style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textDecoration: "underline", marginLeft: 4 }}>
                    Reset with security question
                  </button>
                </p>
              )}
              {!resolvedQuestion && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", textAlign: "center" }}>
                  Forgot your password?
                  <button onClick={() => { setStep("register"); setPassword(""); setConfirmPassword(""); }}
                    style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textDecoration: "underline", marginLeft: 4 }}>
                    Set a new one
                  </button>
                </p>
              )}
            </>
          )}

          {/* ── Step 3: Forgot Password (Security Question) ── */}
          {step === "forgot" && (
            <>
              <h3>Reset Password</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
                {isShopOwner ? "🏪 " : "👤 "}{name}
                <button onClick={backToName} style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginLeft: "var(--space-2)", textDecoration: "underline" }}>
                  (Not you?)
                </button>
              </p>

              {!forgotVerified ? (
                <>
                  <div className="ui-card" style={{ background: "var(--accent-soft)", border: "none", padding: "var(--space-4)" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-h)", fontWeight: 500 }}>
                      🔒 Security Question
                    </p>
                    <p style={{ margin: "var(--space-2) 0 0", fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600 }}>
                      {resolvedQuestion || "No security question set."}
                    </p>
                  </div>

                  {resolvedQuestion && (
                    <>
                      <div className="ui-form-field">
                        <label className="ui-form-label" htmlFor="forgot-answer">Your Answer</label>
                        <input type="text" id="forgot-answer" name="forgot-answer" className="ui-input" placeholder="Type your answer"
                          value={forgotAnswer} onChange={(e) => setForgotAnswer(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleForgotSubmit(); }}
                          autoFocus />
                      </div>
                      <button type="button" className="ui-btn ui-btn-primary" onClick={handleForgotSubmit}
                        disabled={!forgotAnswer.trim()} style={{ width: "100%" }}>
                        Verify Answer
                      </button>
                    </>
                  )}

                  {!resolvedQuestion && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", textAlign: "center" }}>
                      No security question is set for this account.
                      <br />
                      <button onClick={() => { setStep("register"); setPassword(""); setConfirmPassword(""); }}
                        style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, textDecoration: "underline", marginTop: "var(--space-2)" }}>
                        Set a new password without verification
                      </button>
                    </p>
                  )}

                  <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", textAlign: "center" }}>
                    <button onClick={backToName}
                      style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textDecoration: "underline" }}>
                      ← Back to login
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: 500, textAlign: "center" }}>
                    ✅ Answer verified! Set your new password below.
                  </p>
                  <div className="ui-form-field">
                    <label className="ui-form-label" htmlFor="forgot-new-pw">New Password</label>
                    <input type="password" id="forgot-new-pw" name="forgot-new-pw" className="ui-input" placeholder="Enter new password (min 4 chars)"
                      value={forgotNewPw} onChange={(e) => setForgotNewPw(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && forgotNewPw === forgotConfirmPw) handleForgotReset(); }}
                      autoFocus />
                  </div>
                  <div className="ui-form-field">
                    <label className="ui-form-label" htmlFor="forgot-confirm-pw">Confirm New Password</label>
                    <input type="password" id="forgot-confirm-pw" name="forgot-confirm-pw" className="ui-input" placeholder="Confirm new password"
                      value={forgotConfirmPw} onChange={(e) => setForgotConfirmPw(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && forgotNewPw === e.target.value) handleForgotReset(); }} />
                  </div>
                  <button type="button" className="ui-btn ui-btn-primary" onClick={handleForgotReset}
                    disabled={!forgotNewPw.trim() || forgotNewPw !== forgotConfirmPw}
                    style={{ width: "100%" }}>
                    Reset Password
                  </button>
                </>
              )}
            </>
          )}

          {/* ── Step 4: Registration / Profile Setup ── */}
          {step === "register" && (
            <>
              <h3>{existingUser ? "Update Your Profile" : "Create Your Account"}</h3>
              <p>{existingUser ? "Set or update your account details." : "Fill in your details to continue."}</p>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="register-name">Your Name</label>
                <input type="text" id="register-name" name="register-name" className="ui-input" placeholder="Full name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  disabled={!!existingUser}
                  style={existingUser ? { opacity: 0.6 } : {}} />
                {existingUser && <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Name cannot be changed. Use a different name by going back.</span>}
              </div>

              {isShopOwner && (
                <div className="ui-form-field">
                  <label className="ui-form-label" htmlFor="register-shop-name">Shop Name</label>
                  <input type="text" id="register-shop-name" name="register-shop-name" className="ui-input" placeholder="Your shop name"
                    value={shopName} onChange={(e) => setShopName(e.target.value)} />
                </div>
              )}

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="register-contact">Contact (optional)</label>
                <input type="tel" id="register-contact" name="register-contact" className="ui-input" placeholder="Phone number"
                  value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="register-address">Address (optional)</label>
                <textarea id="register-address" name="register-address" className="ui-textarea" placeholder="Your address" rows={2}
                  value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="register-password">Password {existingUser?.password ? "(leave blank to keep current)" : "(recommended)"}</label>
                <input type="password" id="register-password" name="register-password" className="ui-input" placeholder={existingUser?.password ? "New password" : "Set a password for your account"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && name.trim() && (!password || password === confirmPassword)) handleRegister(); }} />
              </div>
              {password && (
                <div className="ui-form-field">
                  <label className="ui-form-label" htmlFor="register-confirm-pw">Confirm Password</label>
                  <input type="password" id="register-confirm-pw" name="register-confirm-pw" className="ui-input" placeholder="Confirm password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && name.trim() && password === e.target.value) handleRegister(); }} />
                </div>
              )}

              {/* Security Question */}
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="register-security-q">Security Question (optional — used to reset your password)</label>
                <div className="ui-select-wrapper">
                  <select id="register-security-q" name="register-security-q" className="ui-select" value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)}
                    style={{ fontSize: "0.85rem" }}>
                    <option value="">Select a security question</option>
                    {SECURITY_QUESTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                    <option value="custom">✏️ Custom question...</option>
                  </select>
                </div>
              </div>
              {securityQuestion === "custom" && (
                <div className="ui-form-field">
                  <label className="ui-form-label" htmlFor="register-custom-q">Your Custom Question</label>
                  <input type="text" id="register-custom-q" name="register-custom-q" className="ui-input" placeholder="Type your own security question"
                    value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} />
                </div>
              )}
              {securityQuestion && (
                <div className="ui-form-field">
                  <label className="ui-form-label" htmlFor="register-security-a">Your Answer</label>
                  <input type="text" id="register-security-a" name="register-security-a" className="ui-input" placeholder="Answer to your security question"
                    value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} />
                </div>
              )}

              <button type="button" className="ui-btn ui-btn-primary" onClick={handleRegister}
                disabled={!name.trim() || (!!password && password !== confirmPassword)}
                style={{ width: "100%" }}>
                {existingUser ? "Save & Continue" : (isShopOwner ? "Join as Shop Owner" : "Start Shopping")}
              </button>

              <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", textAlign: "center" }}>
                <button onClick={backToName} style={{ border: "none", background: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textDecoration: "underline" }}>
                  ← Use a different name
                </button>
              </p>
            </>
          )}

          <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", textAlign: "center", marginTop: "var(--space-2)" }}>
            {isShopOwner
              ? "Manage your products, orders, invoices and collections."
              : "Browse products from multiple shops and place orders."}
          </p>
        </div>
      </section>
    </div>
  );
}
