import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Github, Chrome } from "lucide-react";
import "./LoginPage.css";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext.jsx";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const LoginPage = () => {
  //SYS_PGE_LGIN, SYS_PGE_LGIN_PSWD, SYS_PGE_REG
  const [searchParams] = useSearchParams();
  const vmart = searchParams.get("vmart");
  const navigate = useNavigate();
  const [frmType, setFrmType] = useState("SYS_PGE_REG");
  const [formData, setFormData] = useState({
    users_email: "staff1@sgd.com",
    password: "123456",
    name: "",
    address: "",
    virtual_mart: "",
    page_type: "",
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setFormData({
      ...formData,
      virtual_mart: vmart,
      page_type: frmType,
    });
  }, [frmType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login({
      users_email: formData.users_email,
      users_pswrd: formData.password,
      customer_name: formData.name,
      customer_address: formData.address,
      virtual_mart: vmart,
      page_type: frmType,
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
        <h1 className="text-white p-1">Virtual Mart</h1>
        <span className="text-m text-gray-200">Your Trusted Store</span>
      </div>

      {/* Form Section */}
      <div className="login-form-section">
        <h2 className="text-gray-800">
          {formData.virtual_mart
            ? `Mart No - ${formData.virtual_mart}`
            : "Welcome Back"}
        </h2>
        <span className="text-sm text-gray-600 mb-4">
          Sign in to continue to your session
        </span>

        <div className="grid items-center justify-center p-3 mt-3 lite-card">
          <div className="col-12">
            <label className="block font-bold mb-2 text-sm text-gray-700">
              <span className="pi pi-user mr-2"></span>
              Email or Mobile
            </label>
            <InputText
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full ${errors.email ? "p-invalid" : ""}`}
              placeholder={`Enter email or mobile`}
              required
              size="small"
            />
          </div>
          {(frmType === "SYS_PGE_LGIN_PSWD" || frmType === "SYS_PGE_REG") && (
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
          )}

          {formData.virtual_mart && frmType === "SYS_PGE_REG" && (
            <>
              <div className="col-12">
                <label className="block font-bold mb-2 text-sm text-gray-700">
                  <span className="pi pi-user-edit mr-2"></span>
                  Your Name
                </label>
                <InputText
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full ${errors.name ? "p-invalid" : ""}`}
                  placeholder={`Enter your name`}
                  required
                  size="small"
                />
              </div>

              <div className="col-12">
                <label className="block font-bold mb-2 text-sm text-gray-700">
                  <span className="pi pi-flag mr-2"></span>
                  Your Address
                </label>
                <InputText
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  className={`w-full ${errors.address ? "p-invalid" : ""}`}
                  placeholder={`Enter Flat, House, Road etc.`}
                  required
                  size="small"
                />
              </div>
            </>
          )}
          <div className="col-12 mt-4">
            <Button
              icon="pi pi-angle-double-right"
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
            onClick={() =>
              (window.location.href = "http://localhost:5173/login")
            }
            label="Switch to Web"
            size="small"
            text
          />
        </div>
        <div className="text-center">
          Enterprise.Automation.Analytics.Control
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
