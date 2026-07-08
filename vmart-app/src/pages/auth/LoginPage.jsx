import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import LoginForgotC from "./LoginForgotC";
import LoginRegisterC from "./LoginRegisterC";
import LogRoleC from "./LogRoleC";
import LogPassC from "./LogPassC";
import "./LoginPage.css";
import useLogin from "@/hooks/useLogin";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
  const {
    crTitle,
    crView,
    formData,
    errors,
    vmart,
    viewTitle,
    roleName,
    handleChange,
    handleSubmitLogin,
    handleChangeMobileNo,
    handleChangeRole,
    handleForgotPassword,
  } = useLogin();

  const navigate = useNavigate();
  const {
    loginAsCustomer,
    loginAsShop,
    isAuthenticated,
    user,
    hasPassword,
    changePassword,
    lookupUser,
    verifyPassword,
    verifySecurityAnswer,
  } = useAuth();
  const { showToast, setIsBusy, isBusy } = useUI();

  /* ── Multi-step state ── */
  const [step, setStep] = useState("name"); // "name" | "verify" | "register" | "forgot" | "loggedIn"
  const [role, setRole] = useState("CUSTOMER");
  const [name, setName] = useState("");

  /* ── Verify step ── */
  const [loginPassword, setLoginPassword] = useState("");
  const [existingUser, setExistingUser] = useState(null);

  /* ── Register step ── */
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
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
              {user.role === ROLES.SHOP
                ? `Shop - ${user.shopName || user.name}`
                : "Customer"}
            </p>
          </div>
          <div className="auth-content">
            <h3>Welcome, {user.name}!</h3>
            <p className="auth-role-label">
              {user.role === ROLES.SHOP
                ? "Vendor / Shop Owner"
                : "Customer Account"}
            </p>
            {user.contact && <p>📞 {user.contact}</p>}
            {user.address && <p>📍 {user.address}</p>}

            {/* Change Password */}
            <div className="auth-section">
              <button
                className="ui-btn ui-btn-secondary auth-btn-pill"
                onClick={() => {
                  setShowChangePassword(!showChangePassword);
                  setOldPw("");
                  setNewPw("");
                  setConfirmNewPw("");
                }}
              >
                🔑 {showChangePassword ? "Cancel" : "Change Password"}
              </button>

              {showChangePassword && (
                <div className="auth-pw-form">
                  {user.password && (
                    <div className="ui-form-field auth-form-field-zero">
                      <label
                        className="ui-form-label"
                        htmlFor="login-current-pw"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="login-current-pw"
                        name="login-current-pw"
                        className="ui-input"
                        placeholder="Enter current password"
                        value={oldPw}
                        onChange={(e) => setOldPw(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="ui-form-field auth-form-field-zero">
                    <label className="ui-form-label" htmlFor="login-new-pw">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="login-new-pw"
                      name="login-new-pw"
                      className="ui-input"
                      placeholder="Enter new password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                    />
                  </div>
                  <div className="ui-form-field auth-form-field-zero">
                    <label className="ui-form-label" htmlFor="login-confirm-pw">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="login-confirm-pw"
                      name="login-confirm-pw"
                      className="ui-input"
                      placeholder="Confirm new password"
                      value={confirmNewPw}
                      onChange={(e) => setConfirmNewPw(e.target.value)}
                    />
                  </div>
                  <button
                    className="ui-btn ui-btn-primary auth-btn-compact"
                    onClick={async () => {
                      if (!newPw.trim()) return;
                      if (newPw !== confirmNewPw) {
                        showToast("Passwords do not match", "error");
                        return;
                      }
                      if (newPw.length < 4) {
                        showToast(
                          "Password must be at least 4 characters",
                          "error",
                        );
                        return;
                      }
                      setIsBusy(true);
                      try {
                        await changePassword(oldPw, newPw);
                        showToast("Password changed successfully");
                        setShowChangePassword(false);
                        setOldPw("");
                        setNewPw("");
                        setConfirmNewPw("");
                      } catch (err) {
                        showToast(err.message, "error");
                      }
                      setIsBusy(false);
                    }}
                    disabled={!newPw.trim() || newPw !== confirmNewPw || isBusy}
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>

            <div className="auth-actions-row">
              <button
                className="ui-btn ui-btn-primary auth-btn-flex"
                onClick={() =>
                  navigate(user.role === ROLES.SHOP ? "/shop" : "/shopping")
                }
              >
                {user.role === ROLES.SHOP
                  ? "Go to Dashboard"
                  : "Start Shopping"}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const isShopOwner = role === "ROLES.SHOP";

  /* ── Handle name submission ── */
  const handleNameSubmit = () => {
    if (!name.trim()) return;
    const found = lookupUser(name.trim(), role);
    if (found && found.password) {
      setExistingUser(found);
      setLoginPassword("");
      setStep("verify");
    } else {
      const shopData = load(KEYS.SHOPS).find(
        (s) => s.name === (found?.shopName || name.trim()),
      );
      if (found) {
        setShopName(found.shopName || "");
        setShopDescription(shopData?.description || found.description || "");
        setContact(found.contact || "");
        setAddress(found.address || "");
        setSecurityQuestion(found.securityQuestion || "");
        setSecurityAnswer(found.securityAnswer || "");
      } else {
        setShopName("");
        setShopDescription("");
        setContact("");
        setAddress("");
        setSecurityQuestion("");
        setSecurityAnswer("");
      }
      setPassword("");
      setConfirmPassword("");
      setStep("register");
    }
  };

  const handleNameSubmit1 = async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("5 seconds later");
    // Your code here
  };

  /* ── Handle password verification ── */
  const handleVerify = () => {
    if (!loginPassword.trim()) return;
    setIsBusy(true);
    const result = verifyPassword(name.trim(), role, loginPassword);
    if (result.valid) {
      const data = result.data;
      if (role === ROLES.SHOP) {
        loginAsShop({
          name: data.name,
          shopName: data.shopName || data.name,
          contact: data.contact || "",
          address: data.address || "",
          password: data.password || "",
        });
      } else {
        loginAsCustomer({
          name: data.name,
          contact: data.contact || "",
          address: data.address || "",
          password: data.password || "",
        });
      }
      navigate("/");
    } else {
      showToast(
        result.reason === "Incorrect password"
          ? "Wrong password. Try again."
          : "Account not found",
        "error",
      );
      setIsBusy(false);
    }
  };

  /* ── Handle registration ── */
  const handleRegister = () => {
    if (!name.trim()) return;
    if (password && password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (password && password.length < 4) {
      showToast("Password must be at least 4 characters", "error");
      return;
    }
    if (securityQuestion === "custom" && !customQuestion.trim()) {
      showToast("Please enter your custom security question", "error");
      return;
    }

    setIsBusy(true);
    const effectiveQuestion =
      securityQuestion === "custom" ? customQuestion : securityQuestion;

    if (role === ROLES.SHOP) {
      loginAsShop({
        name: name.trim(),
        shopName: shopName.trim() || name.trim(),
        contact,
        address,
        password,
        securityQuestion: effectiveQuestion,
        securityAnswer,
      });
      const shops = load(KEYS.SHOPS);
      if (!shops.find((s) => s.name === (shopName.trim() || name.trim()))) {
        shops.push({
          name: shopName.trim() || name.trim(),
          description: shopDescription.trim(),
          contact,
          address,
        });
        save(KEYS.SHOPS, shops);
      }
    } else {
      loginAsCustomer({
        name: name.trim(),
        contact,
        address,
        password,
        securityQuestion: effectiveQuestion,
        securityAnswer,
      });
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
      showToast(
        result.reason === "Incorrect answer"
          ? "Wrong answer. Try again."
          : result.reason,
        "error",
      );
    }
  };

  const handleForgotReset = () => {
    if (!forgotNewPw.trim()) return;
    if (forgotNewPw !== forgotConfirmPw) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (forgotNewPw.length < 4) {
      showToast("Password must be at least 4 characters", "error");
      return;
    }

    setIsBusy(true);
    if (role === ROLES.SHOP) {
      loginAsShop({
        name: name.trim(),
        shopName: existingUser?.shopName || name.trim(),
        contact: existingUser?.contact || "",
        address: existingUser?.address || "",
        password: forgotNewPw,
        securityQuestion: existingUser?.securityQuestion || "",
        securityAnswer: existingUser?.securityAnswer || "",
      });
    } else {
      loginAsCustomer({
        name: name.trim(),
        contact: existingUser?.contact || "",
        address: existingUser?.address || "",
        password: forgotNewPw,
        securityQuestion: existingUser?.securityQuestion || "",
        securityAnswer: existingUser?.securityAnswer || "",
      });
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
          <div className="auth-logo">🛍️</div>
          <h1 className="auth-brand-title">Virtual Mart</h1>
          <p className="auth-brand-text">Your Trusted Store</p>
        </div>

        <div className="auth-content">
          <h3>{viewTitle.title}</h3>
          <p>{viewTitle.subTitle}</p>

          {/* ── Step 1: Enter Name ── */}
          {crView === "LOGIN" && (
            <LogRoleC roleName={roleName} onChangeRole={handleChangeRole} />
          )}

          <FormField label="Mobile No" htmlFor="users_id">
            <Input
              name="users_id"
              placeholder="Enter contact no"
              value={formData.user_id}
              onChange={(e) => handleChange("users_id", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitLogin();
              }}
              autoFocus
              disabled={crView !== "LOGIN"}
            />
          </FormField>
          {/* ── Step 2: Password Verification ── */}
          {(crView === "PASSWORD" || crView === "SIGNUP") && (
            <LogPassC
              formData={formData}
              onChangeMobileNo={handleChangeMobileNo}
              onChange={handleChange}
              onSubmitLogin={handleSubmitLogin}
              onForgotPassword={handleForgotPassword}
            />
          )}

          <Button
            variant="primary"
            className="auth-btn-full"
            onClick={handleSubmitLogin}
            disabled={isBusy}
          >
            {viewTitle.button}
          </Button>

          {/* ── Step 3: Forgot Password ── */}
          {step === "forgot" && (
            <LoginForgotC
              name={name}
              isShopOwner={isShopOwner}
              resolvedQuestion={resolvedQuestion}
              forgotAnswer={forgotAnswer}
              onForgotAnswerChange={setForgotAnswer}
              forgotNewPw={forgotNewPw}
              onForgotNewPwChange={setForgotNewPw}
              forgotConfirmPw={forgotConfirmPw}
              onForgotConfirmPwChange={setForgotConfirmPw}
              forgotVerified={forgotVerified}
              onForgotSubmit={handleForgotSubmit}
              onForgotReset={handleForgotReset}
              onBackToName={backToName}
              onRegister={() => {
                setStep("register");
                setPassword("");
                setConfirmPassword("");
              }}
              isBusy={isBusy}
            />
          )}

          {/* ── Step 4: Registration / Profile Setup ── */}
          {step === "register" && (
            <LoginRegisterC
              name={name}
              onNameChange={setName}
              isShopOwner={isShopOwner}
              existingUser={existingUser}
              shopName={shopName}
              onShopNameChange={setShopName}
              shopDescription={shopDescription}
              onShopDescriptionChange={setShopDescription}
              contact={contact}
              onContactChange={setContact}
              address={address}
              onAddressChange={setAddress}
              password={password}
              onPasswordChange={setPassword}
              confirmPassword={confirmPassword}
              onConfirmPasswordChange={setConfirmPassword}
              securityQuestion={securityQuestion}
              onSecurityQuestionChange={setSecurityQuestion}
              securityAnswer={securityAnswer}
              onSecurityAnswerChange={setSecurityAnswer}
              customQuestion={customQuestion}
              onCustomQuestionChange={setCustomQuestion}
              onRegister={handleRegister}
              onBackToName={backToName}
              securityQuestions={SECURITY_QUESTIONS}
              isBusy={isBusy}
            />
          )}

          <p className="auth-footer-text">Powered by vMart@SGD</p>
        </div>
      </section>
    </div>
  );
}
