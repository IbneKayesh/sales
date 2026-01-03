import React from "react";
import { useSearchParams } from "react-router-dom";
import LoginComponent from "./LoginComponent";
import RegistrationComponent from "./RegistrationComponent";
import ForgotPasswordComponent from "./ForgotPasswordComponent";
import "./AuthPage.css";

const AuthPage = ({ toast, defComp }) => {
  const [searchParams] = useSearchParams();
  const component = searchParams.get("view") || defComp;

  return (
    <div className="auth-container">
      <ul className="bouncing-elements">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      <div className="flame-box">
        <div className="flame-wave -one"></div>
        <div className="flame-wave -two"></div>
        <div className="flame-wave -three"></div>
      </div>
      {component === "login" && <LoginComponent toast={toast} />}
      {component === "register" && <RegistrationComponent toast={toast} />}
      {component === "forgot-password" && (
        <ForgotPasswordComponent toast={toast} />
      )}
    </div>
  );
};

export default AuthPage;
