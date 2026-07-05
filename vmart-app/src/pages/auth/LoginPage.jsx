import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext.jsx";
import "./LoginPage.css";

// Step types
const STEP = {
  USER_ID: "USER_ID", // only userId field
  PASSWORD: "PASSWORD", // userId + password (existing user)
  REGISTER: "REGISTER", // userId + password + name + address (new user)
};

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const vmart = searchParams.get("vmart");
  const navigate = useNavigate();
  const { checkUserId, login, register } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(STEP.USER_ID);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    password: "",
    name: "",
    address: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // ── Step 1: check userId ──────────────────────────────────────────────────
  const handleContinue = async () => {
    if (!form.userId.trim()) {
      showToast("warn", "Required", "Please enter your email or mobile number");
      return;
    }
    const { found } = await checkUserId(form.userId);
    if (found && Object.keys(found).length > 0) {
      setStep(STEP.PASSWORD);
    } else {
      setStep(STEP.REGISTER);
    }
  };

  // ── Step 2: login ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!form.password) {
      showToast("warn", "Required", "Please enter your password");
      return;
    }
    setLoading(true);
    const res = await login({ userId: form.userId, password: form.password });
    setLoading(false);
    if (res.success) {
      showToast("success", "Welcome back!", res.message);
      navigate("/");
    } else {
      showToast("error", "Login Failed", res.message);
    }
  };

  // ── Step 3: register ──────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!form.password) {
      showToast("warn", "Required", "Please enter a password");
      return;
    }
    if (!form.name.trim()) {
      showToast("warn", "Required", "Please enter your name");
      return;
    }
    if (!form.address.trim()) {
      showToast("warn", "Required", "Please enter your address");
      return;
    }

    if (!vmart) {
      showToast("warn", "Required", "Please scan QR code again");
      return;
    }
    //set form. shop = vmart
    setLoading(true);
    const res = await register({
      ...form,
      shop: vmart,
    });
    setLoading(false);
    if (res.success) {
      showToast("success", "Account Created!", "Welcome to Virtual Mart");
      navigate("/");
    } else {
      showToast("error", "Error", res.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === STEP.USER_ID) handleContinue();
    if (step === STEP.PASSWORD) handleLogin();
    if (step === STEP.REGISTER) handleRegister();
  };

  const stepLabel = {
    [STEP.USER_ID]: {
      title: "Sign In",
      sub: "Enter your email or mobile number",
    },
    [STEP.PASSWORD]: {
      title: "Enter Password",
      sub: "Welcome back! Please enter your password",
    },
    [STEP.REGISTER]: {
      title: "Create Account",
      sub: "New here? Fill in your details to get started",
    },
  };

  return (
    <div className="login-container">
      {/* ── Brand ── */}
      <div className="login-brand-section">
        <div className="login-logo-container">
          <img src="/shop-50.png" alt="Logo" />
        </div>
        <h1 className="text-white p-1">Virtual Mart</h1>
        <span className="text-m text-gray-200">{"Your Trusted Store"}</span>
      </div>

      {/* ── Form ── */}
      <div className="login-form-section">
        <h2 className="text-gray-800">
          {stepLabel[step].title} with {vmart && `Shop No — ${vmart}`}
        </h2>
        <span className="text-sm text-gray-600 mb-4">
          {stepLabel[step].sub}
        </span>

        <form
          onSubmit={handleSubmit}
          className="grid items-center justify-center p-3 mt-3 lite-card"
        >
          {/* User ID — always visible */}
          <div className="col-12">
            <label className="block font-bold mb-2 text-sm text-gray-700">
              <span className="pi pi-user mr-2" />
              Email or Mobile
            </label>
            <input
              type="text"
              value={form.userId}
              onChange={set("userId")}
              placeholder="e.g. john@test.com or 01812..."
              className="w-full"
              disabled={step !== STEP.USER_ID}
              style={{
                opacity: step !== STEP.USER_ID ? 0.7 : 1,
                background:
                  step !== STEP.USER_ID ? "var(--background)" : undefined,
              }}
              autoComplete="username"
            />
            {step !== STEP.USER_ID && (
              <button
                type="button"
                onClick={() => {
                  setStep(STEP.USER_ID);
                  setForm({ ...form, password: "", name: "", address: "" });
                }}
                style={{
                  fontSize: "12px",
                  color: "var(--primary)",
                  background: "none",
                  border: "none",
                  marginTop: "4px",
                  cursor: "pointer",
                }}
              >
                &#8678; Change
              </button>
            )}
          </div>

          {/* Password — steps 2 & 3 */}
          {(step === STEP.PASSWORD || step === STEP.REGISTER) && (
            <div className="col-12">
              <label className="block font-bold mb-2 text-sm text-gray-700">
                <span className="pi pi-lock mr-2" />
                {step === STEP.REGISTER ? "Create Password" : "Password"}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder={
                  step === STEP.REGISTER
                    ? "Set a password"
                    : "Enter your password"
                }
                className="w-full"
                autoComplete={
                  step === STEP.REGISTER ? "new-password" : "current-password"
                }
              />
            </div>
          )}

          {/* Name & Address — step 3 only */}
          {step === STEP.REGISTER && (
            <>
              <div className="col-12">
                <label className="block font-bold mb-2 text-sm text-gray-700">
                  <span className="pi pi-user-edit mr-2" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <label className="block font-bold mb-2 text-sm text-gray-700">
                  <span className="pi pi-map-marker mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Flat, House, Road, Area..."
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
                  ℹ️ ID not found — creating a new customer account
                </p>
              </div>
            </>
          )}

          {/* Submit */}
          <div className="col-12 mt-3">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading && <span className="pi pi-spin pi-spinner" />}
              {step === STEP.USER_ID && (
                <>
                  <span className="pi pi-arrow-right" /> Continue
                </>
              )}
              {step === STEP.PASSWORD && (
                <>
                  <span className="pi pi-sign-in" /> Sign In
                </>
              )}
              {step === STEP.REGISTER && (
                <>
                  <span className="pi pi-user-plus" /> Create Account &amp; Sign
                  In
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo hint */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#666",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong>Demo accounts:</strong>
            <br />
            🏪 Shop: <code>shop1@vmart.com</code> / <code>123456</code>
            <br />
            🛒 Customer: <code>john@test.com</code> / <code>123456</code>
            <br />
            <em>Or enter any new email/mobile to self-register</em>
          </p>
        </div>

        <div
          className="text-center mt-3"
          style={{ fontSize: "11px", color: "#aaa" }}
        >
          Enterprise · Automation · Analytics · Control
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
