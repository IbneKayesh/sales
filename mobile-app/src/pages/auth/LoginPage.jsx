import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Github, Chrome } from "lucide-react";
import "./LoginPage.css";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext.jsx";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    email: "staff1@sgd.com",
    password: "123456",
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login({
      users_email: formData.email,
      users_pswrd: formData.password,
    });
    showToast(
      response.success ? "success" : "error",
      response.success ? "Success" : "Error",
      response.message,
    );

    if (response.success) {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      {/* Brand Section */}
      <div className="login-brand-section">
        <div className="login-logo-container">
          <img src="/shop-50.png" alt="Logo" />
        </div>
        <h1 className="text-white p-1">Business Assistant</h1>
        <span className="text-xs text-gray-200">Field Force Management</span>
      </div>

      {/* Form Section */}
      <div className="login-form-section">
        <h2 className="text-gray-800">Welcome Back</h2>
        <span className="text-sm text-gray-600 mb-4">
          Sign in to continue to your session
        </span>

        <div className="grid items-center justify-center p-3 mt-3 lite-card">
          <div className="col-12">
            <label className="block font-bold mb-2 text-sm text-gray-700">
              <span className="pi pi-envelope mr-2"></span>
              Email
            </label>
            <InputText
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full ${errors.email ? "p-invalid" : ""}`}
              placeholder={`Enter email`}
              required
              size="small"
            />
          </div>
          <div className="col-12">
            <label className="block font-bold mb-2 text-sm text-gray-700">
              <span className="pi pi-lock mr-2"></span>
              Password
            </label>
            <InputText
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`w-full ${errors.password ? "p-invalid" : ""}`}
              placeholder={`Enter password`}
              required
              size="small"
              type="password"
            />
          </div>
          <div className="col-12 mt-4">
            <Button
              icon="pi pi-user"
              type="button"
              onClick={handleSubmit}
              label="Sign In"
              className="w-full"
              size="small"
            />
          </div>
        </div>

        <div className="divider-container">
          <div className="divider-line" />
          <span className="divider-text">OR</span>
          <div className="divider-line" />
        </div>

        <div className="text-center">
          <Button
            icon="pi pi-desktop"
            type="button"
            onClick={() => navigate("/web")}
            label="Switch to Web"
            size="small"
            text
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
